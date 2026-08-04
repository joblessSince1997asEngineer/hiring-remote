'use client'

import dynamic from 'next/dynamic'

// This explicitly tells Next.js: "Ignore this during the build entirely"
const SearchForm = dynamic(() => import('@/components/SearchFormV2'), {
  ssr: false,
})

export default function ClientSearchForm() {
  return <SearchForm />
}