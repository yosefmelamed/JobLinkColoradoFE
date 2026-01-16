import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'

type Me = { id: string; email: string; employerProfile?: { id: string }; employeeProfile?: { id: string } }

export default function ProfilesPage() {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    api.get('/profiles/me')
      .then(res => { if (mounted) setMe(res.data || null) })
      .catch(err => { if (mounted) setError(err?.response?.data?.message || err.message) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !me && (
        <div>
          <div className="mb-4">You are not signed in or have no profile.</div>
          <div className="space-x-2">
            <Link href="/profiles/create-employer" className="px-3 py-1 bg-blue-600 text-white rounded">Create Employer Profile</Link>
            <Link href="/profiles/create-employee" className="px-3 py-1 bg-blue-600 text-white rounded">Create Employee Profile</Link>
          </div>
        </div>
      )}

      {me && (
        <div className="space-y-4">
          <div>Email: {me.email}</div>
          <div>
            Employer profile: {me.employerProfile ? <span className="text-green-600">Created ({me.employerProfile.id})</span> : <Link href="/profiles/create-employer" className="text-blue-600">Create</Link>}
          </div>
          <div>
            Employee profile: {me.employeeProfile ? <span className="text-green-600">Created ({me.employeeProfile.id})</span> : <Link href="/profiles/create-employee" className="text-blue-600">Create</Link>}
          </div>
        </div>
      )}
    </Layout>
  )
}
