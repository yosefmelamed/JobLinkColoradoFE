import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'

export default function CreateCompany() {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    api.get('/profiles/me').then(r => setMe(r.data)).catch(() => {})
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const employerId = me?.employerProfile?.id
      if (!employerId) throw new Error('You need an employer profile')
      await api.post('/companies', { name, description, employerProfileId: employerId })
      router.push('/companies')
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">Create Company</h2>

      {/* If user doesn't have an employer profile, instruct them to create one first */}
      {me && !me.employerProfile ? (
        <div className="p-6 border rounded bg-yellow-50 max-w-lg">
          <div className="font-medium">You need an employer profile before creating a company.</div>
          <div className="mt-2 text-sm">Create an employer profile to manage your company and post jobs.</div>
          <div className="mt-4">
            <Link href="/profiles/create-employer" className="inline-block px-4 py-2 bg-blue-600 text-white rounded">Create employer profile</Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleCreate} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input className="mt-1 block w-full border rounded p-2" value={name} onChange={e=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea className="mt-1 block w-full border rounded p-2" value={description} onChange={e=>setDescription(e.target.value)} />
          </div>
          <div>
            <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Creating...' : 'Create'}</button>
          </div>
          {error && <div className="text-red-600">{error}</div>}
        </form>
      )}
    </Layout>
  )
}
