import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import About from '../components/About'
import { api } from '../utils/api'

type Job = { id: string; title: string; description?: string; company?: { name?: string }; createdAt?: string }

export default function Home() {
  const [recent, setRecent] = useState<Job[]>([])

  useEffect(() => {
    let mounted = true
    api.get('/jobs').then(r => {
      if (!mounted) return
      const all: Job[] = r.data || []
      // sort newest first by createdAt if present, otherwise keep order
      const sorted = all.slice().sort((a, b) => {
        if (a.createdAt && b.createdAt) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        return 0
      })
      setRecent(sorted.slice(0, 10))
    }).catch(() => {})
    return () => { mounted = false }
  }, [])

  return (
    <Layout>
      <main className="relative min-h-[20vh] flex items-center">
        <div className="container text-center py-16">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to Job Link</h1>
          <p className="text-lg text-light max-w-3xl mx-auto mb-8">The gateway for talented professionals and thoughtful employers. Explore roles, post opportunities, and connect faster with high-quality matches.</p>

          <div className="flex justify-center gap-4 my-6 mb-12">
            <Link href="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        </div>
      </main>

      <section className="container py-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Jobs</h2>
        <div className="job_container">
          {recent.length === 0 && <div className="text-sm text-gray-600">No recent jobs</div>}
          {recent.map(j => (
            <div key={j.id} className="job_item">
              <h3 className="text-lg font-medium"><Link href={`/jobs/${j.id}`}>{j.title}</Link></h3>
              <div className="text-sm text-gray-600">{j.company?.name}</div>
              <p className="mt-2 text-sm">{j.description ? j.description.substring(0, 200) : 'No description'}</p>
            </div>
          ))}
        </div>
      </section>

      <About />
    </Layout>
  )
}
