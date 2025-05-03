// 'use client'

// import { useState } from 'react'
// import Card from '@/components/Card'
// import Button from '@/components/Button'
// import { useRouter } from 'next/navigation'
// import axios from 'axios'

// export default function SignupForm() {
//   const [form, setForm] = useState({ username: '', email: '', password: '' })
//   const [error, setError] = useState('')
//   const [success, setSuccess] = useState('')
//   const router = useRouter()

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setForm({ ...form, [e.target.name]: e.target.value })
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError('')
//     setSuccess('')

//     try {
//       const res = await axios.post('/api/auth/signup', form)

//       if (res.status === 201) {
//         setSuccess(res.data.message || 'Signup successful')
//         setForm({ username: '', email: '', password: '' })

//         // Redirect to signin page after success
//         router.push('/signin')
//       }
//     } catch (err: any) {
//       setError(err.response?.data?.message || 'Something went wrong.')
//     }
//   }

//   return (
//     <form onSubmit={handleSubmit} className="flex flex-col items-center">
//       <Card
//         label="Username"
//         name="username"
//         type="text"
//         placeholder="John"
//         value={form.username}
//         onChange={handleChange}
//       />
//       <Card
//         label="Email address"
//         name="email"
//         type="email"
//         placeholder="xyz@gmail.com"
//         value={form.email}
//         onChange={handleChange}
//       />
//       <Card
//         label="Password"
//         name="password"
//         type="password"
//         placeholder="Enter the password"
//         value={form.password}
//         onChange={handleChange}
//       />
//       <Button text="Sign up" type="submit" />

//       {error && <p className="text-red-500 mt-2">{error}</p>}
//       {success && <p className="text-green-500 mt-2">{success}</p>}
//     </form>
//   )
// }
'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import axios from 'axios'

export default function SignupForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState({ error: '', success: '' })

  // Universal onChange handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // useEffect to detect form changes
  useEffect(() => {
    console.log("Form updated:", formData)
  }, [formData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ error: '', success: '' })

    try {
      const res = await axios.post('/api/auth/signup', formData)

      if (res.status === 201) {
        setStatus({ success: res.data.message || 'Signup successful!', error: '' })
        setFormData({ username: '', email: '', password: '' })
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
        label="Username"
        name="username"
        type="text"
        placeholder="John"
        value={formData.username}
        onChange={handleChange}
      />
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
      <Button text={loading ? "Signing up..." : "Sign up"} type="submit" />

      {status.error && <p className="text-red-500 mt-2">{status.error}</p>}
      {status.success && <p className="text-green-500 mt-2">{status.success}</p>}
    </form>
  )
}
