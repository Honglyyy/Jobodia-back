import { useState, useEffect, useCallback } from 'react'
import { getJobs, searchJobs, createJob, updateJob, deleteJob } from '../api/jobs'
import { getCategories, getIndustries, getSkills } from '../api/admin'
import { useAuth } from '../context/AuthContext'
import { Search, Plus, X, ChevronLeft, ChevronRight, MapPin, Clock, BarChart2, Loader2, Pencil, Trash2, DollarSign, Building2, Factory, Tags } from 'lucide-react'

const JOB_TIME_OPTS = ['FULL_TIME', 'PART_TIME']
const JOB_LEVEL_OPTS = ['SENIOR', 'MID', 'JUNIOR', 'INTERNSHIP']
const JOB_SITE_OPTS = ['REMOTE', 'ON_SITE']
const JOB_GENDER_OPTS = ['MALE', 'FEMALE', 'MALE_FEMALE']

interface Job {
  id: number; title: string; minSalary?: number; maxSalary?: number
  description?: string; summary?: string; jobType?: string; jobLevel?: string
  jobGender?: string; jobSite?: string; yearsOfExperience?: number
  availablePosition?: number; expiresAt?: string; createdAt?: string
  employer?: { companyName?: string; location?: string }
  responsibilities?: string[]; requirements?: string[]; benefits?: string[]
  languages?: string[]; qualifications?: string[]
  categoriesId?: number[]; skillsId?: number[]; industriesId?: number
}

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  SENIOR:     { bg: '#fdf4ff', text: '#7e22ce' },
  MID:        { bg: '#eff6ff', text: '#1d4ed8' },
  JUNIOR:     { bg: '#f0fdf4', text: '#15803d' },
  INTERNSHIP: { bg: '#fff7ed', text: '#c2410c' },
}
const SITE_COLORS: Record<string, { bg: string; text: string }> = {
  REMOTE:  { bg: '#ecfdf5', text: '#065f46' },
  ON_SITE: { bg: '#f0f9ff', text: '#0369a1' },
  HYBRID:  { bg: '#fefce8', text: '#854d0e' },
}

function Chip({ label, bg, text }: { label: string; bg: string; text: string }) {
  return (
    <span style={{ padding: '2px 9px', borderRadius: 99, fontSize: '0.7rem', fontWeight: 600, background: bg, color: text, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label.replace(/_/g, ' ')}
    </span>
  )
}

function JobCard({ job, onView, canEdit, onEdit, onDelete }: {
  job: Job; onView: () => void; canEdit?: boolean; onEdit?: () => void; onDelete?: () => void
}) {
  const level = LEVEL_COLORS[job.jobLevel || ''] || { bg: '#f3f4f6', text: '#374151' }
  const site = SITE_COLORS[job.jobSite || ''] || { bg: '#f3f4f6', text: '#374151' }
  return (
    <div style={{
      background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
      padding: '18px 20px', cursor: 'pointer', transition: 'all 0.15s ease',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }}
      onClick={onView}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = '#bfdbfe' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'; (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827', marginBottom: 2, lineHeight: 1.3 }}>{job.title}</div>
          <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 500 }}>{job.employer?.companyName || '—'}</div>
        </div>
        {canEdit && (
          <div style={{ display: 'flex', gap: 5, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
            <button onClick={onEdit} style={{ padding: '5px', borderRadius: 7, border: '1px solid #e0e7ff', background: '#eff6ff', color: '#3730a3', cursor: 'pointer' }}><Pencil size={13} /></button>
            <button onClick={onDelete} style={{ padding: '5px', borderRadius: 7, border: '1px solid #fee2e2', background: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}><Trash2 size={13} /></button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
        {job.jobLevel && <Chip label={job.jobLevel} {...level} />}
        {job.jobSite && <Chip label={job.jobSite} {...site} />}
        {job.jobType === 'FULL_TIME' && <Chip label="Full Time" bg="#f0fdf4" text="#15803d" />}
        {job.jobType === 'PART_TIME' && <Chip label="Part Time" bg="#fff7ed" text="#c2410c" />}
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {job.employer?.location && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#6b7280' }}>
            <MapPin size={12} />{job.employer.location}
          </span>
        )}
        {job.minSalary && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
            <DollarSign size={12} />${job.minSalary.toLocaleString()}–${job.maxSalary?.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  )
}

const emptyJobForm = () => ({
  title: '', minSalary: '', maxSalary: '', description: '', summary: '',
  jobType: 'FULL_TIME', jobLevel: 'MID', jobGender: 'MALE_FEMALE', jobSite: 'ON_SITE',
  yearsOfExperience: '', availablePosition: '', expiresAt: '',
  responsibilities: '', requirements: '', benefits: '', languages: '', qualifications: '',
  categoriesId: [] as number[], skillsId: [] as number[], industriesId: '',
})

const inp: React.CSSProperties = {
  width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid #d1d5db',
  background: '#fff', color: '#111827', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
}

export default function JobsPage() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState<Job[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState({ title: '', industry: '', company: '', category: '', jobTime: '', jobLevel: '', jobSite: '' })
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [formData, setFormData] = useState(emptyJobForm())
  const [formLoading, setFormLoading] = useState(false)
  const [categories, setCategories] = useState<{ id: number; categoryName: string }[]>([])
  const [industries, setIndustries] = useState<{ id: number; industryName: string }[]>([])
  const [skills, setSkills] = useState<{ id: number; skillName: string }[]>([])
  const size = 9

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const hasSearch = Object.values(search).some(Boolean)
      const params = Object.fromEntries(Object.entries(search).filter(([, v]) => v))
      const res = hasSearch ? await searchJobs(params, page, size) : await getJobs(page, size)
      setJobs(res.data.content); setTotal(res.data.totalElements)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { fetchJobs() }, [fetchJobs])
  useEffect(() => {
    getCategories().then(r => setCategories(r.data.content))
    getIndustries().then(r => setIndustries(r.data.content))
    getSkills().then(r => setSkills(r.data.content))
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this job?')) return
    await deleteJob(id); fetchJobs()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setFormLoading(true)
    const payload = {
      ...formData,
      minSalary: Number(formData.minSalary), maxSalary: Number(formData.maxSalary),
      yearsOfExperience: Number(formData.yearsOfExperience),
      availablePosition: Number(formData.availablePosition),
      industriesId: Number(formData.industriesId),
      responsibilities: formData.responsibilities.split('\n').filter(Boolean),
      requirements: formData.requirements.split('\n').filter(Boolean),
      benefits: formData.benefits.split('\n').filter(Boolean),
      languages: formData.languages.split(',').map(s => s.trim()).filter(Boolean),
      qualifications: formData.qualifications.split(',').map(s => s.trim()).filter(Boolean),
    }
    try {
      if (editId) await updateJob(editId, payload)
      else await createJob(payload)
      setShowForm(false); setEditId(null); setFormData(emptyJobForm()); fetchJobs()
    } catch (e) { console.error(e) }
    finally { setFormLoading(false) }
  }

  const totalPages = Math.ceil(total / size)

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Jobs</h2>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '3px 0 0' }}>{total} positions available</p>
        </div>
        {user?.role === 'EMPLOYER' && (
          <button onClick={() => { setShowForm(true); setEditId(null); setFormData(emptyJobForm()) }} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 9, border: 'none',
            background: '#2563eb', color: '#fff', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
          }}>
            <Plus size={15} /> Post Job
          </button>
        )}
      </div>

      {/* Search bar */}
      <div className="glass" style={{ padding: '16px 20px', marginBottom: 20, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {[
          { key: 'title', placeholder: 'Job title…', icon: <Search size={15} style={{ color: '#9ca3af' }} /> },
          { key: 'company', placeholder: 'Company…', icon: <Building2 size={15} style={{ color: '#9ca3af' }} /> },
          { key: 'industry', placeholder: 'Industry…', icon: <Factory size={15} style={{ color: '#9ca3af' }} /> },
          { key: 'category', placeholder: 'Category…', icon: <Tags size={15} style={{ color: '#9ca3af' }} /> },
        ].map(({ key, placeholder, icon }) => (
          <div key={key} style={{ position: 'relative', flex: '1 1 160px', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 12, display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              {icon}
            </div>
            <input placeholder={placeholder}
              value={search[key as keyof typeof search]}
              onChange={e => { setSearch(s => ({ ...s, [key]: e.target.value })); setPage(0) }}
              style={{ ...inp, width: '100%', paddingLeft: 34 }} />
          </div>
        ))}
        {[
          { key: 'jobTime', opts: JOB_TIME_OPTS, placeholder: 'Type' },
          { key: 'jobLevel', opts: JOB_LEVEL_OPTS, placeholder: 'Level' },
          { key: 'jobSite', opts: JOB_SITE_OPTS, placeholder: 'Site' },
        ].map(({ key, opts, placeholder }) => (
          <select key={key} value={search[key as keyof typeof search]}
            onChange={e => { setSearch(s => ({ ...s, [key]: e.target.value })); setPage(0) }}
            style={{ ...inp, flex: '1 1 110px', cursor: 'pointer' }}>
            <option value="">{placeholder}</option>
            {opts.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
          </select>
        ))}
        {Object.values(search).some(Boolean) && (
          <button onClick={() => { setSearch({ title: '', industry: '', company: '', category: '', jobTime: '', jobLevel: '', jobSite: '' }); setPage(0) }}
            style={{ padding: '9px 13px', borderRadius: 8, border: '1px solid #fecaca', background: '#fef2f2', color: '#b91c1c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.85rem', fontWeight: 500 }}>
            <X size={14} /> Clear
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <Loader2 size={30} style={{ color: '#2563eb', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
          {jobs.map(job => (
            <JobCard key={job.id} job={job}
              onView={() => setSelectedJob(job)}
              canEdit={user?.role === 'EMPLOYER'}
              onEdit={() => { setEditId(job.id); setFormData({ ...emptyJobForm(), title: job.title, description: job.description || '', summary: job.summary || '', jobType: job.jobType || 'FULL_TIME', jobLevel: job.jobLevel || 'MID', jobGender: job.jobGender || 'MALE_FEMALE', jobSite: job.jobSite || 'ON_SITE', minSalary: String(job.minSalary || ''), maxSalary: String(job.maxSalary || ''), yearsOfExperience: String(job.yearsOfExperience || ''), availablePosition: String(job.availablePosition || ''), industriesId: String(job.industriesId || ''), responsibilities: (job.responsibilities || []).join('\n'), requirements: (job.requirements || []).join('\n'), benefits: (job.benefits || []).join('\n'), languages: (job.languages || []).join(', '), qualifications: (job.qualifications || []).join(', '), categoriesId: job.categoriesId || [], skillsId: job.skillsId || [] }); setShowForm(true) }}
              onDelete={() => handleDelete(job.id)}
            />
          ))}
          {jobs.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 64, color: '#9ca3af' }}>
              <Search size={40} style={{ marginBottom: 12, opacity: 0.4 }} /><br />No jobs found
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 28 }}>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: page === 0 ? '#d1d5db' : '#374151', cursor: page === 0 ? 'not-allowed' : 'pointer' }}><ChevronLeft size={16} /></button>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: page >= totalPages - 1 ? '#d1d5db' : '#374151', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}><ChevronRight size={16} /></button>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="modal-backdrop" onClick={() => setSelectedJob(null)}>
          <div className="glass fade-up" style={{ maxWidth: 620, width: '100%', maxHeight: '85vh', overflow: 'auto', padding: '28px 32px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#111827' }}>{selectedJob.title}</h2>
                <div style={{ fontSize: '0.875rem', color: '#2563eb', marginTop: 3, fontWeight: 500 }}>{selectedJob.employer?.companyName}</div>
              </div>
              <button onClick={() => setSelectedJob(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: 4 }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
              {selectedJob.jobLevel && <Chip label={selectedJob.jobLevel} {...(LEVEL_COLORS[selectedJob.jobLevel] || { bg: '#f3f4f6', text: '#374151' })} />}
              {selectedJob.jobSite && <Chip label={selectedJob.jobSite} {...(SITE_COLORS[selectedJob.jobSite] || { bg: '#f3f4f6', text: '#374151' })} />}
              {selectedJob.jobType && <Chip label={selectedJob.jobType} bg="#f0fdf4" text="#15803d" />}
              {selectedJob.jobGender && <Chip label={selectedJob.jobGender} bg="#f5f3ff" text="#6d28d9" />}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { icon: <DollarSign size={14} />, label: 'Salary', val: selectedJob.minSalary ? `$${selectedJob.minSalary.toLocaleString()} – $${selectedJob.maxSalary?.toLocaleString()}` : '—' },
                { icon: <MapPin size={14} />, label: 'Location', val: selectedJob.employer?.location || '—' },
                { icon: <Clock size={14} />, label: 'Experience', val: selectedJob.yearsOfExperience ? `${selectedJob.yearsOfExperience} yrs` : '—' },
                { icon: <BarChart2 size={14} />, label: 'Positions', val: selectedJob.availablePosition ?? '—' },
              ].map(({ icon, label, val }) => (
                <div key={label} style={{ padding: '12px 14px', borderRadius: 9, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#6b7280', fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{icon}{label}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#111827' }}>{String(val)}</div>
                </div>
              ))}
            </div>

            {selectedJob.summary && <div style={{ marginBottom: 16 }}><div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Summary</div><p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.65 }}>{selectedJob.summary}</p></div>}
            {selectedJob.description && <div style={{ marginBottom: 16 }}><div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Description</div><p style={{ margin: 0, fontSize: '0.875rem', color: '#374151', lineHeight: 1.65 }}>{selectedJob.description}</p></div>}
            {[{ label: 'Responsibilities', items: selectedJob.responsibilities }, { label: 'Requirements', items: selectedJob.requirements }, { label: 'Benefits', items: selectedJob.benefits }].map(({ label, items }) => items?.length ? (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>{items.map((it, i) => <li key={i} style={{ fontSize: '0.875rem', color: '#374151', marginBottom: 4, lineHeight: 1.5 }}>{it}</li>)}</ul>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      {/* Create/Edit Form Modal */}
      {showForm && user?.role === 'EMPLOYER' && (
        <div className="modal-backdrop">
          <div className="glass fade-up" style={{ maxWidth: 680, width: '100%', maxHeight: '90vh', overflow: 'auto', padding: '28px 32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#111827' }}>{editId ? 'Edit Job' : 'Post New Job'}</h2>
              <button onClick={() => { setShowForm(false); setEditId(null) }} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Job Title *</label>
                  <input required value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} placeholder="Senior React Developer" style={inp} />
                </div>
                {[{ key: 'minSalary', label: 'Min Salary' }, { key: 'maxSalary', label: 'Max Salary' }, { key: 'yearsOfExperience', label: 'Years Exp.' }, { key: 'availablePosition', label: 'Positions' }].map(({ key, label }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
                    <input type="number" value={formData[key as keyof typeof formData] as string} onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))} placeholder="0" style={inp} />
                  </div>
                ))}
                {[{ key: 'jobType', label: 'Type', opts: JOB_TIME_OPTS }, { key: 'jobLevel', label: 'Level', opts: JOB_LEVEL_OPTS }, { key: 'jobSite', label: 'Site', opts: JOB_SITE_OPTS }, { key: 'jobGender', label: 'Gender', opts: JOB_GENDER_OPTS }].map(({ key, label, opts }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
                    <select value={formData[key as keyof typeof formData] as string} onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                      {opts.map(o => <option key={o} value={o}>{o.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Industry</label>
                  <select value={formData.industriesId} onChange={e => setFormData(f => ({ ...f, industriesId: e.target.value }))} style={{ ...inp, cursor: 'pointer' }}>
                    <option value="">Select…</option>
                    {industries.map(i => <option key={i.id} value={i.id}>{i.industryName}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>Expires At</label>
                  <input type="date" value={formData.expiresAt} onChange={e => setFormData(f => ({ ...f, expiresAt: e.target.value }))} style={inp} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Categories</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {categories.map(c => (
                    <button key={c.id} type="button"
                      onClick={() => setFormData(f => ({ ...f, categoriesId: f.categoriesId.includes(c.id) ? f.categoriesId.filter(x => x !== c.id) : [...f.categoriesId, c.id] }))}
                      style={{ padding: '4px 12px', borderRadius: 99, fontSize: '0.78rem', cursor: 'pointer', border: '1px solid', fontWeight: 500, transition: 'all 0.1s', ...(formData.categoriesId.includes(c.id) ? { background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' } : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }) }}>
                      {c.categoryName}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {skills.map(s => (
                    <button key={s.id} type="button"
                      onClick={() => setFormData(f => ({ ...f, skillsId: f.skillsId.includes(s.id) ? f.skillsId.filter(x => x !== s.id) : [...f.skillsId, s.id] }))}
                      style={{ padding: '4px 12px', borderRadius: 99, fontSize: '0.78rem', cursor: 'pointer', border: '1px solid', fontWeight: 500, transition: 'all 0.1s', ...(formData.skillsId.includes(s.id) ? { background: '#f0fdf4', color: '#15803d', borderColor: '#bbf7d0' } : { background: '#fff', color: '#6b7280', borderColor: '#e5e7eb' }) }}>
                      {s.skillName}
                    </button>
                  ))}
                </div>
              </div>

              {[{ key: 'summary', label: 'Summary', rows: 2, ph: 'Brief summary…' }, { key: 'description', label: 'Description', rows: 3, ph: 'Full description…' }, { key: 'responsibilities', label: 'Responsibilities (one per line)', rows: 3, ph: 'Lead frontend development\nReview PRs' }, { key: 'requirements', label: 'Requirements (one per line)', rows: 3, ph: '3+ years React\nTypeScript' }, { key: 'benefits', label: 'Benefits (one per line)', rows: 2, ph: 'Health insurance\nRemote work' }, { key: 'languages', label: 'Languages (comma-separated)', rows: 1, ph: 'English, Khmer' }, { key: 'qualifications', label: 'Qualifications (comma-separated)', rows: 1, ph: "Bachelor's" }].map(({ key, label, rows, ph }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
                  <textarea rows={rows} value={formData[key as keyof typeof formData] as string} onChange={e => setFormData(f => ({ ...f, [key]: e.target.value }))} placeholder={ph} style={{ ...inp, resize: 'vertical', lineHeight: 1.55 }} />
                </div>
              ))}

              <button type="submit" disabled={formLoading} style={{ padding: '11px', borderRadius: 9, border: 'none', background: formLoading ? '#93c5fd' : '#2563eb', color: '#fff', fontWeight: 600, fontSize: '0.9rem', cursor: formLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                {formLoading && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                {editId ? 'Update Job' : 'Post Job'}
              </button>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
