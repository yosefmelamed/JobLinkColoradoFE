import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'

export default function JobDetail() {
  const router = useRouter()
  const { id } = router.query
  const [job, setJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true
    api.get(`/jobs/${id}`).then(r => { if (mounted) setJob(r.data) }).catch(err => { if (mounted) setError(err?.response?.data?.message || err.message) }).finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  async function handleDelete() {
    if (!id || typeof id !== 'string') return
    try {
      await api.delete(`/jobs/${id}`)
      router.push('/jobs')
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    }
  }

  return (
    <Layout>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      {job && (
        <div>
          <h2 className="text-2xl font-semibold">{job.title}</h2>
          <div className="text-sm text-gray-600">Company: {job.company?.name}</div>
          <p className="mt-4">{job.description}</p>
          <div className="mt-4">
            <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
          </div>
        </div>
      )}
    </Layout>
  )
}
