import { useEffect, useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import About from '../components/About/About.tsx' 
import { api } from '../utils/api'


export default function Home() {
 

  return (
    <Layout>
      <About />
    </Layout>
  )
}
