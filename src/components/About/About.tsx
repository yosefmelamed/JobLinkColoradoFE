import React from 'react'
import Link from 'next/link'
import  styles from "./About.module.css"
import { useEffect, useState } from 'react'
import { api } from '../../utils/api'

export default function About() {
  type Job = { id: string;

  // Basic Info
  title: string;
  description?: string;

  // Company
  company?: {
    name?: string;
  };

  // Location / Work Info
  location?: string;
  employmentType?: string;   // e.g. Full-time, Part-time
  remoteType?: string;       // e.g. Remote, Hybrid, On-site

  // Salary
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;   // e.g. USD, EUR

  // Details
  responsibilities?: string;
  requirements?: string;
  benefits?: string;

  // Application
  applicationUrl?: string;
  closingDate?: string;      // ISO string (recommended)

  // Metadata
  createdAt?: string;        // ISO string }
}
 
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
    <>
     <section id="about" className={styles.about}>
        <div className="job-container text-center py-6">
          <h1 className="text-5xl font-extrabold mb-4">Welcome to Job Link</h1>
          <p className="text-lg text-light grid justify-center">The gateway for talented professionals and thoughtful employers. 
            <span> Explore roles, post opportunities, and connect faster with high-quality matches.</span></p>

          <div className="flex justify-center gap-4 my-6 mb-12">
            <Link href="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        </div>
      </section>
      <section className="container py-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Jobs</h2>
        <div className="job_container">
          {recent.length === 0 && <div className="text-sm text-gray-600">No recent jobs</div>}
          {recent.map(j => (
            
   <div key={j.id} className="job_item">
            <div>
              <h3 className="text-lg font-medium">{j.title} <span className="text-sm text-gray-500">(Your company)</span></h3>
              <div className="text-sm text-gray-600">{j.company?.name}</div>
              {j.location && <div className="text-sm text-gray-600">Location: {j.location}</div>}
              <div className="mt-2 text-sm">{j.description ? j.description.substring(0, 400) : 'No description'}</div>
              <div className="mt-2 text-sm text-gray-700">
                {j.employmentType && <span className="mr-3">Type: {j.employmentType}</span>}
                {j.remoteType && <span className="mr-3">Work: {j.remoteType}</span>}
                {(j.salaryMin || j.salaryMax) && (
                  <span className="mr-3">Salary: {j.salaryCurrency ?? ''} {j.salaryMin ?? ''}{j.salaryMin && j.salaryMax ? ' - ' + j.salaryMax : ''}</span>
                )}
              </div>
              {j.responsibilities && <div className="mt-2"><strong>Responsibilities:</strong> <div className="text-sm">{j.responsibilities}</div></div>}
              {j.requirements && <div className="mt-2"><strong>Requirements:</strong> <div className="text-sm">{j.requirements}</div></div>}
              {j.benefits && <div className="mt-2"><strong>Benefits:</strong> <div className="text-sm">{j.benefits}</div></div>}
              {j.applicationUrl && (
                <div className="mt-2"><a href={j.applicationUrl} className="text-blue-600">Apply: {j.applicationUrl}</a></div>
              )}
              {j.closingDate && (
                <div className="mt-2 text-sm text-gray-600">Closes: {new Date(j.closingDate).toLocaleDateString()}</div>
              )}
              </div>
          
          </div>
          ))}
          </div>
        </section>
      
      <div className="container text-center py-6">
        <div className="text-center mb-8">
          <h5 className="text-sm text-light mb-8">Who we are</h5>
          <h2 className="text-3xl font-semibold">Connecting Talent & Opportunity</h2>
          <p className="grid py-6">
            <span>A polished, simple job board where employees find meaningful employers — and employers discover high-quality candidates.</span> <span>We focus on clarity, trust, and speed so hiring and job-seeking are a pleasure.</span></p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-medium mb-3">For Job Seekers</h3>
            <p className="text-light mb-4">Browse curated openings, save favorites, and apply with confidence. Filter by company, location, role type, salary range and more. Profiles are designed to help you highlight what matters most to employers.</p>
            <ul className="text-sm text-light list-disc pl-5 mb-4">
              <li>Personalized job recommendations</li>
              <li>One-click apply and application tracking</li>
              <li>Privacy controls and resume helpers</li>
            </ul>
            <Link href="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3">For Employers</h3>
            <p className="text-light mb-4">Post refined job listings, review applicants, and manage openings with an employer-friendly dashboard. Attract talent with clear job cards and company profiles.</p>
            <ul className="text-sm text-light list-disc pl-5 mb-4">
              <li>Attractive job templates that convert</li>
              <li>Applicant filtering and message tools</li>
              <li>Company pages to showcase your culture</li>
            </ul>
            <Link href="/companies" className="btn">Find Talent</Link>
          </div>
        </div>

        <div className="mt-10 bg-var p-8 rounded">
          <h4 className="text-lg font-medium mb-2">Our approach</h4>
          <p className="text-light">We believe hiring should be respectful and effective. Clear job descriptions, fair salary signals, and easy communication help both sides move quickly to great matches.</p>
        </div>
          
      </div>

            
    </>
          
  )
}
