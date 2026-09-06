export default function TeamPage() {
  const team = [
    { name: 'Adnan Riaz', role: 'Founder', desc: 'My name is Adnan Riaz. I completed my graduation from the University of Karachi through Government Commerce and Arts College. After that, I pursued an M.A. in Economics, but unfortunately, due to the COVID-19 pandemic, I had to discontinue my studies for some time. Later, I continued my learning through self-study and explored different subjects, including jurisprudence, pharmacopoeia, and other areas of interest. In terms of professional experience, I have worked across various departments, including Finance, Operations, and Human Resources. This has given me a broad understanding of how different departments function and work together. However, my strongest preference is Accounting. I genuinely enjoy accounting and feel that it is the field where I can perform at my best. I have a strong interest in accounting, and I would be very happy to build my career and contribute professionally in an accounting role.', img: '/riaz.png' }, // <-- CHANGE THIS to your actual Sarah file name
    { name: 'Mubashir Ali', role: 'Chief Of Executive', desc: 'As CEO of RemoteHirring, I lead our mission to revolutionize how global talent connects with top-tier opportunities. My journey is rooted in technical execution—transitioning from a background in technology education, complex data analytics (using Python and Power BI), and software architecture into strategic leadership. Today, I combine that technical foundation with overarching business strategy, spearheading RemoteHirring’s go-to-market execution, client acquisition, and scalable platform operations. Looking ahead, my focus is on capturing new opportunities in the remote work sector by scaling our global footprint, integrating advanced data-driven matching systems, and establishing RemoteHirring as the definitive ecosystem for the future of decentralized work', img: '/mubashir.png' },    // <-- CHANGE THIS to your actual Adnan file name
    { name: 'Syed Sabtain Ali Rizvi', role: 'Head Of Recrutiment', desc: 'I’m a Recruitment Professional and part of the Remote Hiring Team, specializing in connecting talented professionals with the right career opportunities across global and remote markets. With a strong understanding of technology and business, I focus on identifying the right talent, understanding client requirements, and building successful long-term professional connections.', img: '/syed.png' }, // <-- CHANGE THIS to your actual Elena file name
    { name: 'Muhammad Faraz', role: 'SEO Specialist', desc: 'Expert In Marketing', img: '/faraz.png' }, // <-- CHANGE THIS to your actual Michael file name
    { name: 'Ambreen Ashraf', role: 'Legal & Compliance Expert', desc: 'Knows Jusrisprudence Of Corporate Law', img: '/ambreen.png' },
    { name: 'Ulishba Arif Malik', role: 'Recruitment Specialist', desc: 'Knows Methodology To Recruit', img: '/ulishba.png' }
  ]

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '60px 20px' }}>
      {/* Centered Container */}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>Meet Our Team</h1>
          <p style={{ fontSize: '18px', color: '#64748b' }}>The global talent experts dedicated to finding your next great hire.</p>
        </div>

        {/* Team Grid - perfectly centered */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
          {team.map((member, index) => (
            <div key={index} style={{ backgroundColor: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
              {/* Taller, perfectly sized photo */}
              <img 
                src={member.img} 
                alt={member.name} 
                style={{ width: '100%', height: '340px', objectFit: 'cover' }} 
              />
              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{member.name}</h3>
                <p style={{ color: '#2563eb', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>{member.role}</p>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.5' }}>{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}