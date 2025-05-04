'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { useState, useEffect, useRef } from 'react'
import LibrarySidebar from './sidepanal'

export default function Herosection() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Handle logout
  const handleLogout = async () => {
    await logout()
    setDropdownOpen(false)
    router.refresh()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      if (dropdownRef.current && !(dropdownRef.current as HTMLElement).contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownRef])

  // Listen for login events and refresh the page
  useEffect(() => {
    const handleAuthChange = () => {
      router.refresh()
    }

    window.addEventListener('storage', handleAuthChange)

    return () => {
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [router])

  const getInitial = (name: string) => name?.charAt(0).toUpperCase() || 'U'

  console.log('User in HeroSection:', user)

  return (
    <div className="w-full h-srceen bg-black text-white">
      <nav className="flex items-center justify-between px-6 py-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <Image src="/Spotify_White.png" width={40} height={40} alt="Spotify logo" />
          <Image src="/home.png" width={40} height={40} alt="Home icon" />
          <div className="flex items-center bg-neutral-800 px-4 py-2 rounded-full w-[400px]">
            <Image
              src="/search-interface-symbol.png"
              width={20}
              height={20}
              alt="Search icon"
              className="mr-2"
            />
            <input
              type="text"
              placeholder="What do you want to play?"
              className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 text-sm text-gray-300">
          <a href="#" className="hover:text-white transition duration-200">Premium</a>
          <a href="#" className="hover:text-white transition duration-200">Support</a>
          <a href="#" className="hover:text-white transition duration-200">Download</a>
          <div className="h-4 border-l border-gray-500 mx-2"></div>
          <a href="#" className="hover:text-white transition duration-200">Install App</a>

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-neutral-800 animate-pulse"></div>
          ) : !user ? (
            <>
              <Link href="/signup" className="hover:text-white transition duration-200">Sign up</Link>
              <Link href="/signin">
                <button className="bg-white text-black px-6 py-2 font-bold rounded-full hover:scale-105 transition duration-200">
                  Log in
                </button>
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-2" ref={dropdownRef}>
              <div 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 cursor-pointer bg-neutral-800 px-2 py-1 rounded-full hover:bg-neutral-700 transition duration-200"
              >
                <div className="bg-green-500 w-8 h-8 rounded-full flex items-center justify-center text-black font-bold">
                  {getInitial(user.username)}
                </div>
                <span className="font-medium pr-1">{user.username}</span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-4 top-16 w-56 bg-neutral-800 rounded-md shadow-lg overflow-hidden z-50 border border-neutral-700 transform origin-top-right transition-transform duration-200">
                  <div className="py-1">
                    <Link href="/account" className="flex items-center px-4 py-3 text-sm hover:bg-neutral-700 transition duration-150">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Account
                    </Link>
                    <Link href="/profile" className="flex items-center px-4 py-3 text-sm hover:bg-neutral-700 transition duration-150">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Profile
                    </Link>
                    <Link href="/settings" className="flex items-center px-4 py-3 text-sm hover:bg-neutral-700 transition duration-150">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                    <div className="border-t border-neutral-700 my-1"></div>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center px-4 py-3 text-sm text-red-400 hover:bg-neutral-700 transition duration-150 w-full text-left"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
      <LibrarySidebar />
    </div>
  )
}
