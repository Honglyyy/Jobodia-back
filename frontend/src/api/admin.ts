import {
  USE_MOCK,
  mockGetCategories, mockCreateCategory, mockUpdateCategory, mockDeleteCategory,
  mockGetIndustries, mockCreateIndustry, mockUpdateIndustry, mockDeleteIndustry,
  mockGetSkills, mockCreateSkill, mockDeleteSkill,
} from './mock-api'
import client from './client'

export const getCategories = (page = 0, size = 50) =>
  USE_MOCK ? mockGetCategories(page, size) : client.get('/categories', { params: { page, size } })

export const createCategory = (categoryName: string) =>
  USE_MOCK ? mockCreateCategory(categoryName) : client.post('/categories', { categoryName })

export const updateCategory = (id: number, categoryName: string) =>
  USE_MOCK ? mockUpdateCategory(id, categoryName) : client.put(`/categories/${id}`, { categoryName })

export const deleteCategory = (id: number) =>
  USE_MOCK ? mockDeleteCategory(id) : client.delete(`/categories/${id}`)

export const getIndustries = (page = 0, size = 50) =>
  USE_MOCK ? mockGetIndustries(page, size) : client.get('/industries', { params: { page, size } })

export const createIndustry = (industryName: string) =>
  USE_MOCK ? mockCreateIndustry(industryName) : client.post('/industries', { industryName })

export const updateIndustry = (id: number, industryName: string) =>
  USE_MOCK ? mockUpdateIndustry(id, industryName) : client.put(`/industries/${id}`, { industryName })

export const deleteIndustry = (id: number) =>
  USE_MOCK ? mockDeleteIndustry(id) : client.delete(`/industries/${id}`)

export const getSkills = (page = 0, size = 50) =>
  USE_MOCK ? mockGetSkills(page, size) : client.get('/skills', { params: { page, size } })

export const createSkill = (skillName: string) =>
  USE_MOCK ? mockCreateSkill(skillName) : client.post('/skills', { skillName })

export const deleteSkill = (id: number) =>
  USE_MOCK ? mockDeleteSkill(id) : client.delete(`/skills/${id}`)
