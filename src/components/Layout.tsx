import Link from 'next/link'
import React, { useEffect, useState, useRef } from 'react'

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

export const Layout: React.FC<{children: React.ReactNode; showHeader?: boolean}> = ({children, showHeader = true}) => {
  const [isEmployer, setIsEmployer] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const token = localStorage.getItem('token')
    if (!token) { setIsAuthenticated(false); setIsEmployer(false); return }
    setIsAuthenticated(true)
    const payload: any = parseJwt(token)
    setIsEmployer(payload?.role === 'EMPLOYER')
  }, [])

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!navRef.current) return
      if (!(e.target instanceof Node)) return
      if (!navRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function logout() {
    if (typeof window !== 'undefined') { localStorage.removeItem('token'); window.location.reload() }
  }
  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && (
        <header className="site-header shadow">
          <div className="container px-4 py-4 flex justify-between items-center text-light">
            <h1 className="text-lg font-semibold">Job Link</h1>
            <nav ref={navRef} className="space-x-4 relative flex items-center">
              <Link href="/jobs" className="">Jobs</Link>
              {isAuthenticated && isEmployer && <Link href="/jobs/create" className="text-green-600">Create Job</Link>}
              <Link href="/companies" className="text-gray-700">Companies</Link>
              <div className="ml-4">
                <button aria-label="Account" onClick={() => setMenuOpen(v => !v)} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM6 21v-1a4 4 0 014-4h4a4 4 0 014 4v1" />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="account-buttons absolute right-0 mt-10 w-48 border rounded shadow p-2 z-50">
                    {!isAuthenticated ? (
                      <Link href="/auth/login" className="block px-3 py-2">Sign In</Link>
                    ) : (
                      <>
                        <Link href="/profiles" className="block px-3 py-2 ">Profile</Link>
                        <button onClick={logout} className="w-full text-left px-3 py-2">Logout</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </nav>
          </div>
        </header>
      )}
      <main className="flex-1 container p-4">{children}</main>
      <footer className="bg-white border-t mt-8">
        <div className="container p-4 text-sm text-gray-500">© Job Board</div>
      </footer>
    </div>
  )
}

export default Layout;
