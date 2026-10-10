const COLORS = [
  { bg: '#dbeafe', fg: '#1e40af' },
  { bg: '#d1fae5', fg: '#065f46' },
  { bg: '#fef3c7', fg: '#92400e' },
  { bg: '#fce7f3', fg: '#9d174d' },
  { bg: '#e0e7ff', fg: '#3730a3' },
  { bg: '#fed7aa', fg: '#9a3412' },
  { bg: '#ccfbf1', fg: '#115e59' },
  { bg: '#e9d5ff', fg: '#6b21a8' },
]

export function getCompanyInitials(company: string): string {
  if (!company) return '?'
  const words = company
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 0 && !/^(the|of|and|&)$/i.test(w))

  if (words.length === 0) return company[0]?.toUpperCase() || '?'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

export function getCompanyColor(company: string): { bg: string; fg: string } {
  if (!company) return COLORS[0]
  let hash = 0
  for (let i = 0; i < company.length; i++) {
    hash = (hash << 5) - hash + company.charCodeAt(i)
    hash |= 0
  }
  return COLORS[Math.abs(hash) % COLORS.length]
}