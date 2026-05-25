import sanitizeHtml from 'sanitize-html'

const allowedTags = [
  'p', 'h2', 'h3', 'h4', 'strong', 'em', 'a', 'img',
  'ul', 'ol', 'li', 'blockquote', 'figure', 'figcaption',
  'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
]

const allowedAttributes: sanitizeHtml.IOptions['allowedAttributes'] = {
  a: ['href', 'title'],
  img: ['src', 'alt', 'title', 'class'],
  '*': ['class'],
}

export function sanitizeContent(html: string): string {
  return sanitizeHtml(html, {
    allowedTags,
    allowedAttributes,
    allowedSchemes: ['http', 'https'],
    disallowedTagsMode: 'discard',
  })
}
