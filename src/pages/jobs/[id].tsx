import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'
import { title } from 'node:process'

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
    api.get(`/jobs/${id}`)
      .then(r => { if (mounted) setJob(r.data) })
      .catch(err => { if (mounted) setError(err?.response?.data?.message || err.message) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  useEffect(() => {
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
      const r = await api.get(`/jobs/${id}`)
      setJob(r.data)
      setEditing(false)
      router.replace(`/jobs/${id}`)
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    }
  }

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {job && (
        <div>
          {editing ? ( 
            <div>
              <h3 className="text-lg font-medium">Edit Job</h3>
              <div className="grid gap-3 mt-3">

                {/* EDIT CONTENT UNCHANGED */}

                {/* ... your entire edit form remains exactly the same ... */}

              </div>
            </div>
          ) : (

            /* ================= FIXED VIEW MODE ================= */

            <div className="grid grid-cols-1 md:grid-cols-2 gap-25">

              {/* LEFT COPY */}
              <div className="flex flex-col gap-6">

                <div>
                  <div key={job.id} className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-slate-50">
                    <div className="mb-2 text-sm text-gray-500">{job.company?.name}</div>

                    <h3 className="text-lg font-semibold mb-2">{job.title}</h3>

                    {job.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs ">
                      {job.employmentType && (
                        <span className="bg-gray-100 px-2 py-1 rounded-lg bg-red-300">{job.employmentType}</span>
                      )}
                      {job.remoteType && (
                        <span className="bg-gray-100 px-2 py-1 rounded-lg bg-neutral-300">{job.remoteType}</span>
                      )}
                      {job.location && (
                        <span className="bg-gray-100 px-2 py-1 rounded-lg bg-slate-300">{job.location}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  {/* All original fields unchanged */}

                  <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea className="mt-1 block w-full border rounded p-2" rows={4} value={job.description ?? ''} readOnly />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium">Salary Min</label>
                      <input type="number" className="mt-1 block w-full border rounded p-2" value={job.salaryMin ?? ''} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Salary Max</label>
                      <input type="number" className="mt-1 block w-full border rounded p-2" value={job.salaryMax ?? ''} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Currency</label>
                      <input className="mt-1 block w-full border rounded p-2" value={job.salaryCurrency ?? ''} readOnly />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Responsibilities</label>
                    <textarea className="mt-1 block w-full border rounded p-2" rows={3} value={job.responsibilities ?? ''} readOnly />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Requirements</label>
                    <textarea className="mt-1 block w-full border rounded p-2" rows={3} value={job.requirements ?? ''} readOnly />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Benefits</label>
                    <textarea className="mt-1 block w-full border rounded p-2" rows={3} value={job.benefits ?? ''} readOnly />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Application URL</label>
                    <input className="mt-1 block w-full border rounded p-2" value={job.applicationUrl ?? ''} readOnly />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Closing Date</label>
                    <input type="date" className="mt-1 block w-full border rounded p-2" value={job.closingDate ?? ''} readOnly />
                  </div>

                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button className="btn" onClick={() => router.push('/jobs')}>Back</button>
                  <button className="btn btn-primary" onClick={() => {
                    setEditing(true);
                    setEditForm({ ...job })
                  }}>Edit</button>
                  <button onClick={handleDelete} className="btn btn-sm btn-danger">Delete</button>
                </div>

              </div>

              {/* RIGHT COPY (IDENTICAL CONTENT) */}
               <div className="flex flex-col gap-6">

                <div>
                  <div key={job.id} className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-slate-50">
                    <div className="mb-2 text-sm text-gray-500">{job.company?.name}</div>

                    <h3 className="text-lg font-semibold mb-2">{job.title}</h3>

                    {job.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                    )}

                    <div className="flex flex-wrap gap-2 text-xs ">
                      {job.employmentType && (
                        <span className="bg-gray-100 px-2 py-1 rounded-lg bg-red-300">{job.employmentType}</span>
                      )}
                      {job.remoteType && (
                        <span className="bg-gray-100 px-2 py-1 rounded-lg bg-neutral-300">{job.remoteType}</span>
                      )}
                      {job.location && (
                        <span className="bg-gray-100 px-2 py-1 rounded-lg bg-slate-300">{job.location}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">

                  {/* All original fields unchanged */}

                  <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea className="mt-1 block w-full border rounded p-2" rows={4} value={job.description ?? ''} readOnly />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium">Salary Min</label>
                      <input type="number" className="mt-1 block w-full border rounded p-2" value={job.salaryMin ?? ''} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Salary Max</label>
                      <input type="number" className="mt-1 block w-full border rounded p-2" value={job.salaryMax ?? ''} readOnly />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Currency</label>
                      <input className="mt-1 block w-full border rounded p-2" value={job.salaryCurrency ?? ''} readOnly />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Responsibilities</label>
                    <textarea className="mt-1 block w-full border rounded p-2" rows={3} value={job.responsibilities ?? ''} readOnly />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Requirements</label>
                    <textarea className="mt-1 block w-full border rounded p-2" rows={3} value={job.requirements ?? ''} readOnly />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Benefits</label>
                    <textarea className="mt-1 block w-full border rounded p-2" rows={3} value={job.benefits ?? ''} readOnly />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Application URL</label>
                    <input className="mt-1 block w-full border rounded p-2" value={job.applicationUrl ?? ''} readOnly />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">Closing Date</label>
                    <input type="date" className="mt-1 block w-full border rounded p-2" value={job.closingDate ?? ''} readOnly />
                  </div>

                </div>

                <div className="mt-4 flex items-center gap-3">
                  <button className="btn btn-primary" onClick={() => {
                    setEditing(true);
                    setEditForm({ ...job })
                  }}>Apply Now</button>
                </div>

              </div>

            </div>
          )}
        </div>
      )}
    </>
  )
}