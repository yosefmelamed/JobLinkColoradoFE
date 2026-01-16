import { useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'

export default function CreateEmployee() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      await api.post('/profiles/employee')
      router.push('/profiles')
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">Create Employee Profile</h2>
      <form onSubmit={handleCreate} className="space-y-4">
        <p>This will create an employee profile for the authenticated user.</p>
        <div>
          <button disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Creating...' : 'Create'}</button>
        </div>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </Layout>
  )
}
