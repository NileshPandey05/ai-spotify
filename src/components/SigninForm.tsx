'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' // ✅ Import router
import Card from '@/components/Card'
import Button from '@/components/Button'
import axios from 'axios'

export default function SigninForm() {
  const router = useRouter() // ✅ Initialize router

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ error: '', success: '' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  useEffect(() => {
    console.log("Form updated:", formData)
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ error: '', success: '' })

    try {
      const res = await axios.post('/api/auth/signin', formData)

      if (res.status === 200) {
        setStatus({ success: res.data.message || 'Signin successful!', error: '' })
        setFormData({ email: '', password: '' })

        // ✅ Redirect to home page after successful sign-in
        router.push('/')
      }
    } catch (err: any) {
      setStatus({
        success: '',
        error: err.response?.data?.message || 'Something went wrong.'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center">
      <Card
        label="Email address"
        name="email"
        type="email"
        placeholder="xyz@gmail.com"
        value={formData.email}
        onChange={handleChange}
      />
      <Card
        label="Password"
        name="password"
        type="password"
        placeholder="Enter the password"
        value={formData.password}
        onChange={handleChange}
      />
      <Button text={loading ? "Signing in..." : "Sign in"} type="submit" />

      {status.error && <p className="text-red-500 mt-2">{status.error}</p>}
      {status.success && <p className="text-green-500 mt-2">{status.success}</p>}
    </form>
  )
}
