'use client'

import dynamic from 'next/dynamic'

const SearchForm = dynamic(
  () => import('@/components/SearchFormV2').then((mod) => {
    // This automatically handles BOTH 'export default' and 'export function'
    return mod.default || mod.SearchForm
  }),
  { ssr: false }
)

export default function ClientSearchForm() {
  return <SearchForm />
}