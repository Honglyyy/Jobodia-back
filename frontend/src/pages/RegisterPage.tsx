import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as registerApi, verifyOtp } from '../api/auth'
import { Loader2, CheckCircle, Laptop } from 'lucide-react'

const ROLES = ['SEEKER', 'EMPLOYER', 'ADMIN']

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'register' | 'otp'>('register')
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'SEEKER' })
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await registerApi(form)
      setStep('otp')
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await verifyOtp(form.email, otp)
      navigate('/login')
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Invalid OTP')
    } finally { setLoading(false) }
  }

  const inputStyle: React.CSSProperties = {
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
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
            <Laptop size={42} style={{ color: '#2563eb' }} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#111827', margin: 0, letterSpacing: '-0.03em' }}>
            {step === 'register' ? 'Create Account' : 'Verify Email'}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: 6 }}>
            {step === 'register' ? 'Join the Jobodia platform' : `Enter the OTP sent to ${form.email}`}
          </p>
        </div>

        <div className="glass fade-up" style={{ padding: '32px 28px' }}>
          {step === 'register' ? (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { key: 'username', label: 'Username', type: 'text', placeholder: 'johndoe' },
                { key: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
                { key: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>{label}</label>
                  <input type={type} placeholder={placeholder} value={form[key as keyof typeof form]}
                    onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                    required style={inputStyle} />
                </div>
              ))}

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Role</label>
                <select value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
                  style={{ ...inputStyle, cursor: 'pointer' }}>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {error && (
                <div style={{ padding: '10px 13px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', borderRadius: 9, border: 'none', background: loading ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 600, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s', boxShadow: loading ? 'none' : '0 2px 8px rgba(37,99,235,0.3)' }}>
                {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ textAlign: 'center', padding: '16px', background: '#ecfdf5', borderRadius: 10, border: '1px solid #a7f3d0' }}>
                <CheckCircle size={28} style={{ color: '#059669', marginBottom: 8, margin: '0 auto' }} />
                <p style={{ color: '#065f46', fontSize: '0.85rem', margin: 0, fontWeight: 500 }}>Check your email for the OTP code</p>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>6-digit OTP</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" required maxLength={6} style={{ ...inputStyle, letterSpacing: '0.2em', fontSize: '1.2rem', textAlign: 'center' }} />
              </div>

              {error && (
                <div style={{ padding: '10px 13px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.85rem' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{ width: '100%', padding: '11px', borderRadius: 9, border: 'none', background: loading ? '#93c5fd' : '#2563eb', color: 'white', fontWeight: 600, fontSize: '0.9rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {loading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                {loading ? 'Verifying…' : 'Verify OTP'}
              </button>
            </form>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.875rem', cursor: 'pointer', fontWeight: 500 }}>
            Already have an account? Sign In →
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
