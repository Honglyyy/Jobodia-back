import { useAuth } from '../context/AuthContext'
import { USE_MOCK } from '../api/mock-api'
import {
  LayoutDashboard, Briefcase, FileText, Users, Tags, Factory,
  Wrench, LogOut, ChevronRight, UserCircle, FileCheck, Laptop, FlaskConical
} from 'lucide-react'

const NAV_ITEMS = {
  common: [
    { icon: LayoutDashboard, label: 'Jobs', path: '/jobs' },
  ],
  SEEKER: [
    { icon: FileText, label: 'My Applications', path: '/applications' },
    { icon: UserCircle, label: 'My Profile', path: '/seeker-profile' },
    { icon: FileCheck, label: 'Resumes & Letters', path: '/documents' },
  ],
  EMPLOYER: [
    { icon: Briefcase, label: 'My Job Posts', path: '/my-jobs' },
    { icon: Users, label: 'Applicants', path: '/applicants' },
    { icon: UserCircle, label: 'Company Profile', path: '/employer-profile' },
  ],
  ADMIN: [
    { icon: Tags, label: 'Categories', path: '/admin/categories' },
    { icon: Factory, label: 'Industries', path: '/admin/industries' },
    { icon: Wrench, label: 'Skills', path: '/admin/skills' },
  ],
}

interface SidebarProps {
  current: string
  onNavigate: (path: string) => void
}

export default function Sidebar({ current, onNavigate }: SidebarProps) {
  const { user, logout } = useAuth()
  const role = user?.role as keyof typeof NAV_ITEMS | undefined
  const roleItems = role ? (NAV_ITEMS[role] || []) : []

  const roleColors: Record<string, { bg: string; text: string; border: string }> = {
    ADMIN:    { bg: '#fdf4ff', text: '#7e22ce', border: '#e9d5ff' },
    EMPLOYER: { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
    SEEKER:   { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
  }
  const rc = role ? (roleColors[role] || roleColors.SEEKER) : roleColors.SEEKER

  const NavLink = ({ icon: Icon, label, path }: { icon: React.ElementType; label: string; path: string }) => (
    <button className={`nav-link ${current === path ? 'active' : ''}`} onClick={() => onNavigate(path)}>
      <Icon size={15} />
      <span>{label}</span>
      {current === path && <ChevronRight size={13} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
    </button>
  )

  return (
    <aside style={{
      width: 220, minWidth: 220, height: '100vh',
      display: 'flex', flexDirection: 'column',
      padding: '20px 12px',
      borderRight: '1px solid #e5e7eb',
      background: '#ffffff',
      boxShadow: '1px 0 0 #f3f4f6',
    }}>
      {/* Logo */}
      <div style={{ padding: '6px 12px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '1.05rem', fontWeight: 700, color: '#1d4ed8', letterSpacing: '-0.02em' }}>
          <Laptop size={18} />
          <span>Jobodia</span>
        </div>
        <div style={{ fontSize: '0.68rem', color: '#9ca3af', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
          Dev Playground
          {USE_MOCK && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.62rem', padding: '1px 5px', borderRadius: 4, background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontWeight: 600 }}>
              <FlaskConical size={10} />
              <span>mock</span>
            </span>
          )}
        </div>
      </div>

      {/* User badge */}
      {user && (
        <div style={{
          margin: '0 2px 16px', padding: '10px 12px', borderRadius: 10,
          background: '#f9fafb', border: '1px solid #e5e7eb',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.email}
          </div>
          <span style={{
            fontSize: '0.65rem', padding: '2px 8px', borderRadius: 99,
            background: rc.bg, color: rc.text, border: `1px solid ${rc.border}`,
            textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700,
          }}>
            {user.role}
          </span>
        </div>
      )}

      {/* Nav */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <div className="nav-section-title">Browse</div>
        {NAV_ITEMS.common.map(item => <NavLink key={item.path} {...item} />)}
        {roleItems.length > 0 && (
          <>
            <div className="nav-section-title" style={{ marginTop: 10 }}>{role}</div>
            {roleItems.map(item => <NavLink key={item.path} {...item} />)}
          </>
        )}
      </div>

      {/* Logout */}
      <button className="nav-link" onClick={logout} style={{ color: '#ef4444', marginTop: 'auto' }}>
        <LogOut size={15} />
        <span>Logout</span>
      </button>
    </aside>
  )
}
