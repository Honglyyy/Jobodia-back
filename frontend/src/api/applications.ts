import { USE_MOCK, mockGetApplications, mockApplyToJob, mockUpdateApplicationStatus, mockDeleteApplication } from './mock-api'
import client from './client'

export const getApplications = (page = 0, size = 10) =>
  USE_MOCK ? mockGetApplications(page, size) : client.get('/applications/me', { params: { page, size } })

export const getApplication = (id: number) =>
  USE_MOCK ? Promise.resolve({ data: null }) : client.get(`/applications/me/${id}`)

export const applyToJob = (data: { jobId: number; resumeId: number; coverLetterId: number }) =>
  USE_MOCK ? mockApplyToJob(data) : client.post('/applications', data)

export const deleteApplication = (id: number) =>
  USE_MOCK ? mockDeleteApplication(id) : client.delete(`/applications/me/${id}`)

// Employer
export const getApplicants = (page = 0, size = 10) =>
  USE_MOCK ? mockGetApplications(page, size) : client.get('/applications/applicants', { params: { page, size } })

export const getApplicant = (id: number) =>
  USE_MOCK ? Promise.resolve({ data: null }) : client.get(`/applications/applicants/${id}`)

export const updateApplicationStatus = (id: number, status: string) =>
  USE_MOCK ? mockUpdateApplicationStatus(id, status) : client.patch(`/applications/applicants/${id}`, { status })
