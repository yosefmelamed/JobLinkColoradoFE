import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'
import JobModal from '../../components/JobModal'

type Job = {
  id: string
  title: string
  description?: string
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
  company?: { id?: string; name?: string; employerId?: string }
}
type Me = { id: string; email: string; employerProfile?: { id: string } }

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<Me | null>(null)
  const [companies, setCompanies] = useState<any[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    api.get('/jobs')
      .then(res => { if (mounted) setJobs(res.data || []) })
      .catch(err => { if (mounted) setError(err?.response?.data?.message || err.message) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  function refreshJobs() {
    api.get('/jobs').then(res => setJobs(res.data || [])).catch(() => {})
  }

  useEffect(() => {
    let mounted = true
    api.get('/profiles/me').then(r => { if (mounted) setMe(r.data) }).catch(() => {}).finally(() => {})
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    api.get('/companies').then(r => { if (mounted) setCompanies(r.data || []) }).catch(() => {})
    return () => { mounted = false }
  }, [])

  const myCompany = me?.employerProfile ? companies.find(c => c.employerId === me.employerProfile!.id) : undefined
  const myJobs = myCompany ? jobs.filter(j => j.company?.id === myCompany.id) : []

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Jobs</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {/* If user has no employer profile, prompt to create one */}
      {me && !me.employerProfile && !loading && (
        <div className="mb-6 p-4 border rounded bg-yellow-50 max-w-lg">
          <div className="font-medium">You need an employer profile before posting jobs.</div>
          <div className="mt-2 text-sm">Create an employer profile to manage companies and post jobs.</div>
          <div className="mt-4">
            <Link href="/profiles/create-employer" className="btn btn-primary">Create employer profile</Link>
          </div>
        </div>
      )}

      {/* If user has an employerProfile but no company, prompt to create a company */}
      {me?.employerProfile && !loading && !myCompany && (
        <div className="mb-6 p-4 border rounded bg-yellow-50 max-w-lg">
          <div className="font-medium">You don't have a company yet.</div>
          <div className="mt-2">Create a company to start posting jobs.</div>
          <div className="mt-4">
            <Link href="/companies/create" className="btn btn-primary">Create your company</Link>
          </div>
        </div>
      )}

      {/* If user has a company but hasn't posted any jobs, prompt to create a job */}
      {me?.employerProfile && myCompany && !loading && myJobs.length === 0 && (
        <div className="mb-6 p-4 border rounded bg-yellow-50 max-w-lg">
          <div className="font-medium">No jobs posted yet.</div>
          <div className="mt-2">Create your first job posting.</div>
          <div className="mt-4">
            <button onClick={()=>setModalOpen(true)} className="btn btn-primary">Create your first job</button>
          </div>
        </div>
      )}

      <div className="job_container">
        {/* Show user's company jobs first */}
        {myJobs.length > 0 && myJobs.map(job => (
          <div key={job.id} className="job_item">
            <div>
              <h3 className="text-lg font-medium">{job.title} <span className="text-sm text-gray-500">(Your company)</span></h3>
              <div className="text-sm text-gray-600">{job.company?.name}</div>
              {job.location && <div className="text-sm text-gray-600">Location: {job.location}</div>}
              <div className="mt-2 text-sm">{job.description ? job.description.substring(0, 400) : 'No description'}</div>
              <div className="mt-2 text-sm text-gray-700">
                {job.employmentType && <span className="mr-3">Type: {job.employmentType}</span>}
                {job.remoteType && <span className="mr-3">Work: {job.remoteType}</span>}
                {(job.salaryMin || job.salaryMax) && (
                  <span className="mr-3">Salary: {job.salaryCurrency ?? ''} {job.salaryMin ?? ''}{job.salaryMin && job.salaryMax ? ' - ' + job.salaryMax : ''}</span>
                )}
              </div>
              {job.responsibilities && <div className="mt-2"><strong>Responsibilities:</strong> <div className="text-sm">{job.responsibilities}</div></div>}
              {job.requirements && <div className="mt-2"><strong>Requirements:</strong> <div className="text-sm">{job.requirements}</div></div>}
              {job.benefits && <div className="mt-2"><strong>Benefits:</strong> <div className="text-sm">{job.benefits}</div></div>}
              {job.applicationUrl && (
                <div className="mt-2"><a href={job.applicationUrl} className="text-blue-600">Apply: {job.applicationUrl}</a></div>
              )}
              {job.closingDate && (
                <div className="mt-2 text-sm text-gray-600">Closes: {new Date(job.closingDate).toLocaleDateString()}</div>
              )}

              <div className="job_item-cta mt-4">
                <Link href={`/jobs/${job.id}?edit=true`} className="btn">Edit</Link>
                <Link href={`/jobs/${job.id}`} className="btn">View</Link>
                {job.applicationUrl ? (
                  <a href={job.applicationUrl} className="btn btn-primary">Apply</a>
                ) : (
                  <button onClick={() => setModalOpen(true)} className="btn btn-primary">Create / Apply</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* Show user's company jobs first */}
        {myJobs.length > 0 &&  (
          <div className="mt-4">
             <button onClick={()=>setModalOpen(true)} className="btn btn-primary">Create another job</button>
             </div>
        )}


        {/* Other jobs */}
        {jobs.filter(j => !(myCompany && j.company?.id === myCompany.id)).map(job => (
          <div key={job.id} className="job_item">
            <h3 className="text-lg font-medium">{job.title}</h3>
            <div className="text-sm text-gray-600">{job.company?.name}</div>
            {job.location && <div className="text-sm text-gray-600">Location: {job.location}</div>}
            <p className="mt-2 text-sm">{job.description ? job.description.substring(0, 400) : 'No description'}</p>
            <div className="mt-2 text-sm text-gray-700">
              {job.employmentType && <span className="mr-3">Type: {job.employmentType}</span>}
              {job.remoteType && <span className="mr-3">Work: {job.remoteType}</span>}
              {(job.salaryMin || job.salaryMax) && (
                <span className="mr-3">Salary: {job.salaryCurrency ?? ''} {job.salaryMin ?? ''}{job.salaryMin && job.salaryMax ? ' - ' + job.salaryMax : ''}</span>
              )}
            </div>
            {job.responsibilities && <div className="mt-2"><strong>Responsibilities:</strong> <div className="text-sm">{job.responsibilities}</div></div>}
            {job.requirements && <div className="mt-2"><strong>Requirements:</strong> <div className="text-sm">{job.requirements}</div></div>}
            {job.benefits && <div className="mt-2"><strong>Benefits:</strong> <div className="text-sm">{job.benefits}</div></div>}
            {job.applicationUrl && (
              <div className="mt-2"><a href={job.applicationUrl} className="text-blue-600">Apply: {job.applicationUrl}</a></div>
            )}
            {job.closingDate && (
              <div className="mt-2 text-sm text-gray-600">Closes: {new Date(job.closingDate).toLocaleDateString()}</div>
            )}

            <div className="job_item-cta mt-4">
              <Link href={`/jobs/${job.id}`} className="btn">View</Link>
              {job.applicationUrl && (
                <a href={job.applicationUrl} className="btn btn-primary">Apply</a>
              )}
            </div>
          </div>
        ))}

             </div>
      <JobModal isOpen={modalOpen} onClose={()=>setModalOpen(false)} companies={companies} onCreated={refreshJobs} />
    </Layout>
  )
}
