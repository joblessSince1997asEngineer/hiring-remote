import { Check } from 'lucide-react'

export default function PricingPage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', padding: '60px 20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', marginBottom: '12px' }}>Our Pricing Models</h1>
          <p style={{ color: '#64748b', fontSize: '18px' }}>Clear, transparent fee structures designed to scale with your hiring needs.</p>
        </div>

        {/* Pricing Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', alignItems: 'stretch' }}>
          
          {/* Card 1: One-Time Placement Fee */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>1. One-Time Placement Fee</h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.5' }}>
              We charge a one-time percentage of the candidate's annual salary after a successful hire.
            </p>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Percentage Breakdown:</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                <Check size={16} color="#facc15" /> <strong>Junior Roles:</strong> 10–15%
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                <Check size={16} color="#facc15" /> <strong>Mid-Level Roles:</strong> 15–20%
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                <Check size={16} color="#facc15" /> <strong>Senior or Specialized Roles:</strong> 20–30%
              </li>
            </ul>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a', marginBottom: '8px' }}>Example:</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>• Candidate's Monthly Salary: <strong>$1,000</strong></li>
              <li>• Annual Salary: <strong>$12,000</strong></li>
              <li>• Our Fee (15%): <strong>$1,800</strong> (one-time payment)</li>
            </ul>
          </div>

          {/* Card 2: Flat Fee Per Hire (The Dark/Highlighted Card) */}
          <div style={{ background: '#0f172a', border: '1px solid #0f172a', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-12px', right: '24px', background: '#facc15', padding: '4px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: '700', color: 'black' }}>
              MOST POPULAR
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>2. Flat Fee Per Hire</h3>
            <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.5' }}>Ideal for startups and companies hiring remote employees.</p>
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'white', marginBottom: '16px' }}>Suggested Pricing:</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                <Check size={16} color="#facc15" /> <strong>Entry-Level Roles:</strong> $300–$500
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                <Check size={16} color="#facc15" /> <strong>Mid-Level Roles:</strong> $500–$1,000
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '14px' }}>
                <Check size={16} color="#facc15" /> <strong>Senior or Specialized Roles:</strong> $1,000–$3,000+
              </li>
            </ul>
            <button style={{ width: '100%', padding: '14px', borderRadius: '9999px', border: 'none', background: '#facc15', fontWeight: '700', cursor: 'pointer', color: '#0f172a' }}>
              Choose Flat Fee
            </button>
          </div>

          {/* Card 3: Monthly Recruitment Subscription */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>3. Monthly Recruitment Subscription</h3>
            <p style={{ color: '#64748b', fontSize: '14px', margin: '0 0 24px 0', lineHeight: '1.5' }}>For businesses hiring regularly, we offer monthly recruitment plans.</p>
            <div style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Example Packages:</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                <Check size={16} color="#facc15" /> <strong>Starter Plan:</strong> Up to 3 hires/month
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                <Check size={16} color="#facc15" /> <strong>Growth Plan:</strong> Up to 10 hires/month
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '14px' }}>
                <Check size={16} color="#facc15" /> <strong>Enterprise Plan:</strong> Unlimited hiring with dedicated recruitment support
              </li>
            </ul>
            <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', marginTop: 'auto' }}>
              *(Custom pricing based on hiring volume.)*
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}