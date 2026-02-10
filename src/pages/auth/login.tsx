import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await api.post('/auth/login', { email, password })
      // store token in localStorage for demo and redirect home
      if (res.data?.token) localStorage.setItem('token', res.data.token)
      router.push('/')
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">Sign In</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input className="mt-1 block w-full border rounded p-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input type="password" className="mt-1 block w-full border rounded p-2" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        <div>
          <button disabled={loading} className="btn btn-primary">{loading ? 'Signing in...' : 'Sign In'}</button>
        </div>
        {message && <div className="text-sm text-red-600">{message}</div>}
      </form>
      <div className="mt-4 text-sm text-center">
        Don't have an account? <Link href="/auth/signup" className="text-blue-600">Sign up here</Link>
      </div>
    </Layout>
  )
}
