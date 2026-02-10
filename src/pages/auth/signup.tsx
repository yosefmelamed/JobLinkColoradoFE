import { useState } from 'react'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'EMPLOYER'|'EMPLOYEE'>('EMPLOYEE')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await api.post('/auth/signup', { email, password, role })
      setMessage('Signup successful — check your email to confirm.')
    } catch (err: any) {
      setMessage(err?.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">Sign up</h2>
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
          <label className="block text-sm font-medium">Role</label>
          <select value={role} onChange={e=>setRole(e.target.value as any)} className="mt-1 block w-full border rounded p-2">
            <option value="EMPLOYEE">Employee</option>
            <option value="EMPLOYER">Employer</option>
          </select>
        </div>
        <div>
          <button disabled={loading} className="btn btn-primary">{loading ? 'Signing...' : 'Sign up'}</button>
        </div>
        {message && <div className="text-sm text-red-600">{message}</div>}
      </form>
    </Layout>
  )
}
