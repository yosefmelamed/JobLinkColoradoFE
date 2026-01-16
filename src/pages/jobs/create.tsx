import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'

type Me = { id: string; email: string; employerProfile?: { id: string } }

export default function CreateJob() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [location, setLocation] = useState('')
  const [employmentType, setEmploymentType] = useState('Full-time')
  const [remoteType, setRemoteType] = useState('On-site')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [salaryCurrency, setSalaryCurrency] = useState('USD')
  const [responsibilities, setResponsibilities] = useState('')
  const [requirements, setRequirements] = useState('')
  const [benefits, setBenefits] = useState('')
  const [applicationUrl, setApplicationUrl] = useState('')
  const [closingDate, setClosingDate] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<Me | null>(null)
  const [initializing, setInitializing] = useState(true)
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    setInitializing(true)
    Promise.allSettled([api.get('/companies'), api.get('/profiles/me')])
      .then(results => {
        if (!mounted) return
        const compRes = results[0].status === 'fulfilled' ? (results[0] as any).value.data : []
        const meRes = results[1].status === 'fulfilled' ? (results[1] as any).value.data : null
        setCompanies(compRes || [])
        setMe(meRes)
      })
      .catch(() => {})
      .finally(() => { if (mounted) setInitializing(false) })
    return () => { mounted = false }
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const payload = {
        title,
        description,
        companyId,
        location,
        employmentType,
        remoteType,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        salaryCurrency,
        responsibilities,
        requirements,
        benefits,
        applicationUrl,
        closingDate: closingDate || undefined,
      }
      await api.post('/jobs', payload)
      setModalOpen(false)
      router.push('/jobs')
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold mb-4">Create Job</h2>
        {!initializing && me && me.employerProfile && companies.length > 0 && (
          <button onClick={()=>setModalOpen(true)} className="px-3 py-2 bg-green-600 text-white rounded">Create Job</button>
        )}
      </div>

      {initializing ? (
        <div>Loading...</div>
      ) : me && !me.employerProfile ? (
        <div className="p-6 border rounded bg-yellow-50 max-w-lg">
          <div className="font-medium">You need an employer profile before posting jobs.</div>
          <div className="mt-2 text-sm">Create an employer profile to manage your company and post jobs.</div>
          <div className="mt-4">
            <Link href="/profiles/create-employer" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Create employer profile</Link>
          </div>
        </div>
      ) : companies.length === 0 ? (
        <div className="p-6 border rounded bg-yellow-50 max-w-lg">
          <div className="font-medium">You don't have any companies yet.</div>
          <div className="mt-2 text-sm">Create a company first so you can post jobs for it.</div>
          <div className="mt-4">
            <Link href="/companies/create" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Create your company</Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-sm text-gray-600">Click "Create Job" to open the posting form.</div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={()=>setModalOpen(false)} />
          <div className="relative bg-white rounded max-w-2xl w-full p-6 shadow-lg mx-4 overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Create Job Posting</h3>
              <button onClick={()=>setModalOpen(false)} className="text-gray-600">Close</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input required className="mt-1 block w-full border rounded p-2" value={title} onChange={e=>setTitle(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Company</label>
                  <select required className="mt-1 block w-full border rounded p-2" value={companyId} onChange={e=>setCompanyId(e.target.value)}>
                    <option value="">Select company</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Location</label>
                  <input className="mt-1 block w-full border rounded p-2" value={location} onChange={e=>setLocation(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">Employment Type</label>
                  <select className="mt-1 block w-full border rounded p-2" value={employmentType} onChange={e=>setEmploymentType(e.target.value)}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Work Type</label>
                  <select className="mt-1 block w-full border rounded p-2" value={remoteType} onChange={e=>setRemoteType(e.target.value)}>
                    <option>On-site</option>
                    <option>Hybrid</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Closing Date</label>
                  <input type="date" className="mt-1 block w-full border rounded p-2" value={closingDate} onChange={e=>setClosingDate(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">Salary Min</label>
                  <input type="number" className="mt-1 block w-full border rounded p-2" value={salaryMin} onChange={e=>setSalaryMin(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Salary Max</label>
                  <input type="number" className="mt-1 block w-full border rounded p-2" value={salaryMax} onChange={e=>setSalaryMax(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Currency</label>
                  <input className="mt-1 block w-full border rounded p-2" value={salaryCurrency} onChange={e=>setSalaryCurrency(e.target.value)} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea required className="mt-1 block w-full border rounded p-2" rows={6} value={description} onChange={e=>setDescription(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium">Responsibilities</label>
                <textarea className="mt-1 block w-full border rounded p-2" rows={4} value={responsibilities} onChange={e=>setResponsibilities(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium">Requirements</label>
                <textarea className="mt-1 block w-full border rounded p-2" rows={4} value={requirements} onChange={e=>setRequirements(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium">Benefits</label>
                <textarea className="mt-1 block w-full border rounded p-2" rows={3} value={benefits} onChange={e=>setBenefits(e.target.value)} />
              </div>

              <div>
                <label className="block text-sm font-medium">Application URL or Email</label>
                <input className="mt-1 block w-full border rounded p-2" value={applicationUrl} onChange={e=>setApplicationUrl(e.target.value)} />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={()=>setModalOpen(false)} className="px-3 py-2 border rounded">Cancel</button>
                <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Creating...' : 'Create Job'}</button>
              </div>
              {error && <div className="text-red-600">{error}</div>}
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}
