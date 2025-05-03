import Image from 'next/image'
import Link from 'next/link'
import SignupForm from '@/components/SignupForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Signup - Listenify',
  description: 'Create your account to start listening to your favourite music for free.',
  keywords: ['music', 'signup', 'ai music', 'spotify clone', 'Listenify'],
}

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center w-full mt-4">
      <div className="mt-8 flex justify-center">
        <Image src="/Spotify_White.png" width={50} height={50} alt="spotify logo" className="mix-blend-color-dodge" />
      </div>
      <div className="flex flex-col justify-center w-[300px] py-2 mt-6 text-center gap-y-4 font-bold font-sans text-5xl">
        Sign up to <span>start listening</span>
      </div>
      <SignupForm />
      <div className="w-[350] mt-2">
        <Link className="underline ml-0 font-sans text-[#1ED760]" href="/signup/mobile">
          Use phone number instead
        </Link>
      </div>
    </div>
    // <SignupForm />
  )
}
