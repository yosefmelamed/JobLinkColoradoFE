"use client"
import Link from 'next/link';
import { api } from '../../utils/api'
import { useEffect, useState } from "react"

type Job = {
  id: string;
  title: string;
  description?: string;
  company?: { name?: string };
  location?: string;
  employmentType?: string;
  remoteType?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  responsibilities?: string;
  requirements?: string;
  benefits?: string;
  applicationUrl?: string;
  closingDate?: string;
  createdAt?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedEmployment, setSelectedEmployment] = useState<string[]>([])
  const [selectedRemote, setSelectedRemote] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const employmentOptions = ["Full-time", "Part-time", "Contract"]
  const remoteOptions = ["Remote", "Hybrid", "On-site"]

  /* ============================= */
  /* LOAD JOBS (INITIAL + SEARCH) */
  /* ============================= */
  useEffect(() => {
    let mounted = true

    const loadJobs = async () => {
      setLoading(true)
      try {
        const query = search ? `?search=${encodeURIComponent(search)}` : ""
        const res = await api.get(`/jobs${query}`, {
          headers: { 'Cache-Control': 'no-cache' },
        })

        if (!mounted) return
        const all: Job[] = res.data || []

        // Sort newest first if createdAt exists
        const sorted = all.slice().sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          }
          return 0
        })

        setJobs(sorted)
        setError(null)
      } catch (err: any) {
        if (!mounted) return
        setJobs([])
        setError(err?.response?.data?.message || err.message || "Error loading jobs")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadJobs()

    return () => {
      mounted = false
    }
  }, [search])

  /* ============================= */
  /* CLIENT-SIDE FILTERING */
  /* ============================= */
  const filteredJobs = jobs.filter(job => {
    const matchesEmployment =
      selectedEmployment.length === 0 ||
      (job.employmentType && selectedEmployment.includes(job.employmentType))

    const matchesRemote =
      selectedRemote.length === 0 ||
      (job.remoteType && selectedRemote.includes(job.remoteType))

    return matchesEmployment && matchesRemote
  })

  /* ============================= */
  /* UI */
  /* ============================= */
  return (
    <div className=" max-w-6xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find Your Next Opportunity</h1>
        <p className="text-gray-600">Browse available jobs and filter by your preferences.</p>
      </div>

      {/* Search + Filters */}
      <div className="search mb-8 p-6 rounded-2xl shadow-sm border">
        {/* Search */}
        <input
          type="text"
          placeholder="Search jobs..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full border rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid md:grid-cols-2 gap-6">
          {/* Employment Type */}
          <div>
            <div className="text-sm font-semibold mb-3">Employment Type</div>
            <div className="flex flex-wrap gap-4">
              {employmentOptions.map(type => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedEmployment.includes(type)}
                    onChange={e => {
                      if (e.target.checked) setSelectedEmployment([...selectedEmployment, type])
                      else setSelectedEmployment(selectedEmployment.filter(t => t !== type))
                    }}
                    className="accent-blue-600"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          {/* Work Type */}
          <div>
            <div className="text-sm font-semibold mb-3">Work Type</div>
            <div className="flex flex-wrap gap-4">
              {remoteOptions.map(type => (
                <label key={type} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedRemote.includes(type)}
                    onChange={e => {
                      if (e.target.checked) setSelectedRemote([...selectedRemote, type])
                      else setSelectedRemote(selectedRemote.filter(t => t !== type))
                    }}
                    className="accent-blue-600"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading / Error */}
      {loading && <div className="text-gray-500">Loading jobs...</div>}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {/* Jobs Grid */}
      {!loading && filteredJobs.length === 0 && (
        <div className="text-gray-500">No jobs match your filters.</div>
      )}

      {!loading && filteredJobs.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {filteredJobs.map(job => (
             <Link href={`/jobs/${job?.id}`} className="">
            <div key={job.id} className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition">
             
             <div className="mb-2 text-sm text-gray-500">{job.company?.name}</div>

              <h3 className="text-lg font-semibold mb-2">{job.title}</h3>

              {job.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{job.description}</p>
              )}

              <div className="flex flex-wrap gap-2 text-xs">
                {job.employmentType && (
                  <span className="bg-gray-100 px-2 py-1 rounded-lg">{job.employmentType}</span>
                )}
                {job.remoteType && (
                  <span className="bg-gray-100 px-2 py-1 rounded-lg">{job.remoteType}</span>
                )}
                {job.location && (
                  <span className="bg-gray-100 px-2 py-1 rounded-lg">{job.location}</span>
                )}
              </div>
              </div>
             </Link>
            
            
          ))}
        </div>
      )}
    </div>
  )
}