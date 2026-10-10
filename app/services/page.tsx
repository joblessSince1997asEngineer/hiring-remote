export const dynamic = 'force-dynamic'
import { Search, ShieldCheck, Calendar } from 'lucide-react'
import ServicesView from '@/components/ServicesView'
import { getContent } from '@/lib/get-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services — Sourcing, Screening, Coordination',
  description:
    'End-to-end remote recruitment: talent sourcing, multi-stage vetting, interview coordination. Only the top 1% make it through.',
}

export default async function ServicesPage() {
  const content = await getContent()
  const t = (k: string) => content[k] ?? ''

  const services = [
    {
      icon: <Search size={32} color="#0f172a" />,
      title: t('services.card1.title'),
      desc: t('services.card1.desc'),
      fullDesc: t('services.card1.fullDesc'),
    },
    {
      icon: <ShieldCheck size={32} color="#0f172a" />,
      title: t('services.card2.title'),
      desc: t('services.card2.desc'),
      fullDesc: t('services.card2.fullDesc'),
    },
    {
      icon: <Calendar size={32} color="#0f172a" />,
      title: t('services.card3.title'),
      desc: t('services.card3.desc'),
      fullDesc: t('services.card3.fullDesc'),
    },
  ]

  return (
    <ServicesView
      headerTitle={t('services.header.title')}
      headerSubtitle={t('services.header.subtitle')}
      services={services}
    />
  )
}