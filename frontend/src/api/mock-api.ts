import {
  MOCK_TOKEN, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_CATEGORIES, MOCK_INDUSTRIES,
  MOCK_SKILLS, MOCK_SEEKER_PROFILE, MOCK_RESUMES, MOCK_COVER_LETTERS,
  paginate, nextId
} from './mock-data'

// ─── Toggle: set to false to hit real Spring Boot API ─────────────────────────
export const USE_MOCK = true

// ─── Simulate network delay (ms) ─────────────────────────────────────────────
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms))

// ─── In-memory mutable state ─────────────────────────────────────────────────
let jobs = [...MOCK_JOBS] as typeof MOCK_JOBS
let applications = [...MOCK_APPLICATIONS] as typeof MOCK_APPLICATIONS
let categories = [...MOCK_CATEGORIES] as typeof MOCK_CATEGORIES
let industries = [...MOCK_INDUSTRIES] as typeof MOCK_INDUSTRIES
let skills = [...MOCK_SKILLS] as typeof MOCK_SKILLS
let seekerProfile = { ...MOCK_SEEKER_PROFILE }
let resumes = [...MOCK_RESUMES]
let coverLetters = [...MOCK_COVER_LETTERS]

// ─── AUTH ─────────────────────────────────────────────────────────────────────
export const mockLogin = async (_email: string, _password: string) => {
  await delay(400)
  return { data: MOCK_TOKEN }
}

export const mockRegister = async (_data: unknown) => {
  await delay(300)
  return { data: { username: 'admin', email: 'admin@jobodia.com', isVerified: true, role: 'ADMIN' } }
}

export const mockVerifyOtp = async () => { await delay(200); return { data: null } }

// ─── JOBS ─────────────────────────────────────────────────────────────────────
export const mockGetJobs = async (page = 0, size = 9) => {
  await delay(300)
  return { data: paginate(jobs, page, size) }
}

export const mockSearchJobs = async (params: Record<string, unknown>, page = 0, size = 9) => {
  await delay(350)
  let filtered = [...jobs]
  if (params.title) filtered = filtered.filter(j => j.title.toLowerCase().includes(String(params.title).toLowerCase()))
  if (params.company) filtered = filtered.filter(j => j.employer.companyName.toLowerCase().includes(String(params.company).toLowerCase()))
  if (params.jobTime) filtered = filtered.filter(j => j.jobType === params.jobTime)
  if (params.jobLevel) filtered = filtered.filter(j => j.jobLevel === params.jobLevel)
  if (params.jobSite) filtered = filtered.filter(j => j.jobSite === params.jobSite)
  return { data: paginate(filtered, page, size) }
}

export const mockGetJob = async (id: number) => {
  await delay(200)
  return { data: jobs.find(j => j.id === id) }
}

export const mockGetMyJobs = async (page = 0, size = 9) => {
  await delay(300)
  return { data: paginate(jobs.filter(j => j.employer.companyName === 'TechCo Cambodia'), page, size) }
}

export const mockCreateJob = async (data: unknown) => {
  await delay(500)
  const job = { ...(data as object), id: nextId(), createdAt: new Date().toISOString(), employer: { id: 1, email: 'hr@techco.io', companyName: 'TechCo Cambodia', phoneNumber: '+855 23 456 789', location: 'Phnom Penh', description: '', companyLogoUrl: null } } as typeof MOCK_JOBS[0]
  jobs = [job, ...jobs]
  return { data: job }
}

export const mockUpdateJob = async (id: number, data: unknown) => {
  await delay(400)
  jobs = jobs.map(j => j.id === id ? { ...j, ...(data as object) } : j)
  return { data: jobs.find(j => j.id === id) }
}

export const mockDeleteJob = async (id: number) => {
  await delay(300)
  jobs = jobs.filter(j => j.id !== id)
  return { data: null }
}

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────
export const mockGetApplications = async (page = 0, size = 10) => {
  await delay(300)
  return { data: paginate(applications, page, size) }
}

export const mockApplyToJob = async (data: { jobId: number }) => {
  await delay(400)
  const job = jobs.find(j => j.id === data.jobId)
  const app = { id: nextId(), status: 'APPLIED', appliedAt: new Date().toISOString(), updatedAt: new Date().toISOString(), jobId: data.jobId, seekerId: 1, resumeId: 1, coverLetterId: 1, job: { id: data.jobId, title: job?.title || 'Unknown', employer: { companyName: job?.employer.companyName || '—' } }, seeker: { id: 1, username: 'admin', email: 'admin@jobodia.com' } }
  applications = [app, ...applications]
  return { data: app }
}

export const mockUpdateApplicationStatus = async (id: number, status: string) => {
  await delay(300)
  applications = applications.map(a => a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a)
  return { data: applications.find(a => a.id === id) }
}

export const mockDeleteApplication = async (id: number) => {
  await delay(250)
  applications = applications.filter(a => a.id !== id)
  return { data: null }
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
export const mockGetCategories = async (page = 0, size = 100) => {
  await delay(200); return { data: paginate(categories, page, size) }
}
export const mockCreateCategory = async (name: string) => {
  await delay(300)
  const item = { id: nextId(), categoryName: name }
  categories = [...categories, item]
  return { data: item }
}
export const mockUpdateCategory = async (id: number, name: string) => {
  await delay(250)
  categories = categories.map(c => c.id === id ? { ...c, categoryName: name } : c)
  return { data: categories.find(c => c.id === id) }
}
export const mockDeleteCategory = async (id: number) => {
  await delay(200); categories = categories.filter(c => c.id !== id); return { data: null }
}

export const mockGetIndustries = async (page = 0, size = 100) => {
  await delay(200); return { data: paginate(industries, page, size) }
}
export const mockCreateIndustry = async (name: string) => {
  await delay(300)
  const item = { id: nextId(), industryName: name }
  industries = [...industries, item]
  return { data: item }
}
export const mockUpdateIndustry = async (id: number, name: string) => {
  await delay(250)
  industries = industries.map(i => i.id === id ? { ...i, industryName: name } : i)
  return { data: industries.find(i => i.id === id) }
}
export const mockDeleteIndustry = async (id: number) => {
  await delay(200); industries = industries.filter(i => i.id !== id); return { data: null }
}

export const mockGetSkills = async (page = 0, size = 100) => {
  await delay(200); return { data: paginate(skills, page, size) }
}
export const mockCreateSkill = async (name: string) => {
  await delay(300)
  const item = { id: nextId(), skillName: name }
  skills = [...skills, item]
  return { data: item }
}
export const mockDeleteSkill = async (id: number) => {
  await delay(200); skills = skills.filter(s => s.id !== id); return { data: null }
}

// ─── PROFILES ─────────────────────────────────────────────────────────────────
export const mockGetSeekerProfile = async () => {
  await delay(300); return { data: seekerProfile }
}
export const mockCreateSeekerProfile = async (fd: FormData) => {
  await delay(400)
  const profile = JSON.parse(fd.get('profile') as string)
  seekerProfile = { ...seekerProfile, ...profile }
  return { data: seekerProfile }
}
export const mockAddSeekerSkills = async (skillIds: number[]) => {
  await delay(300)
  seekerProfile = { ...seekerProfile, skills: skills.filter(s => skillIds.includes(s.id)) }
  return { data: seekerProfile }
}

export const mockGetResumes = async () => {
  await delay(200); return { data: paginate(resumes, 0, 50) }
}
export const mockUploadResume = async (title: string, _file: File) => {
  await delay(600)
  resumes = [...resumes, { id: nextId(), title, resumeUrl: '/files/mock.pdf' }]
  return { data: null }
}
export const mockDeleteResume = async (id: number) => {
  await delay(200); resumes = resumes.filter(r => r.id !== id); return { data: null }
}

export const mockGetCoverLetters = async () => {
  await delay(200); return { data: paginate(coverLetters, 0, 50) }
}
export const mockUploadCoverLetter = async (title: string, _file: File) => {
  await delay(600)
  coverLetters = [...coverLetters, { id: nextId(), title, coverLetterUrl: '/files/mock.pdf' }]
  return { data: null }
}
export const mockDeleteCoverLetter = async (id: number) => {
  await delay(200); coverLetters = coverLetters.filter(c => c.id !== id); return { data: null }
}
