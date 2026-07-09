// ─── Mock data for all Jobodia entities ───────────────────────────────────────

export const MOCK_TOKEN = 'mock.eyJzdWIiOiJhZG1pbkBqb2JvZGlhLmNvbSIsInJvbGVzIjpbIlJPTEVfQURNSU4iXSwiZXhwIjo5OTk5OTk5OTk5fQ.mock'

export const MOCK_CATEGORIES = [
  { id: 1, categoryName: 'Software Engineering' },
  { id: 2, categoryName: 'Data Science' },
  { id: 3, categoryName: 'Product Management' },
  { id: 4, categoryName: 'UX / Design' },
  { id: 5, categoryName: 'DevOps & Cloud' },
  { id: 6, categoryName: 'Mobile Development' },
  { id: 7, categoryName: 'Cybersecurity' },
  { id: 8, categoryName: 'Marketing' },
  { id: 9, categoryName: 'Finance & Accounting' },
  { id: 10, categoryName: 'Human Resources' },
]

export const MOCK_INDUSTRIES = [
  { id: 1, industryName: 'Technology' },
  { id: 2, industryName: 'Finance & Banking' },
  { id: 3, industryName: 'Healthcare' },
  { id: 4, industryName: 'E-Commerce' },
  { id: 5, industryName: 'Education' },
  { id: 6, industryName: 'Logistics & Supply Chain' },
  { id: 7, industryName: 'Media & Entertainment' },
  { id: 8, industryName: 'Real Estate' },
]

export const MOCK_SKILLS = [
  { id: 1, skillName: 'React' },
  { id: 2, skillName: 'TypeScript' },
  { id: 3, skillName: 'Java' },
  { id: 4, skillName: 'Spring Boot' },
  { id: 5, skillName: 'Python' },
  { id: 6, skillName: 'PostgreSQL' },
  { id: 7, skillName: 'Docker' },
  { id: 8, skillName: 'Kubernetes' },
  { id: 9, skillName: 'Node.js' },
  { id: 10, skillName: 'AWS' },
  { id: 11, skillName: 'GraphQL' },
  { id: 12, skillName: 'Flutter' },
  { id: 13, skillName: 'Figma' },
  { id: 14, skillName: 'Machine Learning' },
  { id: 15, skillName: 'Kotlin' },
]

export const MOCK_JOBS = [
  {
    id: 1, title: 'Senior React Developer', minSalary: 2500, maxSalary: 4500,
    description: 'We are looking for a Senior React Developer to join our growing team and help build world-class web applications.',
    summary: 'Lead frontend development for our SaaS platform used by 50k+ users across Southeast Asia.',
    jobType: 'FULL_TIME', jobLevel: 'SENIOR', jobGender: 'MALE_FEMALE', jobSite: 'REMOTE',
    yearsOfExperience: 4, availablePosition: 2,
    expiresAt: '2026-09-01', createdAt: '2026-06-15T08:00:00',
    responsibilities: ['Lead UI architecture decisions', 'Mentor junior developers', 'Code reviews & testing strategy'],
    requirements: ['4+ years React experience', 'TypeScript proficiency', 'Strong CSS & animation skills'],
    benefits: ['Health insurance', 'Remote work', 'Annual bonus', 'Learning budget $500/yr'],
    languages: ['English', 'Khmer'], qualifications: ["Bachelor's in CS or equivalent"],
    categoriesId: [1], skillsId: [1, 2, 9], industriesId: 1,
    employer: { id: 1, email: 'hr@techco.io', companyName: 'TechCo Cambodia', phoneNumber: '+855 23 456 789', location: 'Phnom Penh', description: 'Leading SaaS company in SEA', companyLogoUrl: null },
  },
  {
    id: 2, title: 'Spring Boot Backend Engineer', minSalary: 2000, maxSalary: 3500,
    description: 'Join our backend team to build scalable microservices powering Cambodia\'s largest e-commerce platform.',
    summary: 'Build and maintain REST APIs used by millions of daily active users.',
    jobType: 'FULL_TIME', jobLevel: 'MID', jobGender: 'MALE_FEMALE', jobSite: 'ON_SITE',
    yearsOfExperience: 2, availablePosition: 3,
    expiresAt: '2026-08-15', createdAt: '2026-06-20T09:00:00',
    responsibilities: ['Design and implement REST APIs', 'Optimize database queries', 'Write unit & integration tests'],
    requirements: ['Java 17+', 'Spring Boot experience', 'PostgreSQL knowledge'],
    benefits: ['13th month salary', 'Free lunch', 'Gym membership'],
    languages: ['English'], qualifications: ["Bachelor's in Software Engineering"],
    categoriesId: [1], skillsId: [3, 4, 6], industriesId: 4,
    employer: { id: 2, email: 'jobs@shopkh.com', companyName: 'ShopKH', phoneNumber: '+855 12 345 678', location: 'Phnom Penh', description: 'Cambodia\'s #1 e-commerce platform', companyLogoUrl: null },
  },
  {
    id: 3, title: 'Data Scientist', minSalary: 2200, maxSalary: 4000,
    description: 'We are hiring a Data Scientist to extract insights from our financial data and power ML-driven features.',
    summary: 'Build predictive models for credit scoring and fraud detection.',
    jobType: 'FULL_TIME', jobLevel: 'MID', jobGender: 'MALE_FEMALE', jobSite: 'HYBRID',
    yearsOfExperience: 3, availablePosition: 1,
    expiresAt: '2026-08-30', createdAt: '2026-07-01T10:00:00',
    responsibilities: ['Build and deploy ML models', 'Analyze large datasets', 'Collaborate with product team'],
    requirements: ['Python & pandas proficiency', 'ML frameworks (scikit-learn, PyTorch)', 'SQL experience'],
    benefits: ['Stock options', 'Flexible hours', 'Health + dental'],
    languages: ['English'], qualifications: ["Master's in Statistics or CS preferred"],
    categoriesId: [2], skillsId: [5, 14, 6], industriesId: 2,
    employer: { id: 3, email: 'careers@aba.com.kh', companyName: 'ABA Bank', phoneNumber: '+855 23 888 900', location: 'Phnom Penh', description: 'Leading digital bank in Cambodia', companyLogoUrl: null },
  },
  {
    id: 4, title: 'DevOps Engineer', minSalary: 2800, maxSalary: 5000,
    description: 'Build and maintain our cloud infrastructure to support rapid product growth.',
    summary: 'Own CI/CD, Kubernetes clusters, and observability stack.',
    jobType: 'FULL_TIME', jobLevel: 'SENIOR', jobGender: 'MALE_FEMALE', jobSite: 'REMOTE',
    yearsOfExperience: 5, availablePosition: 1,
    expiresAt: '2026-09-15', createdAt: '2026-06-28T08:30:00',
    responsibilities: ['Manage EKS clusters on AWS', 'Build CI/CD pipelines', 'Incident response & on-call'],
    requirements: ['AWS certified preferred', 'Kubernetes expertise', 'Terraform / IaC experience'],
    benefits: ['Remote first', 'Home office stipend', 'Premium health insurance'],
    languages: ['English'], qualifications: ["Bachelor's in CS or Engineering"],
    categoriesId: [5], skillsId: [7, 8, 10], industriesId: 1,
    employer: { id: 1, email: 'hr@techco.io', companyName: 'TechCo Cambodia', phoneNumber: '+855 23 456 789', location: 'Phnom Penh', description: 'Leading SaaS company in SEA', companyLogoUrl: null },
  },
  {
    id: 5, title: 'Flutter Mobile Developer', minSalary: 1800, maxSalary: 3200,
    description: 'Build beautiful cross-platform mobile apps used by hundreds of thousands of Cambodians.',
    summary: 'Develop and maintain our iOS & Android apps with Flutter.',
    jobType: 'FULL_TIME', jobLevel: 'JUNIOR', jobGender: 'MALE_FEMALE', jobSite: 'ON_SITE',
    yearsOfExperience: 1, availablePosition: 2,
    expiresAt: '2026-08-01', createdAt: '2026-07-03T11:00:00',
    responsibilities: ['Develop Flutter UI components', 'Integrate REST APIs', 'Write widget tests'],
    requirements: ['Flutter & Dart proficiency', 'Published app preferred', 'State management (Bloc/Riverpod)'],
    benefits: ['MacBook Pro provided', 'Training budget', 'Annual trip'],
    languages: ['English', 'Khmer'], qualifications: ["Bachelor's in CS or related"],
    categoriesId: [6], skillsId: [12, 15], industriesId: 4,
    employer: { id: 2, email: 'jobs@shopkh.com', companyName: 'ShopKH', phoneNumber: '+855 12 345 678', location: 'Phnom Penh', description: 'Cambodia\'s #1 e-commerce platform', companyLogoUrl: null },
  },
  {
    id: 6, title: 'UI/UX Designer', minSalary: 1500, maxSalary: 2800,
    description: 'Design intuitive, beautiful interfaces for our edtech platform serving 100k+ students.',
    summary: 'Own the end-to-end design process from research to pixel-perfect delivery.',
    jobType: 'FULL_TIME', jobLevel: 'MID', jobGender: 'MALE_FEMALE', jobSite: 'ON_SITE',
    yearsOfExperience: 2, availablePosition: 1,
    expiresAt: '2026-08-20', createdAt: '2026-07-05T09:00:00',
    responsibilities: ['Conduct user research', 'Create wireframes & prototypes in Figma', 'Collaborate with engineering team'],
    requirements: ['Figma expertise', 'Strong portfolio', 'Mobile-first design experience'],
    benefits: ['Creative environment', 'Design tools budget', 'Flexible hours'],
    languages: ['English', 'Khmer'], qualifications: ["Degree in Design, HCI, or equivalent portfolio"],
    categoriesId: [4], skillsId: [13], industriesId: 5,
    employer: { id: 4, email: 'hr@edukh.com', companyName: 'EduKH', phoneNumber: '+855 15 678 901', location: 'Siem Reap', description: 'Cambodia\'s leading edtech platform', companyLogoUrl: null },
  },
  {
    id: 7, title: 'Product Manager', minSalary: 2500, maxSalary: 4500,
    description: 'Define the product roadmap and drive execution with engineering and design teams.',
    summary: 'Own the core product lifecycle for our logistics SaaS serving 200+ clients.',
    jobType: 'FULL_TIME', jobLevel: 'SENIOR', jobGender: 'MALE_FEMALE', jobSite: 'HYBRID',
    yearsOfExperience: 4, availablePosition: 1,
    expiresAt: '2026-09-30', createdAt: '2026-07-06T10:00:00',
    responsibilities: ['Write clear PRDs and user stories', 'Work closely with engineering leads', 'Analyse product metrics weekly'],
    requirements: ['4+ years PM experience', 'Data-driven mindset', 'Excellent communication'],
    benefits: ['Equity options', 'Top-tier salary', 'Executive coaching'],
    languages: ['English'], qualifications: ["MBA or CS degree preferred"],
    categoriesId: [3], skillsId: [6], industriesId: 6,
    employer: { id: 5, email: 'jobs@speedex.kh', companyName: 'SpeedEx Logistics', phoneNumber: '+855 77 234 567', location: 'Phnom Penh', description: 'Leading last-mile delivery platform in Cambodia', companyLogoUrl: null },
  },
  {
    id: 8, title: 'Cybersecurity Analyst', minSalary: 2200, maxSalary: 3800,
    description: 'Protect our banking infrastructure and client data from emerging cyber threats.',
    summary: 'Monitor, detect, and respond to security incidents across our digital banking environment.',
    jobType: 'FULL_TIME', jobLevel: 'MID', jobGender: 'MALE', jobSite: 'ON_SITE',
    yearsOfExperience: 3, availablePosition: 2,
    expiresAt: '2026-09-01', createdAt: '2026-07-07T08:00:00',
    responsibilities: ['Security monitoring (SIEM)', 'Vulnerability assessments', 'Incident response & reporting'],
    requirements: ['CEH or CISSP preferred', 'Network security knowledge', 'Scripting (Python/Bash)'],
    benefits: ['Security clearance training', 'Competitive salary', 'Career growth path'],
    languages: ['English'], qualifications: ["Bachelor's in Cybersecurity or CS"],
    categoriesId: [7], skillsId: [5, 10], industriesId: 2,
    employer: { id: 3, email: 'careers@aba.com.kh', companyName: 'ABA Bank', phoneNumber: '+855 23 888 900', location: 'Phnom Penh', description: 'Leading digital bank in Cambodia', companyLogoUrl: null },
  },
  {
    id: 9, title: 'Junior Java Developer', minSalary: 800, maxSalary: 1400,
    description: 'Great opportunity for fresh graduates to kick-start their Java career in a supportive environment.',
    summary: 'Join our backend guild and learn enterprise Java development from scratch.',
    jobType: 'FULL_TIME', jobLevel: 'JUNIOR', jobGender: 'MALE_FEMALE', jobSite: 'ON_SITE',
    yearsOfExperience: 0, availablePosition: 5,
    expiresAt: '2026-08-15', createdAt: '2026-07-08T07:30:00',
    responsibilities: ['Develop and maintain Java modules', 'Fix bugs and write unit tests', 'Participate in daily standups'],
    requirements: ['Java fundamentals', 'OOP understanding', 'Willing to learn Spring Boot'],
    benefits: ['Mentorship program', 'Training courses paid', 'Fresh grad welcome'],
    languages: ['English', 'Khmer'], qualifications: ["Bachelor's in CS or IT (fresh grads welcome)"],
    categoriesId: [1], skillsId: [3, 4], industriesId: 1,
    employer: { id: 1, email: 'hr@techco.io', companyName: 'TechCo Cambodia', phoneNumber: '+855 23 456 789', location: 'Phnom Penh', description: 'Leading SaaS company in SEA', companyLogoUrl: null },
  },
]

export const MOCK_APPLICATIONS = [
  {
    id: 1, status: 'HIRED', appliedAt: '2026-06-01T10:00:00', updatedAt: '2026-06-10T14:00:00',
    jobId: 1, seekerId: 1, resumeId: 1, coverLetterId: 1,
    job: { id: 1, title: 'Senior React Developer', employer: { companyName: 'TechCo Cambodia' } },
    seeker: { id: 1, username: 'dev_john', email: 'john@example.com' },
  },
  {
    id: 2, status: 'REVIEWING', appliedAt: '2026-06-15T09:00:00', updatedAt: '2026-06-16T11:00:00',
    jobId: 3, seekerId: 1, resumeId: 1, coverLetterId: null,
    job: { id: 3, title: 'Data Scientist', employer: { companyName: 'ABA Bank' } },
    seeker: { id: 1, username: 'dev_john', email: 'john@example.com' },
  },
  {
    id: 3, status: 'APPLIED', appliedAt: '2026-07-01T08:30:00', updatedAt: '2026-07-01T08:30:00',
    jobId: 4, seekerId: 2, resumeId: 2, coverLetterId: 2,
    job: { id: 4, title: 'DevOps Engineer', employer: { companyName: 'TechCo Cambodia' } },
    seeker: { id: 2, username: 'sara_dev', email: 'sara@example.com' },
  },
  {
    id: 4, status: 'INTERVIEWED', appliedAt: '2026-06-20T13:00:00', updatedAt: '2026-06-28T10:00:00',
    jobId: 2, seekerId: 3, resumeId: 3, coverLetterId: null,
    job: { id: 2, title: 'Spring Boot Backend Engineer', employer: { companyName: 'ShopKH' } },
    seeker: { id: 3, username: 'mike_kh', email: 'mike@example.com' },
  },
  {
    id: 5, status: 'REJECTED', appliedAt: '2026-06-10T11:00:00', updatedAt: '2026-06-14T09:00:00',
    jobId: 5, seekerId: 4, resumeId: 4, coverLetterId: 3,
    job: { id: 5, title: 'Flutter Mobile Developer', employer: { companyName: 'ShopKH' } },
    seeker: { id: 4, username: 'flutter_dev', email: 'flutter@example.com' },
  },
]

export const MOCK_SEEKER_PROFILE = {
  id: 1, username: 'admin', email: 'admin@jobodia.com',
  phoneNumber: '+855 12 345 678', gender: 'MALE', address: 'Phnom Penh, Cambodia',
  userId: 'user-001', profilePictureUrl: null,
  skills: [
    { id: 1, skillName: 'React' },
    { id: 2, skillName: 'TypeScript' },
    { id: 6, skillName: 'PostgreSQL' },
  ],
}

export const MOCK_RESUMES = [
  { id: 1, title: 'Full Stack Developer CV 2026', resumeUrl: '/files/resume1.pdf' },
  { id: 2, title: 'Technical Resume - React Focus', resumeUrl: '/files/resume2.pdf' },
]

export const MOCK_COVER_LETTERS = [
  { id: 1, title: 'Cover Letter - TechCo Application', coverLetterUrl: '/files/cl1.pdf' },
  { id: 2, title: 'Cover Letter - DevOps Role', coverLetterUrl: '/files/cl2.pdf' },
]

// ─── Paginate helper ─────────────────────────────────────────────────────────
export function paginate<T>(arr: T[], page: number, size: number) {
  const start = page * size
  return {
    content: arr.slice(start, start + size),
    totalElements: arr.length,
    totalPages: Math.ceil(arr.length / size),
    number: page,
    size,
  }
}

// ─── ID counter ──────────────────────────────────────────────────────────────
let _nextId = 100
export const nextId = () => ++_nextId
