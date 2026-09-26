export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 md:py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0f172a] mb-6">About Remote Hirring</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            We believe that talent is equally distributed globally, but opportunity is not. We're on a mission to bridge that gap.
          </p>
        </div>

        {/* SECTION 1: Text Left, Image Right */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center mb-20 md:mb-32">

          {/* Text */}
          <div className="w-full md:w-1/2 order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-6">
              The Story Behind Remote Hirring
            </h2>

            <div className="space-y-4 text-slate-600 leading-relaxed text-base md:text-[17px] text-left">
              <p>
                Every journey has a beginning, and the journey of Remote Hirring started with an experience that gave us the confidence to build something of our own.
              </p>
              <p>
                Before Remote Hirring, we were working with a company called OpenVoiceHub, where we had the opportunity to be involved in international hiring. We worked on hiring people for internships as well as different positions, and honestly, that experience was incredibly valuable.
              </p>
              <p>
                We enjoyed the process of connecting with people, understanding their skills, identifying the right talent, and helping organizations find suitable candidates. Our experience was so good that it made us think: Why not build something of our own in this field?
              </p>
              <p>
                At one point, I started reaching out to some of my colleagues and professional contacts and shared my idea with them. I told them that I wanted to start my own private business and asked them what they thought would be a good direction to take.
              </p>
              <p>
                Everyone gave me different suggestions and ideas. But among all the options, one idea really stood out to me—HR and recruitment.
              </p>
            </div>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2 order-1 md:order-2 flex justify-center md:justify-end">
            <div className="w-full max-w-[480px] rounded-2xl overflow-hidden bg-slate-200 shadow-lg">
              <img
                src="/chairperson.png"
                alt="Remote Hirring founder"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Image Left, Text Right */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-center">

          {/* Image */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-start">
            <div className="w-full max-w-[480px] rounded-2xl overflow-hidden bg-slate-200 shadow-lg">
              <img
                src="/chairperson.png"
                alt="Remote Hirring team"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-6">
              Where We Are Today
            </h2>

            <div className="space-y-4 text-slate-600 leading-relaxed text-base md:text-[17px] text-left">
              <p>
                I realized that we already had experience in hiring, we understood the process, and most importantly, we genuinely enjoyed doing it.
              </p>
              <p>
                That's when the idea of Remote Hirring started taking shape.
              </p>
              <p>
                We decided to create an HR and recruitment company that would connect companies from around the world with talented people looking for remote opportunities.
              </p>
              <p>
                And that's how it all started—not with a huge investment or a big office, but with experience, an idea, and the determination to build something meaningful.
              </p>
              <p>
                Today, that idea has become Remote Hirring.
              </p>
              <p>
                Our vision is simple: to make global hiring easier by connecting the right companies with the right talent, regardless of where they are in the world.
              </p>
              <p>
                And this is just the beginning of our journey.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}