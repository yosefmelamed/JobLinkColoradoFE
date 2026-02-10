import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '../utils/api'

type Props = {
  isOpen?: boolean
  open?: boolean
  onClose: () => void
  employerProfileId?: string
  onCreated?: () => void
}

export default function CompanyModal({ isOpen, open, onClose, employerProfileId, onCreated }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<any>(null)
  const [resolvedEmployerProfileId, setResolvedEmployerProfileId] = useState<string | undefined>(employerProfileId)

  const visible = open ?? isOpen
  
  useEffect(() => {
    let mounted = true
    if (!employerProfileId) {
      api.get('/profiles/me').then(r => { if (mounted) { setMe(r.data); setResolvedEmployerProfileId(r.data?.employerProfile?.id) } }).catch(() => {}).finally(() => {})
    } else {
      setResolvedEmployerProfileId(employerProfileId)
    }
    return () => { mounted = false }
  }, [employerProfileId])

  if (!visible) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)
    try {
      const employerId = resolvedEmployerProfileId
      if (!employerId) throw new Error('You need an employer profile to create a company')
      const payload: any = { name, description, employerProfileId: employerId }
      await api.post('/companies', payload)
      onClose()
      onCreated?.()
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message)
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative modal-content rounded max-w-lg w-full p-6 shadow-lg mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Create Company</h3>
          <button onClick={onClose} className="text-gray-600">Close</button>
        </div>
        {resolvedEmployerProfileId ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Company name</label>
              <input required className="mt-1 block w-full border rounded p-2" value={name} onChange={e=>setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea className="mt-1 block w-full border rounded p-2" rows={4} value={description} onChange={e=>setDescription(e.target.value)} />
            </div>
            <div className="flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} className="btn">Cancel</button>
              <button disabled={loading} className="btn btn-primary">{loading ? 'Creating...' : 'Create'}</button>
            </div>
            {error && <div className="text-red-600">{error}</div>}
          </form>
        ) : (
          <div className="p-4 bg-yellow-50 border rounded">
            <div className="font-medium">You need an employer profile before creating a company.</div>
            <div className="mt-2 text-sm">Create an employer profile to manage companies and post jobs.</div>
            <div className="mt-4">
              <Link href="/profiles/create-employer" className="btn btn-primary">Create employer profile</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
