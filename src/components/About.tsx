import React from 'react'
import Link from 'next/link'

export default function About() {
  return (
    <section id="about" className="my-12">
      <div className="container">
        <div className="text-center mb-8">
          <h5 className="text-sm text-light">Who we are</h5>
          <h2 className="text-3xl font-semibold">Connecting Talent & Opportunity</h2>
          <p className="mt-3 text-light max-w-2xl mx-auto">A polished, simple job board where employees find meaningful employers — and employers discover high-quality candidates. We focus on clarity, trust, and speed so hiring and job-seeking are a pleasure.</p>
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
    </section>
  )
}
