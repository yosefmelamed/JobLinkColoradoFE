import Link from 'next/link'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Welcome to the Job Board</h2>
      <p className="mb-4">This frontend is scaffolded to work with your backend.</p>
      <div className="space-x-4">
        <Link href="/auth/signup" className="px-4 py-2 bg-blue-600 text-white rounded">Sign up</Link>
        <Link href="/auth/login" className="px-4 py-2 bg-gray-200 rounded">Log in</Link>
      </div>
    </Layout>
  )
}
