export const CONTENT_DEFAULTS: Record<string, string> = {
  // About page — Section 1 (Text Left, Image Right)
  'about.title': 'About Remote Hirring',
  'about.subtitle': "We believe that talent is equally distributed globally, but opportunity is not. We're on a mission to bridge that gap.",
  'about.section1Title': 'The Story Behind Remote Hirring',
  'about.section1Body': `Every journey has a beginning, and the journey of Remote Hirring started with an experience that gave us the confidence to build something of our own.

Before Remote Hirring, we were working with a company called OpenVoiceHub, where we had the opportunity to be involved in international hiring. We worked on hiring people for internships as well as different positions, and honestly, that experience was incredibly valuable.

We enjoyed the process of connecting with people, understanding their skills, identifying the right talent, and helping organizations find suitable candidates. Our experience was so good that it made us think: Why not build something of our own in this field?

At one point, I started reaching out to some of my colleagues and professional contacts and shared my idea with them. I told them that I wanted to start my own private business and asked them what they thought would be a good direction to take.

Everyone gave me different suggestions and ideas. But among all the options, one idea really stood out to me—HR and recruitment.`,
  'about.section1Image': '/chairperson.png',

  // About page — Section 2 (Image Left, Text Right)
  'about.section2Title': 'Where We Are Today',
  'about.section2Body': `I realized that we already had experience in hiring, we understood the process, and most importantly, we genuinely enjoyed doing it.

That's when the idea of Remote Hirring started taking shape.

We decided to create an HR and recruitment company that would connect companies from around the world with talented people looking for remote opportunities.

And that's how it all started—not with a huge investment or a big office, but with experience, an idea, and the determination to build something meaningful.

Today, that idea has become Remote Hirring.

Our vision is simple: to make global hiring easier by connecting the right companies with the right talent, regardless of where they are in the world.

And this is just the beginning of our journey.`,
  'about.section2Image': '/chairperson.png',

  // Home page
  'home.hero.badge': 'GLOBAL REACH • ELITE TALENT',
  'home.hero.title': 'Hire Top Remote',
  'home.hero.titleAccent': 'Talent Worldwide.',
  'home.hero.subtitle': "Empowering startups and enterprises to build high-performing distributed teams. We source, screen, and vet the world's top 1% of remote professionals for you.",

  // Contact page
  'contact.email': 'hr@remotehirring.com',
  'contact.hq': 'We are a fully remote company.',
}

export const CONTENT_LABELS: Record<string, { label: string; type: 'text' | 'textarea' }> = {
  'about.title': { label: 'Page Title', type: 'text' },
  'about.subtitle': { label: 'Page Subtitle', type: 'textarea' },

  'about.section1Title': { label: 'Section 1 — Title', type: 'text' },
  'about.section1Body': { label: 'Section 1 — Body Text', type: 'textarea' },
  'about.section1Image': { label: 'Section 1 — Image URL', type: 'text' },

  'about.section2Title': { label: 'Section 2 — Title', type: 'text' },
  'about.section2Body': { label: 'Section 2 — Body Text', type: 'textarea' },
  'about.section2Image': { label: 'Section 2 — Image URL', type: 'text' },

  'home.hero.badge': { label: 'Hero Badge', type: 'text' },
  'home.hero.title': { label: 'Hero Title (White)', type: 'text' },
  'home.hero.titleAccent': { label: 'Hero Title (Amber)', type: 'text' },
  'home.hero.subtitle': { label: 'Hero Subtitle', type: 'textarea' },

  'contact.email': { label: 'Support Email', type: 'text' },
  'contact.hq': { label: 'HQ Description', type: 'text' },
}

export const CONTENT_SECTIONS: Record<string, string[]> = {
  'About Page — Header': [
    'about.title',
    'about.subtitle',
  ],
  'About Page — Section 1 (Text Left / Image Right)': [
    'about.section1Title',
    'about.section1Body',
    'about.section1Image',
  ],
  'About Page — Section 2 (Image Left / Text Right)': [
    'about.section2Title',
    'about.section2Body',
    'about.section2Image',
  ],
  'Homepage Hero': [
    'home.hero.badge',
    'home.hero.title',
    'home.hero.titleAccent',
    'home.hero.subtitle',
  ],
  'Contact Info': [
    'contact.email',
    'contact.hq',
  ],
}