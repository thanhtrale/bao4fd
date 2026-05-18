const categoryColorMap: Record<string, { bg: string; text: string; bgLight: string }> = {
  'cong-nghe': { bg: 'bg-cat-tech', text: 'text-cat-tech', bgLight: 'bg-cat-tech-light' },
  'kinh-doanh': { bg: 'bg-cat-business', text: 'text-cat-business', bgLight: 'bg-cat-business-light' },
  'the-thao': { bg: 'bg-cat-sports', text: 'text-cat-sports', bgLight: 'bg-cat-sports-light' },
  'giai-tri': { bg: 'bg-cat-entertainment', text: 'text-cat-entertainment', bgLight: 'bg-cat-entertainment-light' },
  'suc-khoe': { bg: 'bg-cat-health', text: 'text-cat-health', bgLight: 'bg-cat-health-light' },
}

const defaultColors = { bg: 'bg-slate-600', text: 'text-slate-600', bgLight: 'bg-slate-100' }

export function getCategoryColors(slug: string) {
  return categoryColorMap[slug] || defaultColors
}
