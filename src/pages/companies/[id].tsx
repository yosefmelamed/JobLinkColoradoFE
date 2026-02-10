import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../components/Layout'
import { api } from '../../utils/api'
import Link from 'next/link'

type Company = { id: string; name: string; description?: string; employerId?: string }

export default function CompanyDetail() {
  const router = useRouter()
  const { id, edit } = router.query as { id?: string; edit?: string }
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get(`/companies/${id}`).then(r => setCompany(r.data)).catch(e => setError(e?.response?.data?.message || e.message)).finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (edit === 'true') setEditing(true)
  }, [edit])

  function enterEdit() {
    setForm({ name: company?.name ?? '', description: company?.description ?? '', employerProfileId: company?.employerId })
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
    setForm(null)
  }

  async function save() {
    if (!company) return
    try {
      await api.put(`/companies/${company.id}`, { name: form.name, description: form.description, employerProfileId: form.employerProfileId })
      const r = await api.get(`/companies/${company.id}`)
      setCompany(r.data)
      setEditing(false)
      setForm(null)
    } catch (e: any) {
      setError(e?.response?.data?.message || e.message)
    }
  }

  return (
    <Layout>
      <div className="max-w-3xl">
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {company && (
          <div className="job_item p-6">
            {!editing ? (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold">{company.name}</h2>
                    <div className="text-sm text-gray-600">Employer ID: {company.employerId}</div>
                  </div>
                  <div className="space-x-2">
                    <button className="btn" onClick={enterEdit}>Edit</button>
                    <Link href="/companies" className="btn">Back</Link>
                  </div>
                </div>
                <div className="mt-4 text-sm">{company.description || 'No description'}</div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-semibold mb-3">Edit Company</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <input className="mt-1 block w-full border rounded p-2" value={form?.name ?? ''} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Description</label>
                    <textarea className="mt-1 block w-full border rounded p-2" rows={6} value={form?.description ?? ''} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-primary" onClick={save}>Save</button>
                    <button className="btn" onClick={cancelEdit}>Cancel</button>
                  </div>
                  {error && <div className="text-red-600">{error}</div>}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  )
}
