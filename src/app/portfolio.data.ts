// All page content lives here. Edit the text and the site updates.

export const PROFILE = {
  name: 'Feba Christina Joel',
  role: 'Software Engineer · Frontend, Angular',
  bio: 'I build intuitive digital experiences through frontend engineering, with nearly 4 years of professional experience and Angular at the core of my work. I enjoy solving complex problems, exploring emerging technologies and pushing myself to build better software.',
  email: 'febachristinaj31@gmail.com',
  linkedin: 'https://www.linkedin.com/in/febachristinajoel',
  github: 'https://github.com/FEBACHRISTINAJOEL',
  resume: 'Feba_Christina_Joel_Software_Engineer.pdf',
  location: 'United Arab Emirates',
};

export const NAV = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Work' },
  { id: 'education', label: 'Education' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

export const ABOUT = [
  'I’m a Software Engineer passionate about building high-quality digital products that combine great user experiences with meaningful business outcomes. Over nearly 4 years at Way.com, I’ve contributed to production applications across parking and other automotive services, serving millions of people across the USA and Canada. From developing responsive, user-friendly interfaces to optimising existing features, my work has contributed to measurable business results, including increased revenue, higher transaction volumes and improved product engagement.',
  'With a specialisation in frontend engineering and Angular, TypeScript and JavaScript at the core of my expertise, I focus on building performant, scalable and maintainable applications that work seamlessly across devices. I also embrace modern engineering practices and AI-assisted development, leveraging tools such as Cursor, GitHub Copilot and Claude to accelerate development, explore solutions and improve workflows. Currently based in the UAE, I’m actively exploring new opportunities where I can contribute my experience, take on meaningful engineering challenges and grow alongside ambitious teams.',
];

export interface Project {
  name: string; type: string; summary: string;
  stats: { value: string; label: string }[];
  link?: { href: string; text: string };
}

export const PROJECTS: Project[] = [
  {
    name: 'Repair & Maintenance search pages', type: 'Search pages',
    summary: 'Built the search pages for Way.com’s Repair & Maintenance vertical.',
    stats: [{ value: '200,000+', label: 'organic visits in 2 months' }, { value: '70+', label: 'transactions' }],
    link: { href: 'https://way.com/auto-repair/california/los-angeles', text: 'See a live page' },
  },
  {
    name: 'City Parking page revamp', type: 'Redesign',
    summary: 'Revamped the City Parking pages with UI improvements and new elements.',
    stats: [{ value: '95%', label: 'organic traffic growth' }, { value: '56%', label: 'more transactions' }, { value: '25–50%', label: 'revenue increase' }],
    link: { href: 'https://www.way.com/parkingdetails/9311702/315-west-33rd-street-parking/?cid=9391484&cid-pricing-type=Monthly', text: 'See a live page' },
  },
  {
    name: 'SEO page revamp', type: 'Static pages',
    summary: 'Revamped Way.com’s SEO-focused pages, improving organic visibility and stabilizing search rankings.',
    stats: [{ value: 'Top spots', label: 'in Google Map Pack' }],
    link: { href: 'https://www.way.com/parking/airport/lax/', text: 'See the LAX airport page' },
  },
  {
    name: 'Careers page', type: 'New page',
    summary: 'Built and launched Way.com’s Careers page from the ground up. The site had no dedicated careers page or section before, and it remains the company’s primary recruitment platform.',
    stats: [{ value: 'Primary', label: 'recruitment platform for Way.com' }],
    link: { href: 'https://www.way.com/careers/', text: 'See the live page' },
  },
  {
    name: 'Tia Tareeq photography portfolio', type: 'Sample project',
    summary: 'A portfolio site for a Dubai-based photographer, built entirely with AI-assisted development on Base44.',
    stats: [{ value: 'Live', label: 'built and shipped with Base44' }],
    link: { href: 'https://tia-tareeq-portfolio.base44.app/', text: 'Visit the site' },
  },
];

export const EXPERIENCE = [
  {
    dates: 'May 2024 – Jun 2026', role: 'Software Engineer', company: 'Way.com',
    points: [
      'Revamped the City Parking pages through UI improvements and new elements, resulting in a 25–50% increase in revenue, 95% organic traffic growth and a 56% increase in transactions.',
      'Revamped Way.com’s SEO-focused pages, improving organic visibility, stabilizing search rankings and securing top Google Map Pack placements.',
      'Built the search pages for the Repair & Maintenance vertical, which reached 200,000+ organic visits in 2 months and enabled 70+ transactions.',
      'Built the search pages for the Mileage Tracker vertical, which grew to 100,000+ organic visits within 6 months and resulted in 150+ completed transactions.',
    ],
  },
  {
    dates: 'Sep 2022 – Apr 2024', role: 'Junior Software Developer, Frontend', company: 'Way.com',
    points: [
      'Released the Pearl & Opal Way+ Plans for Carwash, doubling weekly web orders from 20 to 40, and earned the “Wayfarer of the Month” award (Apr 2024).',
      'Built and launched a new Careers page on the existing Way.com website, which previously had no dedicated careers page or section. It continues to serve as the company’s primary recruitment platform.',
      'Developed and delivered high-quality transactional emails for Way.com and Global Airport Parking, driving significant revenue and customer engagement.',
    ],
  },
];

export const SKILLS = [
  { key: 'languages', items: ['Angular (v8–v21)', 'TypeScript', 'JavaScript (ES6+)', 'RxJS', 'HTML5', 'CSS3', 'Angular Material'] },
  { key: 'practice', items: ['Responsive and cross-browser design', 'REST API integration', 'Performance optimization', 'SEO', 'Component-based architecture', 'Agile/Scrum'] },
  { key: 'tools', items: ['Git', 'Jenkins (CI/CD)', 'Jira', 'ClickUp', 'Zoho', 'Figma', 'VS Code', 'Chrome DevTools'] },
  { key: 'aiAssisted', items: ['GitHub Copilot', 'Cursor', 'Claude', 'ChatGPT'] },
];

export const EDUCATION = [
  { title: 'Bachelor of Technology, Computer Science and Engineering', school: 'LBS Institute of Technology for Women, Poojapura, India', years: '2018 – 2022' },
];

export const CERTS = [
  { title: 'AWS Certified AI Practitioner', note: 'In progress' },
  { title: '1 Million Prompters: Prompt Engineering for AI Systems', note: 'Dubai Centre for Artificial Intelligence & Dubai Future Foundation' },
];
