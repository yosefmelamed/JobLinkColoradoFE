import React from 'react'
import Link from 'next/link'
import  styles from "./About.module.css"
import { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
 
  const [recentJobs, setRecentJobs] = useState<Job[]>([])
  const [recentCompanyListings, setRecentCompanyListings] = useState<Job[]>([])
  
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
        setRecentJobs(sorted.slice(0, 10))
      }).catch(() => {})
      return () => { mounted = false }
    }, [])

    useEffect(() => {
      let mounted = true
      api.get('/companies').then(r => {
        if (!mounted) return
        const all: Job[] = r.data || []
        // sort newest first by createdAt if present, otherwise keep order
        const sorted = all.slice().sort((a, b) => {
          if (a.createdAt && b.createdAt) return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          return 0
        })
        setRecentCompanyListings(sorted.slice(0, 10))
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

          <div className="flex justify-center gap-4 my-6 mb-6">
            <Link href="/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        </div>
      </section>

        <div className="container text-center py-6">
        <div className="text-center mb-6">
          <h5 className="text-lg font-medium mb-2">Who we are</h5>
          <h2 className="text-3xl font-semibold">Connecting Talent & Opportunity</h2>
          <p className="grid py-6">
            <span>A polished, simple job board where employees find meaningful employers — and employers discover high-quality candidates.</span> <span>We focus on clarity, trust, and speed so hiring and job-seeking are a pleasure.</span></p>
        </div>


        <div className="mb-6 bg-var p-8 rounded">
          <h5 className="text-lg font-medium mb-2">Our approach</h5>
          <p className="text-light">We believe hiring should be respectful and effective. Clear job descriptions, fair salary signals, and easy communication help both sides move quickly to great matches.</p>
        </div>
        </div>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Jobs</h2>

<Swiper
  modules={[Pagination]}
  spaceBetween={40}
  slidesPerView={3}
  pagination={{ clickable: true }}
  breakpoints={{
    0: {
      slidesPerView: 1, // mobile
    },
    640: {
      slidesPerView: 1, // small screens
    },
    768: {
      slidesPerView: 2, // md
    },
    1024: {
      slidesPerView: 3, // lg
    }
  }}
  className="container job-container"
>
  {recentJobs.length === 0 && (
    <SwiperSlide>
      <div className="text-sm text-gray-600">No recent jobs</div>
    </SwiperSlide>
  )}

  {recentJobs.map((j) => (
    <SwiperSlide key={j.id} className="job_item">
      <div>
        <h3 className="text-lg font-medium">
          {j.title}
          <span className="text-sm text-gray-500"> (Your company)</span>
        </h3>

        <div className="text-sm text-gray-600">
          {j.company?.name}
        </div>

        {j.location && (
          <div className="text-sm text-gray-600">
            Location: {j.location}
          </div>
        )}

        <div className="mt-2 text-sm">
          {j.description
            ? j.description.substring(0, 400)
            : "No description"}
        </div>

        <div className="mt-2 text-sm text-gray-700">
          {j.employmentType && (
            <span className="mr-3">
              Type: {j.employmentType}
            </span>
          )}

          {j.remoteType && (
            <span className="mr-3">
              Work: {j.remoteType}
            </span>
          )}

          {(j.salaryMin || j.salaryMax) && (
            <span className="mr-3">
              Salary: {j.salaryCurrency ?? ""}{" "}
              {j.salaryMin ?? ""}
              {j.salaryMin && j.salaryMax
                ? ` - ${j.salaryMax}`
                : ""}
            </span>
          )}
        </div>

        {j.responsibilities && (
          <div className="mt-2">
            <strong>Responsibilities:</strong>
            <div className="text-sm">{j.responsibilities}</div>
          </div>
        )}

        {j.requirements && (
          <div className="mt-2">
            <strong>Requirements:</strong>
            <div className="text-sm">{j.requirements}</div>
          </div>
        )}

        {j.benefits && (
          <div className="mt-2">
            <strong>Benefits:</strong>
            <div className="text-sm">{j.benefits}</div>
          </div>
        )}

        {j.applicationUrl && (
          <div className="mt-2">
            <a
              href={j.applicationUrl}
              className="text-blue-600"
              target="_blank"
              rel="noopener noreferrer"
            >
              Apply
            </a>
          </div>
        )}

        {j.closingDate && (
          <div className="mt-2 text-sm text-gray-600">
            Closes:{" "}
            {new Date(j.closingDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </SwiperSlide>
  ))}
</Swiper>
        </section>
        <section>
<h2 className="text-2xl font-semibold mb-4">Recent Company Listings</h2>
       <Swiper
  modules={[Pagination]}
  spaceBetween={40}
   breakpoints={{
    0: {
      slidesPerView: 1, // mobile
    },
    640: {
      slidesPerView: 1, // small screens
    },
    768: {
      slidesPerView: 2, // md
    },
    1024: {
      slidesPerView: 3, // lg
    }
  }}
  pagination={{ clickable: true }}
  className="container job-container"
>
  {recentCompanyListings.length === 0 && (
    <SwiperSlide>
      <div className="text-sm text-gray-600">No recent company listings</div>
    </SwiperSlide>
  )}     {recentCompanyListings.map(c => (
            
   <SwiperSlide key={c.id}>
            <div className="job_item">
              <h3 className="text-lg font-medium">{c.title} <span className="text-sm text-gray-500">(Your company)</span></h3>
              <div className="text-sm text-gray-600">{c.company?.name}</div>
              {c.location && <div className="text-sm text-gray-600">Location: {c.location}</div>}
              <div className="mt-2 text-sm">{c.description ? c.description.substring(0, 400) : 'No description'}</div>
              <div className="mt-2 text-sm text-gray-700">
                {c.employmentType && <span className="mr-3">Type: {c.employmentType}</span>}
                {c.remoteType && <span className="mr-3">Work: {c.remoteType}</span>}
                {(c.salaryMin || c.salaryMax) && (
                  <span className="mr-3">Salary: {c.salaryCurrency ?? ''} {c.salaryMin ?? ''}{c.salaryMin && c.salaryMax ? ' - ' + c.salaryMax : ''}</span>
                )}
              </div>
              {c.responsibilities && <div className="mt-2"><strong>Responsibilities:</strong> <div className="text-sm">{c.responsibilities}</div></div>}
              {c.requirements && <div className="mt-2"><strong>Requirements:</strong> <div className="text-sm">{c.requirements}</div></div>}
              {c.benefits && <div className="mt-2"><strong>Benefits:</strong> <div className="text-sm">{c.benefits}</div></div>}
              {c.applicationUrl && (
                <div className="mt-2"><a href={c.applicationUrl} className="text-blue-600">Apply: {c.applicationUrl}</a></div>
              )}
              {c.closingDate && (
                <div className="mt-2 text-sm text-gray-600">Closes: {new Date(c.closingDate).toLocaleDateString()}</div>
              )}
              </div>
          </SwiperSlide>
        ))}
</Swiper>
</section>
          
        
      
    
          
    

            
    </>
          
  )
}
