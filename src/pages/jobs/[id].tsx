import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'

export default function JobDetail() {
  const router = useRouter()
  const { id } = router.query
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true
    api.get(`/jobs/${id}`).then(r => { if (mounted) setJob(r.data) }).catch(err => { if (mounted) setError(err?.response?.data?.message || err.message) }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  useEffect(() => {
    // open edit mode if URL has ?edit=true
    if (!router.isReady) return
    if (router.query.edit === 'true') {
      setEditing(true)
      setEditForm({
        title: job?.title ?? '',
        description: job?.description ?? '',
        location: job?.location ?? '',
        employmentType: job?.employmentType ?? '',
        remoteType: job?.remoteType ?? '',
        salaryMin: job?.salaryMin ?? '',
        salaryMax: job?.salaryMax ?? '',
        salaryCurrency: job?.salaryCurrency ?? '',
        responsibilities: job?.responsibilities ?? '',
        requirements: job?.requirements ?? '',
        benefits: job?.benefits ?? '',
        applicationUrl: job?.applicationUrl ?? '',
        closingDate: job?.closingDate ? new Date(job.closingDate).toISOString().slice(0,10) : ''
      })
    }
  }, [router.isReady, router.query.edit, job])

  async function handleDelete() {
    if (!id || typeof id !== 'string') return
    try {
      await api.delete(`/jobs/${id}`)
      router.push('/jobs')
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    }
  }

  async function saveUpdate() {
    if (!id || typeof id !== 'string') return
    try {
      await api.put(`/jobs/${id}`, editForm)
      // refresh
      const r = await api.get(`/jobs/${id}`)
      setJob(r.data)
      setEditing(false)
      // remove edit query param
      router.replace(`/jobs/${id}`)
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    }
  }

  return (
    <Layout>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {job && (
        <div>
          {editing ? (
            <div>
              <h3 className="text-lg font-medium">Edit Job</h3>
              <div className="grid gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium">Title</label>
                  <input className="mt-1 block w-full border rounded p-2" value={editForm?.title ?? ''} onChange={e=>setEditForm({...editForm, title: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Description</label>
                  <textarea className="mt-1 block w-full border rounded p-2" rows={4} value={editForm?.description ?? ''} onChange={e=>setEditForm({...editForm, description: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Location</label>
                  <input className="mt-1 block w-full border rounded p-2" value={editForm?.location ?? ''} onChange={e=>setEditForm({...editForm, location: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Employment Type</label>
                  <input className="mt-1 block w-full border rounded p-2" value={editForm?.employmentType ?? ''} onChange={e=>setEditForm({...editForm, employmentType: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Remote Type</label>
                  <input className="mt-1 block w-full border rounded p-2" value={editForm?.remoteType ?? ''} onChange={e=>setEditForm({...editForm, remoteType: e.target.value})} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium">Salary Min</label>
                    <input type="number" className="mt-1 block w-full border rounded p-2" value={editForm?.salaryMin ?? ''} onChange={e=>setEditForm({...editForm, salaryMin: e.target.value === '' ? '' : Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Salary Max</label>
                    <input type="number" className="mt-1 block w-full border rounded p-2" value={editForm?.salaryMax ?? ''} onChange={e=>setEditForm({...editForm, salaryMax: e.target.value === '' ? '' : Number(e.target.value)})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Currency</label>
                    <input className="mt-1 block w-full border rounded p-2" value={editForm?.salaryCurrency ?? ''} onChange={e=>setEditForm({...editForm, salaryCurrency: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">Responsibilities</label>
                  <textarea className="mt-1 block w-full border rounded p-2" rows={3} value={editForm?.responsibilities ?? ''} onChange={e=>setEditForm({...editForm, responsibilities: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Requirements</label>
                  <textarea className="mt-1 block w-full border rounded p-2" rows={3} value={editForm?.requirements ?? ''} onChange={e=>setEditForm({...editForm, requirements: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Benefits</label>
                  <textarea className="mt-1 block w-full border rounded p-2" rows={3} value={editForm?.benefits ?? ''} onChange={e=>setEditForm({...editForm, benefits: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Application URL</label>
                  <input className="mt-1 block w-full border rounded p-2" value={editForm?.applicationUrl ?? ''} onChange={e=>setEditForm({...editForm, applicationUrl: e.target.value})} />
                </div>

                <div>
                  <label className="block text-sm font-medium">Closing Date</label>
                  <input type="date" className="mt-1 block w-full border rounded p-2" value={editForm?.closingDate ?? ''} onChange={e=>setEditForm({...editForm, closingDate: e.target.value})} />
                </div>

                <div className="flex gap-2 mt-2">
                  <button className="btn btn-primary" onClick={saveUpdate}>Save</button>
                  <button className="btn" onClick={()=>{ setEditing(false); setEditForm(null); }}>Cancel</button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold">{job.title}</h2>
              <div className="text-sm text-gray-600">Company: {job.company?.name}</div>
              <p className="mt-4">{job.description}</p>
              <div className="mt-4 flex items-center gap-3">
                <button onClick={handleDelete} className="btn btn-sm btn-danger">Delete</button>
                <button className="btn btn-primary" onClick={() => { setEditing(true); setEditForm({
                  title: job?.title ?? '',
                  description: job?.description ?? '',
                  location: job?.location ?? '',
                  employmentType: job?.employmentType ?? '',
                  remoteType: job?.remoteType ?? '',
                  salaryMin: job?.salaryMin ?? '',
                  salaryMax: job?.salaryMax ?? '',
                  salaryCurrency: job?.salaryCurrency ?? '',
                  responsibilities: job?.responsibilities ?? '',
                  requirements: job?.requirements ?? '',
                  benefits: job?.benefits ?? '',
                  applicationUrl: job?.applicationUrl ?? '',
                  closingDate: job?.closingDate ? new Date(job.closingDate).toISOString().slice(0,10) : ''
                }) }}>Edit</button>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  )
}
