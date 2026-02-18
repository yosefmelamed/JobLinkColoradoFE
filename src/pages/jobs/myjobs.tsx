"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import Layout from "../../components/Layout"
import { api } from "../../utils/api"

type Me = { id: string; email: string; employerProfile?: { id: string } }

type Job = {
  id: string
  title: string
  description?: string
  company?: { id: string; name?: string }
  companyId?: string
  location?: string
  employmentType?: string
  remoteType?: string
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  responsibilities?: string
  requirements?: string
  benefits?: string
  applicationUrl?: string
  closingDate?: string
  createdAt?: string
  employerId?: string
}

export default function MyJobsPage() {
  const [me, setMe] = useState<Me | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [companies, setCompanies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const router = useRouter()

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [companyId, setCompanyId] = useState("")
  const [location, setLocation] = useState("")
  const [employmentType, setEmploymentType] = useState("Full-time")
  const [remoteType, setRemoteType] = useState("On-site")
  const [salaryMin, setSalaryMin] = useState("")
  const [salaryMax, setSalaryMax] = useState("")
  const [salaryCurrency, setSalaryCurrency] = useState("USD")
  const [responsibilities, setResponsibilities] = useState("")
  const [requirements, setRequirements] = useState("")
  const [benefits, setBenefits] = useState("")
  const [applicationUrl, setApplicationUrl] = useState("")
  const [closingDate, setClosingDate] = useState("")
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  /* ============================= */
  /* FETCH USER + COMPANIES + JOBS */
  /* ============================= */
  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const [meRes, companiesRes, jobsRes] = await Promise.all([
          api.get("/profiles/me"),
          api.get("/companies"),
          api.get("/jobs"),
        ])
        if (!mounted) return
        setMe(meRes.data)
        setCompanies(companiesRes.data || [])

        // Only keep jobs belonging to this user
       const userCompanyIds = (companiesRes.data || []).map((c: any) => c.id)
const userJobs = (jobsRes.data || []).filter((j: Job) =>
  userCompanyIds.includes(j.companyId)
)
setJobs(userJobs)
      } catch (err: any) {
        if (!mounted) setError(err?.message || "Error loading data")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => {
      mounted = false
    }
  }, [])

  /* ============================= */
  /* OPEN MODAL FOR CREATE OR EDIT */
  /* ============================= */
  const openModal = (job?: Job) => {
    if (job) {
      // Edit mode
      setEditingJob(job)
      setTitle(job.title || "")
      setDescription(job.description || "")
      setCompanyId(job.companyId || "")
      setLocation(job.location || "")
      setEmploymentType(job.employmentType || "Full-time")
      setRemoteType(job.remoteType || "On-site")
      setSalaryMin(job.salaryMin?.toString() || "")
      setSalaryMax(job.salaryMax?.toString() || "")
      setSalaryCurrency(job.salaryCurrency || "USD")
      setResponsibilities(job.responsibilities || "")
      setRequirements(job.requirements || "")
      setBenefits(job.benefits || "")
      setApplicationUrl(job.applicationUrl || "")
      setClosingDate(job.closingDate || "")
    } else {
      // Create mode
      setEditingJob(null)
      setTitle("")
      setDescription("")
      setCompanyId("")
      setLocation("")
      setEmploymentType("Full-time")
      setRemoteType("On-site")
      setSalaryMin("")
      setSalaryMax("")
      setSalaryCurrency("USD")
      setResponsibilities("")
      setRequirements("")
      setBenefits("")
      setApplicationUrl("")
      setClosingDate("")
    }
    setFormError(null)
    setModalOpen(true)
  }

  /* ============================= */
  /* HANDLE SUBMIT (CREATE / EDIT) */
  /* ============================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    setFormError(null)
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

      if (editingJob) {
        // Update job
        const res = await api.put(`/jobs/${editingJob.id}`, payload)
        setJobs(prev => prev.map(j => (j.id === editingJob.id ? res.data : j)))
      } else {
        // Create job
        const res = await api.post("/jobs", payload)
        setJobs(prev => [res.data, ...prev])
      }

      setModalOpen(false)
    } catch (err: any) {
      setFormError(err?.response?.data?.message || err.message)
    } finally {
      setFormLoading(false)
    }
  }

  /* ============================= */
  /* FILTER JOBS BY SEARCH */
  /* ============================= */
  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase())
  )

  /* ============================= */
  /* RENDER */
  /* ============================= */
  if (loading) return <div>Loading...</div>
  if (!me?.employerProfile) return (
    <div className="p-6 border rounded bg-yellow-50 max-w-lg">
      <div className="font-medium">You need an employer profile before posting jobs.</div>
      <div className="mt-2 text-sm">Create an employer profile to manage your company and post jobs.</div>
      <div className="mt-4">
        <Link href="/profiles/create-employer" className="btn btn-primary">Create employer profile</Link>
      </div>
    </div>
  )

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">My Jobs</h2>
        <button onClick={() => openModal()} className="btn btn-primary">Create Job</button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search jobs..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full border rounded-xl px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="text-gray-500">No jobs found.</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
            <div key={job.id} className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-slate-50">
              <div className="mb-2 text-sm text-gray-500">{job.company?.name}</div>
              <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
              {job.description && <p className="text-sm text-gray-600 mb-4 line-clamp-3">{job.description}</p>}
              <div className="flex flex-wrap gap-2 text-xs">
                {job.employmentType && <span className="bg-red-300 px-2 py-1 rounded-lg">{job.employmentType}</span>}
                {job.remoteType && <span className="bg-neutral-300 px-2 py-1 rounded-lg">{job.remoteType}</span>}
                {job.location && <span className="bg-slate-300 px-2 py-1 rounded-lg">{job.location}</span>}
              </div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => openModal(job)} className="btn btn-outline btn-sm">Edit</button>
                <Link href={`/jobs/${job.id}`} className="btn btn-sm">View</Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40" onClick={() => setModalOpen(false)} />
          <div className="relative modal-content rounded max-w-2xl w-full p-6 shadow-lg mx-4 overflow-auto max-h-[90vh] bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">{editingJob ? "Edit Job" : "Create Job"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-600">Close</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input required className="mt-1 block w-full border rounded p-2" value={title} onChange={e => setTitle(e.target.value)} />
              </div>

              {/* Company & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Company</label>
                  <select required className="mt-1 block w-full border rounded p-2" value={companyId} onChange={e => setCompanyId(e.target.value)}>
                    <option value="">Select company</option>
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Location</label>
                  <input className="mt-1 block w-full border rounded p-2" value={location} onChange={e => setLocation(e.target.value)} />
                </div>
              </div>

              {/* Employment Type, Remote Type, Closing Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">Employment Type</label>
                  <select className="mt-1 block w-full border rounded p-2" value={employmentType} onChange={e => setEmploymentType(e.target.value)}>
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Work Type</label>
                  <select className="mt-1 block w-full border rounded p-2" value={remoteType} onChange={e => setRemoteType(e.target.value)}>
                    <option>On-site</option>
                    <option>Hybrid</option>
                    <option>Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium">Closing Date</label>
                  <input type="date" className="mt-1 block w-full border rounded p-2" value={closingDate} onChange={e => setClosingDate(e.target.value)} />
                </div>
              </div>

              {/* Salary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium">Salary Min</label>
                  <input type="number" className="mt-1 block w-full border rounded p-2" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Salary Max</label>
                  <input type="number" className="mt-1 block w-full border rounded p-2" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium">Currency</label>
                  <input className="mt-1 block w-full border rounded p-2" value={salaryCurrency} onChange={e => setSalaryCurrency(e.target.value)} />
                </div>
              </div>

              {/* Description, Responsibilities, Requirements, Benefits */}
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea required className="mt-1 block w-full border rounded p-2" rows={6} value={description} onChange={e => setDescription(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium">Responsibilities</label>
                <textarea className="mt-1 block w-full border rounded p-2" rows={4} value={responsibilities} onChange={e => setResponsibilities(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium">Requirements</label>
                <textarea className="mt-1 block w-full border rounded p-2" rows={4} value={requirements} onChange={e => setRequirements(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium">Benefits</label>
                <textarea className="mt-1 block w-full border rounded p-2" rows={3} value={benefits} onChange={e => setBenefits(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium">Application URL or Email</label>
                <input className="mt-1 block w-full border rounded p-2" value={applicationUrl} onChange={e => setApplicationUrl(e.target.value)} />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="btn">Cancel</button>
                <button disabled={formLoading} className="btn btn-primary">{formLoading ? "Saving..." : "Save Job"}</button>
              </div>
              {formError && <div className="text-red-600">{formError}</div>}
            </form>
          </div>
        </div>
      )}
      </>
  )
}