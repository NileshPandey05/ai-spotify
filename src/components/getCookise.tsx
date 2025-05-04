import { cookies } from "next/headers";
import { createContext, useContext, useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'

type TokenPayload = {
    id: string
    email: string
    username?: string
}

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
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: async () => {},
  checkAuthStatus: () => {},
})

export const useAuth = () => useContext(AuthContext)

const checkAuthStatus = async () => {
    
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    
    console.log(token) // Debugging message
    console.log('Token from cookies:', token) // Debugging token

    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token)
        console.log('Decoded token:', decoded) // Debugging decoded token
        const userInfo = {
          id: decoded.id,
          email: decoded.email,
          username: decoded.username || decoded.email.split('@')[0],
        }
        
        console.log('User info set in AuthProvider:', userInfo) // Debugging user info
      } catch (err) {
        console.error('Error decoding token:', err)
        
      }
    } else {
      console.log('No token found')

    }
  }
export { checkAuthStatus }