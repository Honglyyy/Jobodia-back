import { useState, useEffect, useCallback } from 'react'
import { getApplications, getApplicants, updateApplicationStatus, deleteApplication } from '../api/applications'
import { useAuth } from '../context/AuthContext'
import { ChevronLeft, ChevronRight, Loader2, Trash2, Eye, X } from 'lucide-react'

const STATUS_OPTS = ['APPLIED', 'REVIEWING', 'INTERVIEWED', 'REJECTED', 'HIRED']
const STATUS_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  APPLIED:     { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' },
  REVIEWING:   { bg: '#fffbeb', text: '#b45309', border: '#fde68a' },
  INTERVIEWED: { bg: '#ecfdf5', text: '#065f46', border: '#a7f3d0' },
  REJECTED:    { bg: '#fef2f2', text: '#b91c1c', border: '#fecaca' },
  HIRED:       { bg: '#f0fdf4', text: '#15803d', border: '#bbf7d0' },
}

interface Application {
  id: number; status: string; appliedAt?: string; updatedAt?: string
  jobId?: number; seekerId?: number; resumeId?: number; coverLetterId?: number
  job?: { id: number; title: string; employer?: { companyName?: string } }
  seeker?: { id: number; username?: string; email?: string }
}

export default function ApplicationsPage() {
  const { user } = useAuth()
  const [apps, setApps] = useState<Application[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Application | null>(null)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const size = 10

  const fetchApps = useCallback(async () => {
    setLoading(true)
    try {
      const res = user?.role === 'EMPLOYER' ? await getApplicants(page, size) : await getApplications(page, size)
      setApps(res.data.content); setTotal(res.data.totalElements)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [page, user])

  useEffect(() => { fetchApps() }, [fetchApps])

  const handleStatusChange = async (id: number, status: string) => {
    setUpdatingId(id)
    try {
      await updateApplicationStatus(id, status); fetchApps()
      if (selected?.id === id) setSelected(s => s ? { ...s, status } : null)
    } catch (e) { console.error(e) }
    finally { setUpdatingId(null) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Withdraw this application?')) return
    await deleteApplication(id); fetchApps()
  }

  const totalPages = Math.ceil(total / size)

  return (
    <div style={{ padding: '28px 32px', maxWidth: 960, width: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>
          {user?.role === 'EMPLOYER' ? 'Applicants' : 'My Applications'}
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '3px 0 0' }}>{total} total</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
          <Loader2 size={30} style={{ color: '#2563eb', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div className="glass fade-up" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{user?.role === 'EMPLOYER' ? 'Applicant' : 'Job'}</th>
                {user?.role === 'EMPLOYER' && <th>Job Title</th>}
                <th>Status</th>
                <th>Applied</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {apps.map(app => {
                const ss = STATUS_STYLE[app.status] || STATUS_STYLE.APPLIED
                return (
                  <tr key={app.id}>
                    <td style={{ color: '#9ca3af', fontFamily: 'monospace', fontSize: '0.8rem' }}>#{app.id}</td>
                    <td style={{ fontWeight: 500, color: '#111827' }}>
                      {user?.role === 'EMPLOYER' ? (app.seeker?.email || `Seeker #${app.seekerId}`) : (app.job?.title || `Job #${app.jobId}`)}
                    </td>
                    {user?.role === 'EMPLOYER' && (
                      <td style={{ color: '#2563eb', fontSize: '0.82rem' }}>{app.job?.employer?.companyName || '—'}</td>
                    )}
                    <td>
                      {user?.role === 'EMPLOYER' ? (
                        <select value={app.status} onChange={e => handleStatusChange(app.id, e.target.value)}
                          disabled={updatingId === app.id}
                          style={{ padding: '4px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, border: `1px solid ${ss.border}`, background: ss.bg, color: ss.text, cursor: 'pointer', outline: 'none', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {STATUS_OPTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span style={{ padding: '3px 10px', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', background: ss.bg, color: ss.text, border: `1px solid ${ss.border}` }}>
                          {app.status}
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button onClick={() => setSelected(app)} style={{ padding: '5px 8px', borderRadius: 7, border: '1px solid #e0e7ff', background: '#eff6ff', color: '#3730a3', cursor: 'pointer' }}><Eye size={13} /></button>
                        {user?.role === 'SEEKER' && (
                          <button onClick={() => handleDelete(app.id)} style={{ padding: '5px 8px', borderRadius: 7, border: '1px solid #fee2e2', background: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}><Trash2 size={13} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
              {apps.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 48, color: '#9ca3af' }}>No applications found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 }}>
          <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: page === 0 ? '#d1d5db' : '#374151', cursor: page === 0 ? 'not-allowed' : 'pointer' }}><ChevronLeft size={16} /></button>
          <span style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 500 }}>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={{ padding: '7px 12px', borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff', color: page >= totalPages - 1 ? '#d1d5db' : '#374151', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer' }}><ChevronRight size={16} /></button>
        </div>
      )}

      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="glass fade-up" style={{ maxWidth: 420, width: '100%', padding: '28px 32px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>Application #{selected.id}</h3>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'Status', val: selected.status },
                { label: 'Job ID', val: selected.jobId },
                { label: 'Seeker ID', val: selected.seekerId },
                { label: 'Resume ID', val: selected.resumeId },
                { label: 'Cover Letter ID', val: selected.coverLetterId },
                { label: 'Applied At', val: selected.appliedAt ? new Date(selected.appliedAt).toLocaleString() : '—' },
                { label: 'Updated At', val: selected.updatedAt ? new Date(selected.updatedAt).toLocaleString() : '—' },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 13px', borderRadius: 8, background: '#f9fafb', border: '1px solid #f3f4f6' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>{label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#111827' }}>{String(val ?? '—')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
