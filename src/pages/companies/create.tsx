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
            <Link href="/profiles/create-employer" className="btn btn-primary">Create employer profile</Link>
          </div>
        </div>
      ) : (
        // <form onSubmit={handleCreate} className="space-y-4 max-w-lg">
        //   <div>
        //     <label className="block text-sm font-medium">Name</label>
        //     <input className="mt-1 block w-full border rounded p-2" value={name} onChange={e=>setName(e.target.value)} />
        //   </div>
        //   <div>
        //     <label className="block text-sm font-medium">Description</label>
        //     <textarea className="mt-1 block w-full border rounded p-2" value={description} onChange={e=>setDescription(e.target.value)} />
        //   </div>
        //   <div>
        //     <button disabled={loading} className="btn btn-primary">{loading ? 'Creating...' : 'Create'}</button>
        //   </div>
        //   {error && <div className="text-red-600">{error}</div>}
        // </form>
        <form>
  <div className="space-y-12">
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base/7 font-semibold text-gray-900">Profile</h2>
      <p className="mt-1 text-sm/6 text-gray-600">
        This information will be displayed publicly so be careful what you share.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <div className="sm:col-span-4">
          <label htmlFor="username" className="block text-sm/6 font-medium text-gray-900">
            Username
          </label>
          <div className="mt-2">
            <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
              <div className="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
                workcation.com/
              </div>
              <input id="username"
                type="text"
                name="username"
                placeholder="janesmith"
                className="block min-w-0 grow bg-white py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
              />
            </div>
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="about" className="block text-sm/6 font-medium text-gray-900">
            About
          </label>
          <div className="mt-2">
            <textarea
              id="about"
              name="about"
              rows={3}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
          </div>
          <p className="mt-3 text-sm/6 text-gray-600">
            Write a few sentences about yourself.
          </p>
        </div>

        <div className="col-span-full">
          <label htmlFor="photo" className="block text-sm/6 font-medium text-gray-900">
            Photo
          </label>
          <div className="mt-2 flex items-center gap-x-3">
            <svg
              viewBox="0 0 24 24" fill="currentColor"
              aria-hidden="true"
              className="size-12 text-gray-300"
            >
              <path
                d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Z"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
            <button
              type="button"
              className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50"
            >
              Change
            </button>
          </div>
        </div>

        <div className="col-span-full">
          <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
            Cover photo
          </label>
          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
            <div className="text-center">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="mx-auto size-12 text-gray-300"
              ></svg>
               <path
                  d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6Z"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              

              <div className="mt-4 flex text-sm/6 text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md bg-transparent font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  <span>Upload a file</span>
                  <input id="file-upload" type="file" className="sr-only" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>

              <p className="text-xs/5 text-gray-600">
                PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
 <div className="mt-6 flex items-center justify-end gap-x-6">
      <button type="button" className="text-sm/6 font-semibold text-gray-900">
        Cancel
      </button>
      <button
        type="submit"
        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Save
      </button>
    </div>
  </div>
</form>
      )}
    </Layout>
  )
}
