import { USE_MOCK, mockLogin, mockRegister, mockVerifyOtp } from './mock-api'
import client from './client'

export const login = (email: string, password: string) =>
  USE_MOCK ? mockLogin(email, password) : client.post<string>('/auth/authenticate', { email, password })

export const register = (data: { username: string; email: string; password: string; role: string }) =>
  USE_MOCK ? mockRegister(data) : client.post('/auth/register', data)

export const verifyOtp = (email: string, otp: string) =>
  USE_MOCK ? mockVerifyOtp() : client.post('/auth/verify-otp', { email, otp })

export const sendResetOtp = (email: string) =>
  client.post(`/auth/send-reset-otp?email=${encodeURIComponent(email)}`)

export const resetPassword = (email: string, otp: string, password: string) =>
  client.post('/auth/reset-password', { email, otp, password })
