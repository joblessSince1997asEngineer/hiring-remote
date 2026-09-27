'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function AboutPage() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/cms/content')
      .then(r => r.json())
      .then(d => setContent(d.content || {}))
      .catch(() => setContent({}))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    )
  }

  const title = content['about.title'] || 'About Remote Hirring'
  const subtitle = content['about.subtitle'] || ''
  const section1Title = content['about.section1Title'] || ''
  const section1Body = content['about.section1Body'] || ''
  const section1Image = content['about.section1Image'] || '/chairperson.png'
  const section2Title = content['about.section2Title'] || ''
  const section2Body = content['about.section2Body'] || ''
  const section2Image = content['about.section2Image'] || '/chairperson.png'

  const renderParagraphs = (body: string) =>
    body.split('\n\n').map((para, i) => <p key={i}>{para}</p>)

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-6">{title}</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        {/* SECTION 1: Text Left, Image Right */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center mb-20 md:mb-32">

          <div className="w-full md:w-1/2 order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-6">
              {section1Title}
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base md:text-[17px] text-left">
              {renderParagraphs(section1Body)}
            </div>
          </div>

          <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center md:justify-end">
            <div className="w-full max-w-[480px] rounded-2xl overflow-hidden bg-slate-200 shadow-lg">
              <img
                src={section1Image}
                alt={section1Title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Image Left, Text Right */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">

          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <div className="w-full max-w-[480px] rounded-2xl overflow-hidden bg-slate-200 shadow-lg">
              <img
                src={section2Image}
                alt={section2Title}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-6">
              {section2Title}
            </h2>
            <div className="space-y-4 text-slate-600 leading-relaxed text-base md:text-[17px] text-left">
              {renderParagraphs(section2Body)}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}