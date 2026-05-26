# Bulk Import Architecture — Full Flow

> Decision record from explore session on 2026-05-25

## Stack (All Free, No Credit Card)

| Layer           | Technology                | Cost              |
|-----------------|---------------------------|--------------------|
| Frontend/SSR    | Nuxt 3 on Vercel          | Free (Hobby)       |
| Database        | Supabase Postgres         | Free tier           |
| Auth            | Supabase Auth             | Free tier           |
| Realtime        | Supabase Realtime         | Free tier           |
| Job Queue       | Postgres table            | Free (already have) |
| Worker          | Vercel API + waitUntil    | Free (self-chain)   |
| Scraping        | cheerio + fetch           | Free (npm)          |
| Sanitization    | sanitize-html             | Free (npm)          |
| Email           | Nodemailer + Resend SMTP  | Free                |

## Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | View counter | Keep current sync RPC — no queue needed |
| 2 | Deployment | Vercel Hobby (free, no CC) — use `waitUntil` chain |
| 3 | Queue | Postgres table (`import_jobs`) — no Redis |
| 4 | Worker | Self-chaining API endpoint — server-side, no client needed |
| 5 | Scraping | cheerio + fetch, VNExpress + Tuổi Trẻ |
| 6 | Thumbnail | Keep original URL, fallback placeholder |
| 7 | Content images | Keep original URL, fetch fail → placeholder |
| 8 | Dedup | Both URL and title |
| 9 | Dashboard | Supabase Realtime (free tier) |
| 10 | Email | Nodemailer + Resend SMTP (free) |
| 11 | Retry | 3 times, exponential backoff (10s, 20s, 40s) |
| 12 | Alert | 1 email per batch when completed, aggregate failures |

## New Database Tables

### import_batches

| Column       | Type          | Notes                                      |
|-------------|---------------|--------------------------------------------|
| id          | uuid PK       | gen_random_uuid()                           |
| category_id | FK→categories |                                             |
| total_urls  | int           |                                             |
| status      | text          | pending/processing/completed/partial_failure |
| invocation_count | int      | Safety counter for chain loop               |
| created_by  | FK→profiles   |                                             |
| created_at  | timestamptz   | default now()                               |
| completed_at| timestamptz   | nullable                                    |

### import_jobs

| Column        | Type          | Notes                              |
|--------------|---------------|------------------------------------|
| id           | uuid PK       | gen_random_uuid()                   |
| batch_id     | FK→batches    |                                     |
| url          | text          |                                     |
| status       | text          | pending/processing/published/failed |
| category_id  | FK→categories | nullable, per-job category override |
| article_id   | FK→articles   | nullable, set on success            |
| error_message| text          | nullable                            |
| retry_count  | int           | default 0                           |
| retry_after  | timestamptz   | nullable, for exponential backoff   |
| created_at   | timestamptz   | default now()                       |
| updated_at   | timestamptz   | default now()                       |

## Self-Chaining Server Pattern

```
POST /api/admin/bulk-import
  ├── Validate articles (format, max 100, vnexpress.net or tuoitre.vn)
  ├── Accepts { articles: [{ url, categoryId }] } with per-article categories
  ├── Dedup check (URL already published in import_jobs)
  ├── Verify all category IDs exist
  ├── INSERT import_batches + import_jobs with per-job category_id
  ├── Return 202 { batchId } → Admin redirected to dashboard
  └── event.waitUntil: fetch /api/admin/process-imports

POST /api/admin/process-imports (internal chain)
  ├── Auth: internal API key OR admin auth
  ├── SELECT 5 pending jobs WHERE retry_after IS NULL OR retry_after <= now()
  │   (FOR UPDATE SKIP LOCKED)
  ├── SET status = 'processing'
  ├── For each job:
  │   ├── Fetch URL with cheerio (auto-detect scraper: vnexpress or tuoitre)
  │   ├── Extract: title, content, thumbnail (og:image), description (og:description)
  │   ├── Content images: keep URLs, replace broken with placeholder
  │   ├── Sanitize HTML (sanitize-html, whitelist safe tags)
  │   ├── Generate slug from title
  │   ├── INSERT into articles (using job.category_id or batch.category_id)
  │   ├── UPDATE job: status=published, article_id=<id>
  │   └── On error:
  │       ├── if retry_count < 3: status=pending, retry_count++,
  │       │   retry_after = now + 10s × 2^retry_count
  │       └── else: status=failed, error_message=reason
  ├── UPDATE batch invocation_count++
  ├── Check remaining pending/retriable jobs
  ├── If remaining > 0 AND invocation_count < max AND batch not stale:
  │   └── event.waitUntil: fetch /api/admin/process-imports (self-chain)
  └── If remaining = 0:
      ├── UPDATE batch status = completed/partial_failure
      └── Send failure digest email if any jobs failed
```

## Chain Safety Guards

1. Max invocations = ceil(total_urls / 5) × 4 + total_urls × 3 (buffer for retries)
2. Stop when no more pending/retriable jobs
3. Stop if batch created > 30 min ago with pending jobs
4. Stop if batch cancelled

## Supported Sources & Selectors

### VNExpress
```
Domain: vnexpress.net
Title: h1.title-detail
Content: article.fck_detail
Thumbnail: meta[property="og:image"]
Description: meta[property="og:description"]
Date: span.date
Pagination: {url}-p{n}
```

### Tuổi Trẻ
```
Domain: tuoitre.vn
Title: h1
Content: .detail-content
Thumbnail: meta[property="og:image"]
Description: meta[property="og:description"]
Pagination: {url}-trang-{n}.htm
Images: data-original attribute → src
```

## Admin UI Pages

### Bulk Import Form (/admin/imports/new)
- Source selection: pill buttons for VNExpress and Tuổi Trẻ
- Click source → fetch categories → category checkboxes with shared limit input
- Fetch articles → article checkboxes with category badges
- "Thêm vào import" → auto-map categories (find-or-create by name)
- Import queue: per-article category, remove button
- Manual URL textarea: paste multiple URLs + category dropdown
- Email notification toggle
- Submit → POST /api/admin/bulk-import with per-article categoryIds

### Progress Dashboard (/admin/imports)
- List of batches with progress bars
- Per-batch: expand to see individual job statuses (with per-job category)
- Real-time updates via Supabase Realtime (subscribe to import_jobs changes)
- Batch header shows all category names from jobs
- Status indicators: Pending ○ → Processing ⟳ → Published ✓ / Failed ✗

## Email Alert (Resend SMTP)

```
.env:
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=re_xxx (API key)
SMTP_FROM=onboarding@resend.dev
ADMIN_EMAIL=admin@example.com
```

Trigger: When batch completes and has failed jobs.
Content: List of failed URLs, timestamps, error reasons.
1 email per batch (not per failure).

## Feature Breakdown (Implementation Order)

1. **bulk-import-db** — Database migrations for import_batches + import_jobs
2. **vnexpress-scraper** — Scraper service + HTML sanitizer utility
3. **bulk-import-api** — API endpoints (bulk-import + process-imports chain)
4. **email-alert-service** — Nodemailer email service for failure alerts
5. **bulk-import-admin-ui** — Admin pages (import form + progress dashboard)
