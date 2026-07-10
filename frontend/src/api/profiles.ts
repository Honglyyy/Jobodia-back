import {
  USE_MOCK,
  mockGetSeekerProfile, mockCreateSeekerProfile, mockAddSeekerSkills,
  mockGetResumes, mockUploadResume, mockDeleteResume,
  mockGetCoverLetters, mockUploadCoverLetter, mockDeleteCoverLetter,
} from './mock-api'
import client from './client'

// Seeker profile
export const getSeekerProfile = () =>
  USE_MOCK ? mockGetSeekerProfile() : client.get('/seeker-profiles')

export const createSeekerProfile = (formData: FormData) =>
  USE_MOCK ? mockCreateSeekerProfile(formData) : client.post('/seeker-profiles', formData, { headers: { 'Content-Type': 'multipart/form-data' } })

export const addSeekerSkills = (skillIds: number[]) =>
  USE_MOCK ? mockAddSeekerSkills(skillIds) : client.post('/seeker-profiles/skills', { skillId: skillIds })

// Resumes
export const getResumes = (_page = 0, _size = 10) =>
  USE_MOCK ? mockGetResumes() : client.get('/seeker-resumes/me', { params: { page: _page, size: _size } })

export const uploadResume = (title: string, file: File) => {
  if (USE_MOCK) return mockUploadResume(title, file)
  const fd = new FormData(); fd.append('title', title); fd.append('file', file)
  return client.post('/seeker-resumes', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export const deleteResume = (id: number) =>
  USE_MOCK ? mockDeleteResume(id) : client.delete(`/seeker-resumes/${id}`)

// Cover Letters
export const getCoverLetters = (_page = 0, _size = 10) =>
  USE_MOCK ? mockGetCoverLetters() : client.get('/seeker-cover-letters/me', { params: { page: _page, size: _size } })

export const uploadCoverLetter = (title: string, file: File) => {
  if (USE_MOCK) return mockUploadCoverLetter(title, file)
  const fd = new FormData(); fd.append('title', title); fd.append('file', file)
  return client.post('/seeker-cover-letters', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export const deleteCoverLetter = (id: number) =>
  USE_MOCK ? mockDeleteCoverLetter(id) : client.delete(`/seeker-cover-letters/${id}`)

// Employer profile
export const createEmployerProfile = (formData: FormData) =>
  client.post('/employer-profiles', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
