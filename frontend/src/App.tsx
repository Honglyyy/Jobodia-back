
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobsPage from './pages/JobsPage'
import ApplicationsPage from './pages/ApplicationsPage'
import AdminPage from './pages/AdminPage'
import SeekerProfilePage from './pages/SeekerProfilePage'
import EmployerProfilePage from './pages/EmployerProfilePage'

function AppLayout() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (!isAuthenticated) return null

  const handleNavigate = (path: string) => navigate(path)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar current={location.pathname} onNavigate={handleNavigate} />
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <Routes>
          <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
          <Route path="/applications" element={<ProtectedRoute roles={['SEEKER']}><ApplicationsPage /></ProtectedRoute>} />
          <Route path="/applicants" element={<ProtectedRoute roles={['EMPLOYER']}><ApplicationsPage /></ProtectedRoute>} />
          <Route path="/seeker-profile" element={<ProtectedRoute roles={['SEEKER']}><SeekerProfilePage /></ProtectedRoute>} />
          <Route path="/documents" element={<ProtectedRoute roles={['SEEKER']}><SeekerProfilePage /></ProtectedRoute>} />
          <Route path="/employer-profile" element={<ProtectedRoute roles={['EMPLOYER']}><EmployerProfilePage /></ProtectedRoute>} />
          <Route path="/my-jobs" element={<ProtectedRoute roles={['EMPLOYER']}><JobsPage /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute roles={['ADMIN']}><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/industries" element={<ProtectedRoute roles={['ADMIN']}><AdminPage /></ProtectedRoute>} />
          <Route path="/admin/skills" element={<ProtectedRoute roles={['ADMIN']}><AdminPage /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/jobs" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function RootRouter() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/jobs" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/jobs" replace /> : <RegisterPage />} />
      <Route path="*" element={isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RootRouter />
      </AuthProvider>
    </BrowserRouter>
  )
}
