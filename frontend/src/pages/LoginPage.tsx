import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { USE_MOCK } from '../api/mock-api'
import { login as loginApi } from '../api/auth'
import { Eye, EyeOff, Loader2, Laptop, FlaskConical } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const autoFill = () => { setEmail('admin@jobodia.com'); setPassword('admin123') }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginApi(email, password)
      login(res.data)
      navigate('/jobs')
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 13px', borderRadius: 9,
    border: '1px solid #d1d5db', background: '#fff',
    color: '#111827', fontSize: '0.9rem', outline: 'none',
    boxSizing: 'border-box', transition: 'border-color 0.15s, box-shadow 0.15s',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f4ff 0%, #fafafa 50%, #f0fdf4 100%)',
      padding: 24,
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <Laptop size={42} style={{ color: '#2563eb' }} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.03em' }}>
            Jobodia
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 6 }}>
            Sign in to explore your API data
          </p>
        </div>

        <div className="glass fade-up" style={{ padding: '32px 28px' }}>
          {USE_MOCK && (
            <div style={{
              marginBottom: 20, padding: '10px 14px', borderRadius: 8,
              background: '#fffbeb', border: '1px solid #fde68a',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#92400e', fontWeight: 500 }}>
                <FlaskConical size={15} /> Mock mode — no backend needed
              </span>
              <button type="button" onClick={autoFill} style={{
                fontSize: '0.75rem', padding: '4px 12px', borderRadius: 6,
                border: '1px solid #f59e0b', background: '#fff', color: '#b45309',
                cursor: 'pointer', fontWeight: 600,
              }}>Auto-fill ↗</button>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Email address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" required style={inp} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  required style={{ ...inp, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0,
                }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ padding: '10px 13px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '11px', borderRadius: 9, border: 'none',
              background: loading ? '#93c5fd' : '#2563eb',
              color: '#fff', fontWeight: 600, fontSize: '0.9rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              transition: 'background 0.15s', boxShadow: loading ? 'none' : '0 2px 8px rgba(37,99,235,0.3)',
            }}>
              {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <button onClick={() => navigate('/register')} style={{
            background: 'none', border: 'none', color: '#2563eb',
            fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500,
          }}>
            No account? Register →
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
