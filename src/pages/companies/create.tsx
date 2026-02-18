"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Layout from "../../components/Layout"
import { api } from "../../utils/api"

type Job = {
  id: string
  title: string
  description?: string
  company?: {
    id?: string
    name?: string
    employerId?: string
  }
  location?: string
  employmentType?: string
  remoteType?: string
  createdAt?: string
}

type Me = {
  id: string
  email: string
  employerProfile?: { id: string }
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<Me | null>(null)

  /* ============================= */
  /* LOAD CURRENT USER */
  /* ============================= */
  useEffect(() => {
    let mounted = true

    api
      .get("/profiles/me")
      .then(res => {
        if (mounted) setMe(res.data)
      })
      .catch(() => {})
    
    return () => {
      mounted = false
    }
  }, [])

  /* ============================= */
  /* LOAD JOBS FOR CURRENT USER */
  /* ============================= */
  useEffect(() => {
    let mounted = true

    if (!me?.employerProfile) {
      setLoading(false)
      return
    }

    const loadJobs = async () => {
      setLoading(true)
      try {
        const res = await api.get("/jobs", {
          headers: { "Cache-Control": "no-cache" },
        })

        if (!mounted) return

        const allJobs: Job[] = res.data || []

        // Only jobs that belong to THIS employer
        const myJobs = allJobs.filter(
          job => job.company?.employerId === me.employerProfile!.id
        )

        // Sort newest first
        const sorted = myJobs.slice().sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return (
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
            )
          }
          return 0
        })

        setJobs(sorted)
        setFilteredJobs(sorted)
        setError(null)
      } catch (err: any) {
        if (!mounted) return
        setError(err?.response?.data?.message || "Error loading jobs")
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadJobs()

    return () => {
      mounted = false
    }
  }, [me])

  /* ============================= */
  /* SEARCH FILTER (CLIENT SIDE) */
  /* ============================= */
  useEffect(() => {
    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description?.toLowerCase().includes(search.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(search.toLowerCase())
    )

    setFilteredJobs(filtered)
  }, [search, jobs])

  /* ============================= */
  /* UI */
  /* ============================= */
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold mb-6">My Jobs</h2>

        {/* No employer profile */}
        {!loading && me && !me.employerProfile && (
          <div className="p-6 border rounded bg-yellow-50 max-w-lg">
            <div className="font-medium">
              You need an employer profile to manage jobs.
            </div>
            <div className="mt-4">
              <Link
                href="/profiles/create-employer"
                className="btn btn-primary"
              >
                Create employer profile
              </Link>
            </div>
          </div>
        )}

        {/* Search */}
        {me?.employerProfile && (
          <div className="mb-8 p-6 rounded-2xl shadow-sm border bg-slate-50">
            <input
              type="text"
              placeholder="Search your jobs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Loading / Error */}
        {loading && <div className="text-gray-500">Loading jobs...</div>}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        {/* Empty State */}
        {!loading &&
          me?.employerProfile &&
          filteredJobs.length === 0 && (
            <div className="p-6 border rounded text-center">
              <div className="mb-2 font-medium">
                You haven’t posted any jobs yet.
              </div>
              <Link href="/jobs/create" className="btn btn-primary">
                Create your first job
              </Link>
            </div>
          )}

        {/* Jobs Grid */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredJobs.map(job => (
              <Link key={job.id} href={`/jobs/${job.id}`}>
                <div className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-slate-50 cursor-pointer">
                  <div className="mb-2 text-sm text-gray-500">
                    {job.company?.name}
                  </div>

                  <h3 className="text-lg font-semibold mb-2">
                    {job.title}
                  </h3>

                  {job.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {job.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 text-xs">
                    {job.employmentType && (
                      <span className="bg-red-300 px-2 py-1 rounded-lg">
                        {job.employmentType}
                      </span>
                    )}
                    {job.remoteType && (
                      <span className="bg-neutral-300 px-2 py-1 rounded-lg">
                        {job.remoteType}
                      </span>
                    )}
                    {job.location && (
                      <span className="bg-slate-300 px-2 py-1 rounded-lg">
                        {job.location}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}