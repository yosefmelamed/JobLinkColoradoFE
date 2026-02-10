import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import CompanyModal from '../../components/CompanyModal'
import { api } from '../../utils/api'

type Company = { id: string; name: string; description?: string; employerId?: string }

type Me = { id: string; email: string; employerProfile?: { id: string } }

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<Me | null>(null)
  const [companyModalOpen, setCompanyModalOpen] = useState(false)
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null)
  const [companyForm, setCompanyForm] = useState<any>(null)

  const fetchCompanies = () => {
    setLoading(true)
    return api.get('/companies')
      .then(res => setCompanies(res.data || []))
      .catch(err => setError(err?.response?.data?.message || err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let mounted = true
    if (mounted) fetchCompanies()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    api.get('/profiles/me').then(r => { if (mounted) setMe(r.data) }).catch(() => {}).finally(() => {})
    return () => { mounted = false }
  }, [])

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Companies</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {/* If user has an employerProfile but hasn't created a company, show CTA (only when other companies exist) */}
      {me?.employerProfile && !loading && companies.length > 0 && !companies.find(c => c.employerId === me.employerProfile!.id) && (
        <div className="mb-6 p-4 border rounded bg-yellow-50">
          <div className="font-medium">You haven't created a company yet.</div>
          <div className="mt-2">Create your company now</div>
            <div className="mt-4">
              <button onClick={()=>setCompanyModalOpen(true)} className="btn btn-primary">Create your company now</button>
            </div>
        </div>
      )}

      <div className="job_container">
        {companies.map(c => {
          const isMine = !!(me?.employerProfile && c.employerId === me.employerProfile.id)
          return (
            <div key={c.id} className="job_item">
              <div>
                <h3 className="text-lg font-medium">{c.name} {isMine && <span className="text-sm text-gray-500">(Your company)</span>}</h3>
                <div className="text-sm text-gray-600">Employer ID: {c.employerId ?? '—'}</div>
                <p className="mt-2 text-sm">{c.description ? (c.description.length > 300 ? c.description.substring(0, 300) + '...' : c.description) : 'No description'}</p>
                <div className="job_item-cta mt-4">
                  <Link href={`/companies/${c.id}`} className="btn">View</Link>
                  {isMine && <Link href={`/companies/${c.id}?edit=true`} className="btn">Edit</Link>}
                </div>
              </div>
            </div>
          )
        })}

        {/* Empty state */}
        {!loading && companies.length === 0 && (
          <div className="p-6 border rounded text-center">
            <div className="mb-2 font-medium">No companies yet.</div>
            <button className="btn btn-primary" onClick={() => setCompanyModalOpen(true)}>Create your company now</button>
          </div>
        )}
      </div>
      {!loading && companies.length > 0 && (
        <div className="mt-4">
          <button onClick={() => setCompanyModalOpen(true)} className="btn btn-primary">Create another company</button>
        </div>
      )}

      <CompanyModal open={companyModalOpen} onClose={() => setCompanyModalOpen(false)} onCreated={() => { setCompanyModalOpen(false); fetchCompanies() }} />
    </Layout>
  )
}
