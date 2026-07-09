import { USE_MOCK, mockGetJobs, mockSearchJobs, mockGetJob, mockGetMyJobs, mockCreateJob, mockUpdateJob, mockDeleteJob } from './mock-api'
import client from './client'

export const getJobs = (page = 0, size = 9) =>
  USE_MOCK ? mockGetJobs(page, size) : client.get('/jobs', { params: { page, size, sort: 'createdAt,asc' } })

export const getNewlyAddedJobs = (page = 0, size = 9) =>
  USE_MOCK ? mockGetJobs(page, size) : client.get('/jobs/newly-added', { params: { page, size } })

export const searchJobs = (params: Record<string, unknown>, page = 0, size = 9) =>
  USE_MOCK ? mockSearchJobs(params, page, size) : client.get('/jobs/search', { params: { ...params, page, size } })

export const getJob = (id: number) =>
  USE_MOCK ? mockGetJob(id) : client.get(`/jobs/${id}`)

export const getMyJobs = (page = 0, size = 9) =>
  USE_MOCK ? mockGetMyJobs(page, size) : client.get('/jobs/me', { params: { page, size } })

export const createJob = (data: unknown) =>
  USE_MOCK ? mockCreateJob(data) : client.post('/jobs', data)

export const updateJob = (id: number, data: unknown) =>
  USE_MOCK ? mockUpdateJob(id, data) : client.put(`/jobs/${id}`, data)

export const deleteJob = (id: number) =>
  USE_MOCK ? mockDeleteJob(id) : client.delete(`/jobs/${id}`)
