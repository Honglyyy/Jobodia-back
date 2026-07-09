import { useState, useEffect } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory, getIndustries, createIndustry, updateIndustry, deleteIndustry, getSkills, createSkill, deleteSkill } from '../api/admin'
import { Plus, Pencil, Trash2, Loader2, X, Check, Tags, Factory, Wrench } from 'lucide-react'

type Tab = 'categories' | 'industries' | 'skills'
interface Item { id: number; categoryName?: string; industryName?: string; skillName?: string }

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('categories')
  const [data, setData] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editVal, setEditVal] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fieldKey = tab === 'categories' ? 'categoryName' : tab === 'industries' ? 'industryName' : 'skillName'

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = tab === 'categories' ? await getCategories(0, 100) : tab === 'industries' ? await getIndustries(0, 100) : await getSkills(0, 100)
      setData(res.data.content)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchData() }, [tab])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); if (!inputVal.trim()) return
    setSubmitting(true)
    try {
      if (tab === 'categories') await createCategory(inputVal.trim())
      else if (tab === 'industries') await createIndustry(inputVal.trim())
      else await createSkill(inputVal.trim())
      setInputVal(''); fetchData()
    } catch (e) { console.error(e) }
    finally { setSubmitting(false) }
  }

  const handleEdit = async (id: number) => {
    if (!editVal.trim()) return
    setSubmitting(true)
    try {
      if (tab === 'categories') await updateCategory(id, editVal.trim())
      else if (tab === 'industries') await updateIndustry(id, editVal.trim())
      setEditId(null); setEditVal(''); fetchData()
    } catch (e) { console.error(e) }
    finally { setSubmitting(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this item?')) return
    try {
      if (tab === 'categories') await deleteCategory(id)
      else if (tab === 'industries') await deleteIndustry(id)
      else await deleteSkill(id)
      fetchData()
    } catch (e) { console.error(e) }
  }

  const TABS: { key: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'categories', label: 'Categories', icon: <Tags size={14} /> },
    { key: 'industries', label: 'Industries', icon: <Factory size={14} /> },
    { key: 'skills', label: 'Skills', icon: <Wrench size={14} /> },
  ]

  const inp: React.CSSProperties = {
    padding: '9px 13px', borderRadius: 9, border: '1px solid #d1d5db',
    background: '#fff', color: '#111827', fontSize: '0.875rem', outline: 'none',
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 640, width: '100%' }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#111827', letterSpacing: '-0.02em' }}>Admin Panel</h2>
        <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '3px 0 0' }}>Manage reference data</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#f3f4f6', padding: 4, borderRadius: 11, width: 'fit-content' }}>
        {TABS.map(({ key, label, icon }) => (
          <button key={key} onClick={() => setTab(key)} style={{
            display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 8,
            border: 'none', cursor: 'pointer', fontWeight: 500, fontSize: '0.85rem', transition: 'all 0.12s',
            ...(tab === key ? { background: '#fff', color: '#1d4ed8', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' } : { background: 'transparent', color: '#6b7280' }),
          }}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Create */}
      <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <input value={inputVal} onChange={e => setInputVal(e.target.value)}
          placeholder={`Add new ${tab.slice(0, -1)}…`}
          style={{ ...inp, flex: 1 }} />
        <button type="submit" disabled={submitting || !inputVal.trim()} style={{
          padding: '9px 18px', borderRadius: 9, border: 'none', cursor: !inputVal.trim() ? 'not-allowed' : 'pointer',
          background: !inputVal.trim() ? '#e5e7eb' : '#2563eb', color: !inputVal.trim() ? '#9ca3af' : '#fff',
          fontWeight: 600, fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: !inputVal.trim() ? 'none' : '0 2px 6px rgba(37,99,235,0.25)',
        }}>
          {submitting ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Plus size={15} />} Add
        </button>
      </form>

      {/* List */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Loader2 size={28} style={{ color: '#2563eb', animation: 'spin 1s linear infinite' }} />
        </div>
      ) : (
        <div className="glass fade-up" style={{ overflow: 'hidden' }}>
          {data.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: '#9ca3af', fontSize: '0.875rem' }}>
              No {tab} yet — add one above!
            </div>
          ) : (
            data.map((item, idx) => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
                borderBottom: idx < data.length - 1 ? '1px solid #f3f4f6' : 'none',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#f9fafb'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#d1d5db', width: 30, flexShrink: 0 }}>#{item.id}</span>
                {editId === item.id ? (
                  <input autoFocus value={editVal} onChange={e => setEditVal(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleEdit(item.id); if (e.key === 'Escape') { setEditId(null); setEditVal('') } }}
                    style={{ ...inp, flex: 1, borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.1)' }} />
                ) : (
                  <span style={{ flex: 1, fontSize: '0.9rem', color: '#111827', fontWeight: 500 }}>
                    {item[fieldKey as keyof Item] as string}
                  </span>
                )}
                <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
                  {tab !== 'skills' && (
                    editId === item.id ? (
                      <>
                        <button onClick={() => handleEdit(item.id)} style={{ padding: '5px 8px', borderRadius: 7, border: '1px solid #bbf7d0', background: '#f0fdf4', color: '#15803d', cursor: 'pointer' }}><Check size={13} /></button>
                        <button onClick={() => { setEditId(null); setEditVal('') }} style={{ padding: '5px 8px', borderRadius: 7, border: '1px solid #e5e7eb', background: '#f9fafb', color: '#6b7280', cursor: 'pointer' }}><X size={13} /></button>
                      </>
                    ) : (
                      <button onClick={() => { setEditId(item.id); setEditVal(item[fieldKey as keyof Item] as string) }}
                        style={{ padding: '5px 8px', borderRadius: 7, border: '1px solid #e0e7ff', background: '#eff6ff', color: '#3730a3', cursor: 'pointer' }}>
                        <Pencil size={13} />
                      </button>
                    )
                  )}
                  <button onClick={() => handleDelete(item.id)} style={{ padding: '5px 8px', borderRadius: 7, border: '1px solid #fee2e2', background: '#fef2f2', color: '#b91c1c', cursor: 'pointer' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
