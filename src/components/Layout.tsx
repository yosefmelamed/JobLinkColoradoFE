import Link from 'next/link'
import React, { useEffect, useState } from 'react'

function parseJwt(token: string | null) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(decodeURIComponent(atob(payload).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join('')))
    return decoded
  } catch (e) {
    return null
  }
}

export const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [isEmployer, setIsEmployer] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token')
    if (!token) { setIsAuthenticated(false); setIsEmployer(false); return }
    setIsAuthenticated(true)
    const payload: any = parseJwt(token)
    setIsEmployer(payload?.role === 'EMPLOYER')
  }, [])
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Job Board</h1>
          <nav className="space-x-4">
            <Link href="/jobs" className="text-gray-700">Jobs</Link>
            {isAuthenticated && isEmployer && <Link href="/jobs/create" className="text-green-600">Create Job</Link>}
            <Link href="/companies" className="text-gray-700">Companies</Link>
            <Link href="/profiles" className="text-gray-700">Profiles</Link>
            {!isAuthenticated && <>
              <Link href="/auth/signup" className="text-blue-600">Sign up</Link>
              <Link href="/auth/login" className="text-blue-600">Log in</Link>
            </>}
            {isAuthenticated && (
              <button
                onClick={() => { if (typeof window !== 'undefined') { localStorage.removeItem('token'); window.location.reload(); } }}
                className="text-red-500 ml-2"
              >
                Logout
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-4xl mx-auto p-4">{children}</main>
      <footer className="bg-white border-t mt-8">
        <div className="max-w-4xl mx-auto p-4 text-sm text-gray-500">© Job Board</div>
      </footer>
    </div>
  )
}

export default Layout;
