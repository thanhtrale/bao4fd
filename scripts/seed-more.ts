import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

const topics = [
  { title: 'AI tạo sinh đang thay đổi cách viết code', tag: 'ai' },
  { title: 'Chip M5 của Apple mạnh hơn bao nhiêu so với M4', tag: 'apple' },
  { title: 'Xe điện tự lái đã đạt Level 4 tại Trung Quốc', tag: 'ev' },
  { title: 'Mạng 6G dự kiến triển khai thương mại năm 2030', tag: '6g' },
  { title: 'Startup AI Việt Nam gọi vốn thành công Series A', tag: 'startup' },
  { title: 'Blockchain trong chuỗi cung ứng thực phẩm', tag: 'blockchain' },
  { title: 'Robot phẫu thuật thế hệ mới chính xác đến 0.1mm', tag: 'robot' },
  { title: 'Kính thực tế ảo Meta Quest 4 có gì mới', tag: 'vr' },
  { title: 'Quantum computing đạt bước đột phá mới', tag: 'quantum' },
  { title: 'Cybersecurity trends năm 2026 cần lưu ý', tag: 'security' },
  { title: 'Cloud gaming đang thay thế console truyền thống', tag: 'gaming' },
  { title: 'Ứng dụng IoT trong nông nghiệp thông minh', tag: 'iot' },
  { title: 'Công nghệ pin thể rắn sẽ thay đổi ngành xe điện', tag: 'battery' },
  { title: 'Deepfake ngày càng khó phát hiện', tag: 'deepfake' },
  { title: 'Starlink phủ sóng Internet vệ tinh toàn cầu', tag: 'starlink' },
  { title: 'Hệ điều hành HarmonyOS cạnh tranh với Android', tag: 'harmony' },
  { title: 'Smart home tích hợp AI cá nhân hóa', tag: 'smarthome' },
  { title: 'Công nghệ OLED mới giúp tiết kiệm pin 50%', tag: 'oled' },
  { title: 'Data center xanh giảm phát thải carbon', tag: 'green' },
  { title: 'Low-code platform đang được doanh nghiệp ưa chuộng', tag: 'lowcode' },
]

const excerpts = [
  'Cập nhật những thông tin mới nhất về xu hướng công nghệ nổi bật.',
  'Những đổi mới đáng chú ý đang định hình tương lai ngành tech.',
  'Phân tích chuyên sâu từ các chuyên gia hàng đầu trong lĩnh vực.',
  'Xu hướng mới nhất mà doanh nghiệp và người dùng cần biết.',
  'Tổng hợp tin tức và nhận định về công nghệ đang hot nhất.',
]

function makeContent(title: string, idx: number): string {
  return `<p>${title} - đây là một trong những chủ đề được quan tâm nhất hiện nay trong giới công nghệ. Bài viết này sẽ phân tích chi tiết các khía cạnh quan trọng nhất.</p>
<h2>Tổng quan</h2>
<p>Trong bối cảnh công nghệ phát triển nhanh chóng, ${title.toLowerCase()} đang trở thành tâm điểm của sự chú ý. Các chuyên gia dự đoán lĩnh vực này sẽ tăng trưởng mạnh mẽ trong những năm tới.</p>
<h2>Chi tiết phân tích</h2>
<p>Theo báo cáo mới nhất từ Gartner, thị trường liên quan đã đạt giá trị ${(idx + 1) * 15} tỷ USD trong năm 2025 và dự kiến tăng ${20 + (idx % 30)}% vào năm 2026. Đây là mức tăng trưởng ấn tượng so với trung bình ngành.</p>
<p>Nhiều công ty lớn như Google, Microsoft, Amazon đều đang đầu tư mạnh vào lĩnh vực này. Tại Việt Nam, các startup công nghệ cũng không đứng ngoài cuộc chơi.</p>
<h2>Tác động đến Việt Nam</h2>
<p>Việt Nam đang được đánh giá là một trong những thị trường tiềm năng nhất Đông Nam Á. Với nguồn nhân lực trẻ, giỏi kỹ thuật và chi phí cạnh tranh, nhiều tập đoàn quốc tế đã chọn Việt Nam làm trung tâm R&D.</p>
<p>Bộ Khoa học và Công nghệ cũng đã ban hành nhiều chính sách hỗ trợ phát triển lĩnh vực này, bao gồm ưu đãi thuế và quỹ đầu tư công nghệ.</p>
<h2>Kết luận</h2>
<p>Có thể thấy, ${title.toLowerCase()} không chỉ là trend nhất thời mà đang trở thành nền tảng cho sự phát triển bền vững. Các doanh nghiệp cần nhanh chóng nắm bắt cơ hội để không bị tụt lại phía sau.</p>`
}

async function seedMore() {
  console.log('🌱 Tạo thêm articles cho category Công nghệ...\n')

  // Get cong-nghe category
  const { data: cat, error: catErr } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', 'cong-nghe')
    .single()

  if (catErr || !cat) {
    console.error('❌ Không tìm thấy category cong-nghe:', catErr?.message)
    process.exit(1)
  }

  const TOTAL = 200
  const BATCH = 50
  let created = 0

  for (let batch = 0; batch < Math.ceil(TOTAL / BATCH); batch++) {
    const rows = []
    for (let i = 0; i < BATCH && created + i < TOTAL; i++) {
      const idx = batch * BATCH + i
      const topic = topics[idx % topics.length]
      const num = Math.floor(idx / topics.length) + 1
      const suffix = num > 1 ? ` - Phần ${num}` : ''
      const title = `${topic.title}${suffix}`
      
      rows.push({
        title,
        slug: `${generateSlug(topic.title)}-${topic.tag}-${idx + 100}`,
        excerpt: excerpts[idx % excerpts.length],
        content: makeContent(title, idx),
        category_id: cat.id,
        is_published: true,
        published_at: new Date(Date.now() - (TOTAL - idx) * 1800000).toISOString(),
      })
    }

    const { data, error } = await supabase.from('articles').insert(rows).select('id')
    if (error) {
      console.error(`❌ Batch ${batch + 1}:`, error.message)
    } else {
      created += data.length
      console.log(`  ✅ Batch ${batch + 1}: +${data.length} bài (tổng: ${created})`)
    }
  }

  console.log(`\n🎉 Hoàn tất! Đã thêm ${created} bài viết vào category Công nghệ`)
}

seedMore().catch(console.error)
