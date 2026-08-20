import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// We connect using the exact adapter logic from your main app
const connectionString = process.env.DATABASE_URL
const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding 70 remote jobs to Supabase...')

  // PASTE YOUR 70 JOBS ARRAY HERE
  const initialJobs = [
    { id: 1, title: 'Senior Frontend Engineer', company: 'Acme Corp', region: 'Worldwide', tags: ['Full-time', '$120k - $150k'], featured: true, description: 'Lead the development of our core product using React, TypeScript, and Next.js.' },
  { id: 2, title: 'UX Designer', company: 'DesignHub', region: 'USA', tags: ['Contract', '$80k - $100k'], featured: false, description: 'Create beautiful user interfaces and improve user experience for our global platform.' },
  { id: 3, title: 'DevOps Engineer', company: 'CloudOps Ltd', region: 'EMEA', tags: ['Full-time', '$110k - $130k'], featured: false, description: 'Manage cloud infrastructure, CI/CD pipelines, and ensure 99.9% uptime.' },
  { id: 4, title: 'Backend Engineer', company: 'ServerStack', region: 'Worldwide', tags: ['Full-time', '$100k - $125k'], featured: false, description: 'Design and maintain high-performance RESTful APIs and microservices architecture.' },
  { id: 5, title: 'Product Manager', company: 'InnovateTech', region: 'USA', tags: ['Full-time', '$130k - $160k'], featured: true, description: 'Drive the product vision, roadmap, and collaborate with engineering and design teams.' },
  { id: 6, title: 'Mobile Developer (iOS)', company: 'AppCraft', region: 'UK', tags: ['Contract', '$90k - $110k'], featured: false, description: 'Build and maintain world-class iOS applications using Swift and SwiftUI.' },
  { id: 7, title: 'Data Scientist', company: 'DataMind AI', region: 'USA', tags: ['Full-time', '$140k - $170k'], featured: false, description: 'Analyze large datasets to drive business decisions and build predictive machine learning models.' },
  { id: 8, title: 'QA Lead', company: 'QualityFirst', region: 'Worldwide', tags: ['Full-time', '$95k - $115k'], featured: false, description: 'Lead the QA team, implement automated testing frameworks, and ensure product quality.' },
  { id: 9, title: 'Sales Executive (SaaS)', company: 'GrowthSales', region: 'EMEA', tags: ['Contract', '$70k + Commission'], featured: false, description: 'Identify new business opportunities and close deals with enterprise customers.' },
  { id: 10, title: 'Technical Writer', company: 'DocuSoft', region: 'APAC', tags: ['Part-time', '$50k - $70k'], featured: false, description: 'Write comprehensive technical documentation, API guides, and user manuals.' },
  { id: 11, title: 'Full Stack Developer', company: 'BuildIt', region: 'Worldwide', tags: ['Full-time', '$115k - $140k'], featured: true, description: 'Work across the entire stack using Node.js, React, and PostgreSQL to build scalable web apps.' },
  { id: 12, title: 'UI/UX Researcher', company: 'UserFirst', region: 'USA', tags: ['Full-time', '$90k - $110k'], featured: false, description: 'Conduct user interviews, usability tests, and present findings to improve product design.' },
  { id: 13, title: 'Senior Java Developer', company: 'EnterpriseSys', region: 'EMEA', tags: ['Full-time', '$120k - $145k'], featured: false, description: 'Build robust enterprise-level applications using Java, Spring Boot, and Hibernate.' },
  { id: 14, title: 'Marketing Manager', company: 'BrandBoost', region: 'Worldwide', tags: ['Full-time', '$85k - $100k'], featured: false, description: 'Lead marketing campaigns, content strategy, and brand awareness initiatives.' },
  { id: 15, title: 'Solutions Architect', company: 'CloudSol', region: 'USA', tags: ['Full-time', '$160k - $190k'], featured: true, description: 'Design complex cloud solutions and guide engineering teams in best architectural practices.' },
  { id: 16, title: 'Junior React Developer', company: 'StartupX', region: 'UK', tags: ['Contract', '$60k - $80k'], featured: false, description: 'Support the frontend team by building reusable components and fixing UI bugs.' },
  { id: 17, title: 'Cybersecurity Analyst', company: 'SecureNet', region: 'APAC', tags: ['Full-time', '$100k - $120k'], featured: false, description: 'Monitor networks for security breaches, implement security protocols, and respond to incidents.' },
  { id: 18, title: 'Project Manager', company: 'AgileWorks', region: 'Worldwide', tags: ['Full-time', '$95k - $115k'], featured: false, description: 'Manage project timelines, resources, and communication between stakeholders.' },
  { id: 19, title: 'PHP Developer', company: 'WebCraft', region: 'USA', tags: ['Contract', '$70k - $90k'], featured: false, description: 'Develop and maintain dynamic websites and applications using PHP and Laravel.' },
  { id: 20, title: 'Graphic Designer', company: 'CreativeHub', region: 'EMEA', tags: ['Part-time', '$45k - $60k'], featured: false, description: 'Design engaging visuals for digital marketing campaigns and social media.' },
  { id: 21, title: 'NLP Engineer', company: 'AI Labs', region: 'Worldwide', tags: ['Full-time', '$150k - $180k'], featured: true, description: 'Work on cutting-edge natural language processing models and AI-driven chatbots.' },
  { id: 22, title: 'Customer Support Lead', company: 'HelpDesk', region: 'USA', tags: ['Full-time', '$60k - $75k'], featured: false, description: 'Lead the global support team, resolve complex customer issues, and improve satisfaction.' },
  { id: 23, title: 'Ruby on Rails Developer', company: 'CodeCrafters', region: 'APAC', tags: ['Full-time', '$80k - $100k'], featured: false, description: 'Build robust backend systems and APIs using Ruby on Rails and PostgreSQL.' },
  { id: 24, title: 'Blockchain Developer', company: 'CryptoInnovate', region: 'Worldwide', tags: ['Contract', '$130k - $160k'], featured: false, description: 'Design and implement decentralized applications (dApps) and smart contracts.' },
  { id: 25, title: 'SEO Specialist', company: 'RankHigher', region: 'UK', tags: ['Part-time', '$50k - $65k'], featured: false, description: 'Optimize website content and improve search engine rankings for key keywords.' },
  { id: 26, title: 'Vue.js Developer', company: 'FrontendPro', region: 'EMEA', tags: ['Full-time', '$85k - $105k'], featured: false, description: 'Build responsive and performant web applications using Vue.js and Pinia.' },
  { id: 27, title: 'Data Analyst', company: 'InsightCo', region: 'USA', tags: ['Contract', '$75k - $95k'], featured: false, description: 'Create dashboards and analyze data to help clients make informed business decisions.' },
  { id: 28, title: 'Senior .NET Developer', company: 'MicrosoftStack', region: 'Worldwide', tags: ['Full-time', '$110k - $135k'], featured: true, description: 'Develop high-performance enterprise applications using C# and .NET Core.' },
  { id: 29, title: 'Content Strategist', company: 'EditorialNation', region: 'Worldwide', tags: ['Part-time', '$55k - $70k'], featured: false, description: 'Develop and execute content marketing strategies across blogs, emails, and social media.' },
  { id: 30, title: 'Accountant (Remote)', company: 'FinTech Global', region: 'USA', tags: ['Full-time', '$65k - $80k'], featured: false, description: 'Manage accounts payable/receivable, financial reporting, and tax compliance.' },
  { id: 31, title: 'React Native Developer', company: 'MobileFirst', region: 'APAC', tags: ['Full-time', '$90k - $110k'], featured: false, description: 'Build high-quality mobile applications for both iOS and Android using React Native.' },
  { id: 32, title: 'Lead Data Engineer', company: 'BigDataCorp', region: 'EMEA', tags: ['Full-time', '$140k - $170k'], featured: true, description: 'Design and build scalable data pipelines and ETL processes using Spark and Airflow.' },
  { id: 33, title: 'User Support Specialist', company: 'ClientCare', region: 'Worldwide', tags: ['Contract', '$40k - $55k'], featured: false, description: 'Provide technical support to customers via email and live chat.' },
  { id: 34, title: 'UX Strategist', company: 'UXLab', region: 'UK', tags: ['Full-time', '$100k - $120k'], featured: false, description: 'Advise clients on UX best practices and lead high-level product strategy workshops.' },
  { id: 35, title: 'WordPress Developer', company: 'WP Masters', region: 'Worldwide', tags: ['Contract', '$60k - $80k'], featured: false, description: 'Develop custom WordPress themes and plugins for various clients.' },
  { id: 36, title: 'Quantitative Analyst', company: 'FinanceAI', region: 'USA', tags: ['Full-time', '$130k - $160k'], featured: false, description: 'Build mathematical models to evaluate financial risks and optimize investment strategies.' },
  { id: 37, title: 'Cloud Engineer (AWS)', company: 'Cloudify', region: 'EMEA', tags: ['Full-time', '$115k - $140k'], featured: true, description: 'Implement and optimize AWS cloud infrastructure with a focus on security and cost.' },
  { id: 38, title: 'Technical Recruiter', company: 'HiringPro', region: 'Worldwide', tags: ['Full-time', '$70k - $90k'], featured: false, description: 'Source, screen, and interview technical candidates for various engineering roles.' },
  { id: 39, title: 'Kotlin Developer', company: 'AndroidGen', region: 'APAC', tags: ['Contract', '$85k - $105k'], featured: false, description: 'Develop native Android applications using modern Kotlin and Jetpack Compose.' },
  { id: 40, title: 'Business Development Manager', company: 'ExpandCo', region: 'USA', tags: ['Full-time', '$95k + Commission'], featured: true, description: 'Identify new market opportunities and build strategic partnerships.' },
  { id: 41, title: 'Video Editor', company: 'MediaHub', region: 'Worldwide', tags: ['Part-time', '$40k - $55k'], featured: false, description: 'Edit high-quality video content for YouTube, social media, and client projects.' },
  { id: 42, title: 'Senior Golang Engineer', company: 'GoMicro', region: 'EMEA', tags: ['Full-time', '$125k - $150k'], featured: false, description: 'Build highly concurrent microservices and backend systems using Go.' },
  { id: 43, title: 'Email Marketing Specialist', company: 'MailFlow', region: 'USA', tags: ['Full-time', '$65k - $80k'], featured: false, description: 'Create and manage email marketing campaigns to drive engagement and sales.' },
  { id: 44, title: 'AI/ML Research Scientist', company: 'FutureTech', region: 'Worldwide', tags: ['Full-time', '$180k - $210k'], featured: true, description: 'Push the boundaries of machine learning and publish research on generative AI.' },
  { id: 45, title: 'GraphQL Developer', company: 'APIMasters', region: 'UK', tags: ['Contract', '$100k - $120k'], featured: false, description: 'Design and implement efficient GraphQL APIs for modern web applications.' },
  { id: 46, title: 'System Administrator', company: 'ITOps', region: 'Worldwide', tags: ['Full-time', '$75k - $95k'], featured: false, description: 'Manage server infrastructure, user permissions, and ensure system uptime.' },
  { id: 47, title: 'Sustainability Consultant', company: 'GreenFuture', region: 'APAC', tags: ['Contract', '$80k - $100k'], featured: false, description: 'Advise companies on sustainable practices and ESG reporting standards.' },
  { id: 48, title: 'Senior JS Engineer', company: 'JSMastery', region: 'EMEA', tags: ['Full-time', '$110k - $135k'], featured: false, description: 'Write advanced JavaScript algorithms and mentor junior engineers.' },
  { id: 49, title: 'Brand Manager', company: 'BrandGlobal', region: 'USA', tags: ['Full-time', '$90k - $110k'], featured: false, description: 'Manage the global brand identity, logo guidelines, and marketing assets.' },
  { id: 50, title: 'Serverless Architect', company: 'CloudNative', region: 'Worldwide', tags: ['Full-time', '$150k - $180k'], featured: true, description: 'Design and implement applications using Serverless architecture, AWS Lambda, and API Gateway.' },
  { id: 51, title: 'HR Generalist', company: 'PeopleOps', region: 'EMEA', tags: ['Full-time', '$60k - $75k'], featured: false, description: 'Manage employee relations, onboarding, and benefits administration.' },
  { id: 52, title: 'Swift Developer', company: 'AppleEcosystem', region: 'USA', tags: ['Contract', '$110k - $130k'], featured: false, description: 'Build sophisticated iOS applications using the latest Swift frameworks.' },
  { id: 53, title: 'E-commerce Manager', company: 'ShopWorld', region: 'APAC', tags: ['Full-time', '$85k - $105k'], featured: false, description: 'Manage online store operations, merchandising, and conversion rate optimization.' },
  { id: 54, title: 'Machine Learning Engineer', company: 'DataBot', region: 'Worldwide', tags: ['Full-time', '$145k - $175k'], featured: true, description: 'Deploy machine learning models into production and monitor their performance.' },
  { id: 55, title: 'Talent Acquisition Specialist', company: 'RecruitPro', region: 'USA', tags: ['Contract', '$65k - $80k'], featured: false, description: 'Coordinate the full recruitment lifecycle for tech and non-tech roles.' },
  { id: 56, title: 'Cybersecurity Engineer', company: 'DefendNet', region: 'EMEA', tags: ['Full-time', '$120k - $145k'], featured: false, description: 'Implement firewalls, IDS/IPS, and conduct vulnerability assessments.' },
  { id: 57, title: 'Django Developer', company: 'PythonWeb', region: 'UK', tags: ['Full-time', '$80k - $100k'], featured: false, description: 'Build secure and scalable web applications using Django and Python.' },
  { id: 58, title: 'Content Creator', company: 'ViralMedia', region: 'Worldwide', tags: ['Part-time', '$50k - $65k'], featured: false, description: 'Create engaging visual and written content for various social platforms.' },
  { id: 59, title: 'Lead QA Engineer', company: 'TestAutomation', region: 'USA', tags: ['Full-time', '$100k - $120k'], featured: true, description: 'Lead the automation testing suite using Selenium, Cypress, and Jenkins.' },
  { id: 60, title: 'Product Analyst', company: 'AnalyticsHub', region: 'EMEA', tags: ['Contract', '$70k - $90k'], featured: false, description: 'Analyze product usage data and provide insights to drive feature growth.' },
  { id: 61, title: 'Senior UI Designer', company: 'PixelPerfect', region: 'APAC', tags: ['Full-time', '$95k - $115k'], featured: false, description: 'Design visually stunning user interfaces for mobile and web platforms.' },
  { id: 62, title: 'Rust Developer', company: 'SystemSafe', region: 'Worldwide', tags: ['Full-time', '$130k - $160k'], featured: false, description: 'Build reliable and memory-safe high-performance systems using Rust.' },
  { id: 63, title: 'Social Media Manager', company: 'SocialWise', region: 'USA', tags: ['Full-time', '$60k - $75k'], featured: false, description: 'Manage social media calendars, engage with followers, and analyze engagement metrics.' },
  { id: 64, title: 'Scrum Master', company: 'AgileFlow', region: 'EMEA', tags: ['Contract', '$80k - $100k'], featured: false, description: 'Facilitate agile ceremonies, remove impediments, and mentor development teams.' },
  { id: 65, title: 'Deep Learning Engineer', company: 'AI Vision', region: 'Worldwide', tags: ['Full-time', '$160k - $190k'], featured: true, description: 'Design and train deep neural networks for computer vision tasks.' },
  { id: 66, title: 'RevOps Specialist', company: 'RevenueGen', region: 'USA', tags: ['Full-time', '$90k - $110k'], featured: false, description: 'Optimize revenue operations, sales processes, and CRM data management.' },
  { id: 67, title: 'Flutter Developer', company: 'CrossPlatform', region: 'UK', tags: ['Contract', '$80k - $100k'], featured: false, description: 'Create beautiful cross-platform mobile apps using the Flutter framework.' },
  { id: 68, title: 'Game Developer (Unity)', company: 'GameStudio', region: 'Worldwide', tags: ['Full-time', '$85k - $105k'], featured: false, description: 'Design and develop 2D/3D games using Unity and C#.' },
  { id: 69, title: 'Chief Technology Officer (CTO)', company: 'ScaleUpTech', region: 'EMEA', tags: ['Full-time', '$200k - $250k'], featured: true, description: 'Lead the engineering strategy, architecture, and technical roadmap for the company.' },
  { id: 70, title: 'Junior Graphic Designer', company: 'DesignStudio', region: 'APAC', tags: ['Part-time', '$35k - $50k'], featured: false, description: 'Assist the senior design team in creating marketing materials and brand assets.' }
]
    // ... 70 jobs go here ...
  

  for (const mockJob of initialJobs) {
    // Transform salary string to integers
    let salaryMin = null
    let salaryMax = null
    if (mockJob.tags && mockJob.tags.length > 1) {
      const matches = mockJob.tags[1].match(/\$(\d+)k\s*-\s*\$(\d+)k/)
      if (matches) {
        salaryMin = parseInt(matches[1])
        salaryMax = parseInt(matches[2])
      }
    }

    await prisma.job.create({
      data: {
        title: mockJob.title,
        company: mockJob.company,
        location: mockJob.region,
        type: mockJob.tags[0] || 'Full-time',
        category: 'Engineering',
        salaryMin: salaryMin,
        salaryMax: salaryMax,
        description: mockJob.description,
        recruiterId: 'seed-user-id',
      },
    })
  }

  console.log('✅ Successfully seeded the jobs!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })