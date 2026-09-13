// gitprofile.config.ts

const CONFIG = {
  github: {
    username: 'Rodrigo-AlvesFontanella',
  },
  /**
   * Deploying to https://Rodrigo-AlvesFontanella.github.io/ (repo named
   * "Rodrigo-AlvesFontanella.github.io") -> base '/'.
   */
  base: '/',
  projects: {
    github: {
      display: true,
      header: 'GitHub Projects',
      mode: 'manual',
      automatic: {
        sortBy: 'stars',
        limit: 8,
        exclude: {
          forks: true,
          projects: [],
        },
      },
      manual: {
        projects: [
          'Rodrigo-AlvesFontanella/finance-tracker-powerbi',
          'Rodrigo-AlvesFontanella/ecommerce-marketing-powerbi',
          'Rodrigo-AlvesFontanella/hr-analytics-rls-powerbi',
          'Rodrigo-AlvesFontanella/agro-insight-powerbi',
          'Rodrigo-AlvesFontanella/saas-billing-warehouse-sql',
        ],
      },
    },
    external: {
      header: 'Case Studies',
      projects: [
        {
          title: 'Finance Tracker',
          description:
            'Personal finance dashboard with time-intelligence DAX (YTD, period-over-period) and a drill path from summary KPIs down to transaction-level detail, on a proper star-schema model.',
          imageUrl: 'images/finance.jpg',
          link: 'https://claude.ai/code/artifact/d8c46e72-b3f1-4045-975e-3662bba4a87d#finance',
        },
        {
          title: 'E-commerce Marketing — Channel & Customer Insights',
          description:
            '4-page report analyzing channel attribution, campaign ROI and customer segmentation for an e-commerce business — built to answer which channel is worth the next dollar of spend.',
          imageUrl: 'images/ecommerce.jpg',
          link: 'https://claude.ai/code/artifact/d8c46e72-b3f1-4045-975e-3662bba4a87d#ecommerce',
        },
        {
          title: 'HR Analytics — Row-Level Security',
          description:
            'People analytics dashboard built around a real Row-Level Security implementation: 4 department-scoped roles enforced in the semantic model, plus an animated headcount vs. hiring-trend scatter.',
          imageUrl: 'images/hr.jpg',
          link: 'https://claude.ai/code/artifact/d8c46e72-b3f1-4045-975e-3662bba4a87d#hr',
        },
        {
          title: 'Agro Insight — Map & Forecast',
          description:
            'Agribusiness dashboard mapping 162 fields across 76 farmers with ArcGIS Maps for Power BI, plus a native statistical Forecast projecting fertilizer demand from trend and seasonality.',
          imageUrl: 'images/agro.jpg',
          link: 'https://claude.ai/code/artifact/d8c46e72-b3f1-4045-975e-3662bba4a87d#agro',
        },
        {
          title: 'Clinic Scheduling Automation',
          description:
            "Python robot that logs into a clinic's scheduling and records portals, pulls new appointments and patient data, and emails a structured report out automatically — running in production for a real client.",
          imageUrl: 'images/automation.jpg',
          link: 'https://claude.ai/code/artifact/d8c46e72-b3f1-4045-975e-3662bba4a87d#automation',
        },
      ],
    },
  },
  seo: {
    title: 'Rodrigo Fontanella — BI Analyst',
    description:
      'Freelance BI analyst — Power BI, SQL Server and Python automation.',
    imageURL: '',
  },
  social: {
    linkedin: '',
    x: '',
    mastodon: '',
    researchGate: '',
    facebook: '',
    instagram: '',
    reddit: '',
    threads: '',
    youtube: '',
    udemy: '',
    dribbble: '',
    behance: '',
    medium: '',
    dev: '',
    stackoverflow: '',
    discord: '',
    telegram: '',
    website: '',
    phone: '',
    email: 'fontanellarodrigo916@gmail.com',
  },
  resume: {
    // Empty hides the "Download Resume" button. Add a link once you have a
    // hosted PDF (e.g. in this same repo, under public/resume.pdf).
    fileUrl: '',
  },
  skills: [
    'Power BI',
    'DAX',
    'Data Modeling',
    'Row-Level Security',
    'SQL Server',
    'Oracle',
    'Power Query',
    'ETL',
    'REST API Integration',
    'Python',
    'Automation',
  ],
  experiences: [
    {
      company: 'TIMAC AGRO (Grupo Roullier)',
      position: 'Jr BI Analyst',
      from: 'April 2024',
      to: 'Present',
      companyLink: 'https://www.timacagro.com.br/',
    },
    {
      company: 'Thema Informática',
      position: 'Jr BI Analyst',
      from: 'May 2022',
      to: 'March 2024',
      companyLink: '',
    },
  ],
  certifications: [],
  educations: [
    {
      institution: 'Uniasselvi',
      degree: 'Systems Science',
      from: '',
      to: '',
    },
  ],
  publications: [],
  // Keep empty: no Medium/dev.to blog yet.
  blog: {
    source: 'dev',
    username: '',
    limit: 2,
  },
  googleAnalytics: {
    id: '',
  },
  hotjar: { id: '', snippetVersion: 6 },
  themeConfig: {
    defaultTheme: 'forest',
    disableSwitch: false,
    respectPrefersColorScheme: false,
    displayAvatarRing: true,
    themes: [
      'light',
      'dark',
      'forest',
      'business',
      'night',
      'dracula',
      'nord',
      'winter',
      'sunset',
      'procyon',
    ],
  },

  footer: `Built with <a
      class="text-primary" href="https://github.com/arifszn/gitprofile"
      target="_blank"
      rel="noreferrer"
    >GitProfile</a>`,

  enablePWA: true,
};

export default CONFIG;
