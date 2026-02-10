import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'

type Me = { id: string; email: string; employerProfile?: { id: string }; employeeProfile?: { id: string } }

export default function ProfilesPage() {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    let mounted = true
    api.get('/profiles/me')
      .then(res => { if (mounted) setMe(res.data || null) })
      .catch(err => { if (mounted) setError(err?.response?.data?.message || err.message) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (me) setForm({ email: me.email, employerProfileId: me.employerProfile?.id ?? '', employeeProfileId: me.employeeProfile?.id ?? '' })
  }, [me])

  async function saveProfile() {
    try {
      await api.put('/profiles/me', form)
      const r = await api.get('/profiles/me')
      setMe(r.data)
      setEditing(false)
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    }
  }

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !me && (
        <div>
          <div className="mb-4">You are not signed in or have no profile.</div>
          <div className="space-x-2">
            <Link href="/profiles/create-employer" className="btn btn-sm btn-primary">Create Employer Profile</Link>
            <Link href="/profiles/create-employee" className="btn btn-sm btn-primary">Create Employee Profile</Link>
          </div>
        </div>
      )}

      {me && (
        <div className="max-w-2xl">
          <div className="bg-white border rounded p-4 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Account</h3>
              {!editing ? (
                <button className="btn" onClick={() => setEditing(true)}>Edit</button>
              ) : (
                <div className="flex gap-2">
                  <button className="btn btn-primary" onClick={saveProfile}>Save</button>
                  <button className="btn" onClick={() => { setEditing(false); setForm({ email: me.email, employerProfileId: me.employerProfile?.id ?? '', employeeProfileId: me.employeeProfile?.id ?? '' }) }}>Cancel</button>
                </div>
              )}
            </div>

            <div className="grid gap-3">
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input className="mt-1 block w-full border rounded p-2" value={form?.email ?? ''} onChange={e => setForm({...form, email: e.target.value})} disabled={!editing} />
              </div>

              <div>
                <label className="block text-sm font-medium">Employer Profile ID</label>
                <input className="mt-1 block w-full border rounded p-2 bg-gray-50" value={form?.employerProfileId ?? ''} onChange={e => setForm({...form, employerProfileId: e.target.value})} disabled={!editing} />
              </div>

              <div>
                <label className="block text-sm font-medium">Employee Profile ID</label>
                <input className="mt-1 block w-full border rounded p-2 bg-gray-50" value={form?.employeeProfileId ?? ''} onChange={e => setForm({...form, employeeProfileId: e.target.value})} disabled={!editing} />
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
