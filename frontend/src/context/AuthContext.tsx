import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { USE_MOCK } from '../api/mock-api'

interface User {
  email: string
  role: 'ADMIN' | 'SEEKER' | 'EMPLOYER'
}

interface AuthCtx {
  user: User | null
  token: string | null
  login: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

function decodeUser(token: string): User | null {
  // Mock token — return admin user directly
  if (USE_MOCK || token.startsWith('mock.')) {
    return { email: 'admin@jobodia.com', role: 'ADMIN' }
  }
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const rawRole: string = (payload.roles?.[0] || payload.role || '')
    const role = rawRole.replace('ROLE_', '') as User['role']
    return { email: payload.sub, role }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('jwt'))
  const [user, setUser] = useState<User | null>(() => {
    const t = localStorage.getItem('jwt')
    return t ? decodeUser(t) : null
  })

  const login = (newToken: string) => {
    localStorage.setItem('jwt', newToken)
    setToken(newToken)
    setUser(decodeUser(newToken))
  }

  const logout = () => {
    localStorage.removeItem('jwt')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
