import { useState, useEffect } from 'react'
import { getSeekerProfile, createSeekerProfile, addSeekerSkills, getResumes, uploadResume, deleteResume, getCoverLetters, uploadCoverLetter, deleteCoverLetter } from '../api/profiles'
import { getSkills } from '../api/admin'
import { Upload, FileText, Trash2, Plus, Loader2, User, MapPin } from 'lucide-react'

interface Profile { id?: number; username?: string; email?: string; phoneNumber?: string; gender?: string; address?: string; skills?: { id: number; skillName: string }[] }
interface Doc { id: number; title: string; resumeUrl?: string; coverLetterUrl?: string }

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 13px', borderRadius: 9, border: '1px solid #d1d5db',
  background: '#fff', color: '#111827', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
}

export default function SeekerProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [tab, setTab] = useState<'profile' | 'resumes' | 'covers'>('profile')
  const [loading, setLoading] = useState(true)
  const [resumes, setResumes] = useState<Doc[]>([])
  const [covers, setCovers] = useState<Doc[]>([])
  const [allSkills, setAllSkills] = useState<{ id: number; skillName: string }[]>([])
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([])
  const [profileForm, setProfileForm] = useState({ phoneNumber: '', gender: 'MALE', address: '' })
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [profileSaving, setProfileSaving] = useState(false)
  const [docTitle, setDocTitle] = useState('')
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docSaving, setDocSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      getSeekerProfile().then(r => { setProfile(r.data); setSelectedSkillIds((r.data.skills || []).map((s: { id: number }) => s.id)) }),
      getResumes().then(r => setResumes(r.data.content)),
      getCoverLetters().then(r => setCovers(r.data.content)),
      getSkills(0, 100).then(r => setAllSkills(r.data.content)),
    ]).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault(); setProfileSaving(true)
    try {
      const fd = new FormData()
      fd.append('profile', new Blob([JSON.stringify(profileForm)], { type: 'application/json' }))
      if (profileFile) fd.append('file', profileFile)
      const res = await createSeekerProfile(fd); setProfile(res.data)
    } catch (e) { console.error(e) }
    finally { setProfileSaving(false) }
  }

  const handleAddSkills = async () => {
    try { const res = await addSeekerSkills(selectedSkillIds); setProfile(res.data) }
    catch (e) { console.error(e) }
  }

  const handleDocUpload = async (e: React.FormEvent) => {
    e.preventDefault(); if (!docFile || !docTitle.trim()) return
    setDocSaving(true)
    try {
      if (tab === 'resumes') { await uploadResume(docTitle.trim(), docFile); const r = await getResumes(); setResumes(r.data.content) }
      else { await uploadCoverLetter(docTitle.trim(), docFile); const r = await getCoverLetters(); setCovers(r.data.content) }
      setDocTitle(''); setDocFile(null)
    } catch (e) { console.error(e) }
    finally { setDocSaving(false) }
  }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={30} style={{ color: '#2563eb', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const TABS = [
    { key: 'profile' as const, label: 'Profile', icon: <User size={14} /> },
    { key: 'resumes' as const, label: `Resumes (${resumes.length})`, icon: <FileText size={14} /> },
    { key: 'covers' as const, label: `Cover Letters (${covers.length})`, icon: <FileText size={14} /> },
  ]

  return (
    <div style={{ padding: '28px 32px', maxWidth: 640, width: '100%' }}>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>My Profile</h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#f3f4f6', padding: 4, borderRadius: 11, width: 'fit-content' }}>
        {TABS.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 8,
            border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.82rem', transition: 'all 0.12s',
            ...(tab === key ? { background: '#fff', color: '#1d4ed8', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' } : { background: 'transparent', color: '#6b7280' }),
          }}>{icon}{label}</button>
        ))}
      </div>

      {tab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Profile card */}
          {profile?.email && (
            <div className="glass" style={{ padding: '18px 22px', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#eff6ff', border: '2px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <User size={20} style={{ color: '#2563eb' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>{profile.username || profile.email}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: 2 }}>{profile.email}</div>
                {profile.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#2563eb', marginTop: 3 }}>
                    <MapPin size={12} />
                    <span>{profile.address}</span>
                  </div>
                )}
              </div>
              {profile.gender && <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 99, background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', fontWeight: 700 }}>{profile.gender}</span>}
            </div>
          )}

          {/* Profile form */}
          <div className="glass" style={{ padding: '20px 24px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
              {profile?.phoneNumber ? 'Update Profile' : 'Create Profile'}
            </h3>
            <form onSubmit={handleCreateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Phone Number</label>
                <input value={profileForm.phoneNumber} onChange={e => setProfileForm(f => ({ ...f, phoneNumber: e.target.value }))} placeholder="+855 12 345 678" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Gender</label>
                <select value={profileForm.gender} onChange={e => setProfileForm(f => ({ ...f, gender: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                  {['MALE', 'FEMALE', 'RATHER_NOT_SAY'].map(g => <option key={g} value={g}>{g.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Address</label>
                <input value={profileForm.address} onChange={e => setProfileForm(f => ({ ...f, address: e.target.value }))} placeholder="Phnom Penh, Cambodia" style={inp} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Profile Picture</label>
                <input type="file" accept="image/*" onChange={e => setProfileFile(e.target.files?.[0] || null)} style={{ ...inp, padding: '7px 12px' }} />
              </div>
              <button type="submit" disabled={profileSaving} style={{ padding: '10px', borderRadius: 9, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, boxShadow: '0 2px 6px rgba(37,99,235,0.25)' }}>
                {profileSaving && <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />}
                Save Profile
              </button>
            </form>
          </div>

          {/* Skills */}
          <div className="glass" style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>Skills</h3>
              <button onClick={handleAddSkills} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                <Plus size={13} /> Save
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {allSkills.map(s => (
                <button key={s.id} type="button"
                  onClick={() => setSelectedSkillIds(ids => ids.includes(s.id) ? ids.filter(x => x !== s.id) : [...ids, s.id])}
                  style={{ padding: '5px 13px', borderRadius: 99, fontSize: '0.8rem', cursor: 'pointer', border: '1px solid', fontWeight: 500, transition: 'all 0.1s', ...(selectedSkillIds.includes(s.id) ? { background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' } : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }) }}>
                  {s.skillName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(tab === 'resumes' || tab === 'covers') && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Upload form */}
          <div className="glass" style={{ padding: '20px 24px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700, color: '#111827' }}>
              Upload {tab === 'resumes' ? 'Resume' : 'Cover Letter'}
            </h3>
            <form onSubmit={handleDocUpload} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input value={docTitle} onChange={e => setDocTitle(e.target.value)} placeholder="Document title…" required style={inp} />
              <input type="file" onChange={e => setDocFile(e.target.files?.[0] || null)} required style={{ ...inp, padding: '7px 12px' }} />
              <button type="submit" disabled={docSaving || !docTitle || !docFile}
                style={{ padding: '10px', borderRadius: 9, border: 'none', background: docSaving || !docTitle || !docFile ? '#93c5fd' : '#2563eb', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                {docSaving ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <Upload size={14} />}
                Upload
              </button>
            </form>
          </div>

          {/* Docs list */}
          <div className="glass" style={{ overflow: 'hidden' }}>
            {(tab === 'resumes' ? resumes : covers).length === 0 ? (
              <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af' }}>No {tab === 'resumes' ? 'resumes' : 'cover letters'} yet.</div>
            ) : (tab === 'resumes' ? resumes : covers).map((doc, idx, arr) => (
              <div key={doc.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', borderBottom: idx < arr.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileText size={16} style={{ color: '#2563eb' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{doc.title}</div>
                  <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontFamily: 'monospace' }}>ID: {doc.id}</div>
                </div>
                <button onClick={() => { if (tab === 'resumes') deleteResume(doc.id).then(() => setResumes(r => r.filter(d => d.id !== doc.id))); else deleteCoverLetter(doc.id).then(() => setCovers(r => r.filter(d => d.id !== doc.id))) }}
                  style={{ padding: '6px 9px', borderRadius: 7, border: '1px solid #fee2e2', background: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}>
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
