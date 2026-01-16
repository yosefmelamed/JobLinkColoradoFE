import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'

type Company = { id: string; name: string; description?: string; employerId?: string }

type Me = { id: string; email: string; employerProfile?: { id: string } }

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<Me | null>(null)

  useEffect(() => {
    let mounted = true
    api.get('/companies')
      .then(res => { if (mounted) setCompanies(res.data || []) })
      .catch(err => { if (mounted) setError(err?.response?.data?.message || err.message) })
      .finally(() => { if (mounted) setLoading(false) })
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
            <Link href="/companies/create" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Create your company now</Link>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Show the current user's company first (if any) */}
        {me?.employerProfile && (() => {
          const my = companies.find(c => c.employerId === me.employerProfile!.id)
          if (my) {
            return (
              <div key={my.id} className="p-4 border rounded bg-white">
                <h3 className="text-lg font-medium">{my.name} <span className="text-sm text-gray-500">(Your company)</span></h3>
                <p className="mt-2 text-sm">{my.description || 'No description'}</p>
              </div>
            )
          }
          return null
        })()}

        {/* List other companies (exclude user's company to avoid duplicates) */}
        {companies.filter(c => !(me?.employerProfile && c.employerId === me.employerProfile.id)).map(c => (
          <div key={c.id} className="p-4 border rounded">
            <h3 className="text-lg font-medium">{c.name}</h3>
            <p className="mt-2 text-sm">{c.description || 'No description'}</p>
          </div>
        ))}

        {/* If no companies at all, show CTA */}
        {!loading && companies.length === 0 && (
          <div className="p-6 border rounded text-center">
            <div className="mb-2 font-medium">You haven't created a company yet.</div>
            <Link href="/companies/create" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Create your company now</Link>
          </div>
        )}
      </div>
    </Layout>
  )
}
