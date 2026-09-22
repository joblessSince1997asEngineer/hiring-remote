export default function TeamPage() {
    const team = [
    { name: 'Adnan Riaz', role: 'Founder', desc: `My name is Adnan Riaz. I completed my graduation from the University of Karachi through Government Commerce and Arts College. After that, I pursued an M.A. in Economics, but due to the COVID-19 pandemic, I had to discontinue my studies for some time.\n\nLater, I continued my learning through self-study and explored different subjects, including jurisprudence, pharmacopoeia, and other areas of interest. In terms of professional experience, I have worked across various departments, including Finance, Operations, and Human Resources.\n\nThis has given me a broad understanding of how different departments function and work together. However, my strongest preference is Accounting. I genuinely enjoy accounting and feel that it is the field where I can perform at my best.\n\nI have a strong interest in accounting, and I would be very happy to build my career and contribute professionally in an accounting role.`, img: '/riaz.png' },
    { name: 'Mubashir Ali', role: 'Chief Of Executive', desc: `As CEO of RemoteHirring, I lead our mission to revolutionize how global talent connects with top-tier opportunities.\n\nMy journey is rooted in technical execution—transitioning from a background in technology education, complex data analytics (using Python and Power BI), and software architecture into strategic leadership. Today, I combine that technical foundation with overarching business strategy.\n\nSpearheading RemoteHirring's go-to-market execution, client acquisition, and scalable platform operations. Looking ahead, my focus is on capturing new opportunities in the remote work sector by scaling our global footprint.\n\nIntegrating advanced data-driven matching systems, and establishing RemoteHirring as the definitive ecosystem for the future of decentralized work.`, img: '/mubashir.png' },
    { name: 'Syed Sabtain Ali Rizvi', role: 'Head Of Recruitment', desc: `I'm a Recruitment Professional and part of the Remote Hiring Team, specializing in connecting talented professionals with the right career opportunities across global and remote markets.\n\nWith a strong understanding of technology and business, I focus on identifying the right talent, understanding client requirements, and building successful long-term professional connections.`, img: '/syed.png' },
    { name: 'Muhammad Faraz', role: 'SEO Specialist', desc: `Expert in Marketing with a proven track record of driving organic growth, optimizing digital presence, and implementing data-driven strategies.\n\nEnhancing brand visibility and engagement across global markets.`, img: '/faraz.png' },
    { name: 'Ambreen Ashraf', role: 'Legal & Compliance Expert', desc: `Knows Jurisprudence of Corporate Law, ensuring that RemoteHirring operates under the highest standards of legal integrity.\n\nRegulatory compliance, and ethical business practices across all international markets.`, img: '/ambreen.png' },
    { name: 'Ulishba Arif Malik', role: 'Recruitment Specialist', desc: `Knows the methodology to recruit, effectively identifying, sourcing, and placing top-tier talent.\n\nEnsuring a seamless and engaging experience for both candidates and clients.`, img: '/ulishba.png' }
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-4">Meet Our Team</h1>
          <p className="text-slate-600 text-base md:text-lg">The global talent experts dedicated to finding your next great hire.</p>
        </div>

        {/* Responsive Grid: 1 Column Mobile, 2 Tablet, 3 Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {team.map((member, index) => (
            <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
              {/* FIXED: uniform 4:5 aspect ratio, image centered */}
              <div className="w-full aspect-[4/5] overflow-hidden bg-slate-100">
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top" 
                />
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-[#0f172a] mb-1">{member.name}</h3>
                <p className="text-blue-600 text-sm font-medium mb-3">{member.role}</p>
                
                {/* Keeps the \n\n as separate paragraphs */}
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line text-left">
  {member.desc}
</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}