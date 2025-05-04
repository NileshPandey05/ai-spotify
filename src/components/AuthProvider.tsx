'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

// Define our token payload type
type TokenPayload = {
  id: string
  email: string
  username?: string
}

// Define our user type
type User = {
  id: string
  email: string
  username: string
}

// Define our context type
type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (token: string) => void
  logout: () => Promise<void>
  checkAuthStatus: () => void
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: async () => {},
  checkAuthStatus: () => {},
})

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({
  children,
  initialUser,
}: {
  children: React.ReactNode
  initialUser: User | null
}) => {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoading, setIsLoading] = useState(!initialUser)

  // Function to check authentication status
  const checkAuthStatus = async () => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/status', {
        method: 'GET',
        credentials: 'include', // Ensure cookies are sent with the request
      })

      if (response.ok) {
        const userInfo = await response.json()
        setUser(userInfo)
        console.log('User info set in AuthProvider:', userInfo) // Debugging user info
      } else {
        console.log('Failed to fetch user info')
        setUser(null)
      }
    } catch (err) {
      console.error('Error fetching auth status:', err)
      setUser(null)
    }

    setIsLoading(false)
  }

  // Function to handle login
  const login = (token: string) => {
    try {
      const decoded = jwtDecode<TokenPayload>(token)
      setUser({
        id: decoded.id,
        email: decoded.email,
        username: decoded.username || decoded.email.split('@')[0],
      })

      // Save the token in cookies
      Cookies.set('token', token)

      // Trigger event for other tabs
      localStorage.setItem('auth-change', Date.now().toString())
    } catch (err) {
      console.error('Login error:', err)
    }
  }

  // Function to handle logout
  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        // Clear client-side cookie
        Cookies.remove('token')

        // Update state
        setUser(null)

        // Trigger event for other tabs
        localStorage.setItem('auth-change', Date.now().toString())
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    if (!initialUser) {
      checkAuthStatus()
    }
  }, [])

  const value = {
    user,
    isLoading,
    login,
    logout,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider