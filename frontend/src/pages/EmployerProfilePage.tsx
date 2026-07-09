import { useState } from 'react'
import { createEmployerProfile } from '../api/profiles'
import { Building2, Loader2, MapPin, Phone, FileText, CheckCircle } from 'lucide-react'

export default function EmployerProfilePage() {
  const [form, setForm] = useState({ companyName: '', phoneNumber: '', location: '', description: '' })
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 13px', borderRadius: 9, border: '1px solid #d1d5db',
    background: '#fff', color: '#111827', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const fd = new FormData()
      fd.append('profile', new Blob([JSON.stringify(form)], { type: 'application/json' }))
      if (file) fd.append('file', file)
      await createEmployerProfile(fd)
      setSuccess(true)
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 520, width: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Company Profile</h2>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '3px 0 0' }}>Set up your employer profile</p>
      </div>

      {success ? (
        <div className="glass fade-up" style={{ padding: '40px 32px', textAlign: 'center' }}>
          <CheckCircle size={40} style={{ color: '#15803d', marginBottom: 14 }} />
          <h3 style={{ color: '#111827', marginBottom: 8, fontSize: '1.1rem', fontWeight: 700 }}>Profile Saved!</h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: '0 0 20px' }}>Your company profile has been saved successfully.</p>
          <button onClick={() => setSuccess(false)} style={{ padding: '9px 22px', borderRadius: 9, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}>
            Update Profile
          </button>
        </div>
      ) : (
        <div className="glass fade-up" style={{ padding: '24px 28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {[
              { key: 'companyName', label: 'Company Name', icon: <Building2 size={14} />, ph: 'Acme Corp' },
              { key: 'phoneNumber', label: 'Phone Number', icon: <Phone size={14} />, ph: '+855 23 456 789' },
              { key: 'location', label: 'Location', icon: <MapPin size={14} />, ph: 'Phnom Penh, Cambodia' },
            ].map(({ key, label, icon, ph }) => (
              <div key={key}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                  {icon} {label}
                </label>
                <input required value={form[key as keyof typeof form]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} style={inp} />
              </div>
            ))}

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                <FileText size={14} /> Description
              </label>
              <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Tell job seekers about your company…" style={{ ...inp, resize: 'vertical', lineHeight: 1.55 }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Company Logo (optional)</label>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} style={{ ...inp, padding: '7px 12px' }} />
            </div>

            {error && <div style={{ padding: '10px 13px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '0.85rem' }}>{error}</div>}

            <button type="submit" disabled={saving} style={{ padding: '11px', borderRadius: 9, border: 'none', background: saving ? '#93c5fd' : '#2563eb', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: saving ? 'none' : '0 2px 8px rgba(37,99,235,0.3)' }}>
              {saving && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </form>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
