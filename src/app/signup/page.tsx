import Image from 'next/image'
import Link from 'next/link'
import SignupForm from '@/components/SignupForm'
import { Metadata } from 'next'
import CustomOAuthSignIn from '@/components/OAuht'

export const metadata: Metadata = {
  title: 'Signup - Listenify',
  description: 'Create your account to start listening to your favourite music for free.',
  keywords: ['music', 'signup', 'ai music', 'spotify clone', 'Listenify'],
}

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center  justify-center w-full mt-4">
      <div className="mt-8 flex justify-center">
        <Image src="/Spotify_White.png" width={50} height={50} alt="spotify logo" className="mix-blend-color-dodge" />
      </div>
      <div className="flex flex-col justify-center w-[350px] py-2 mt-6 text-center gap-y-4 font-bold font-sans text-5xl">
        Sign up to <span>start listening</span>
      </div>
      <SignupForm />
      <div className="w-[350] mt-2">
        <Link className="underline ml-0 font-sans text-[#1ED760]" href="/signup/mobile">
          Use phone number instead
        </Link>
      </div>
      <div className="my-8 h-[1px] w-[350px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      <div className='flex flex-row mt-4 border rounded-4xl justify-between p-4 w-[350px]'>
        <Image 
        src="/google.svg"
        width={30}
        height={30}
        alt='google image'
        className=''
        />
        <CustomOAuthSignIn />
      </div>
      <div className='flex flex-row mt-4 border rounded-4xl text-center  font-bold justify-between p-4 w-[350px]'>
        <Image 
        src="/facebook.svg"
        width={30}
        height={30}
        alt='google image'
        className=''
        />
        <span className='mr-18'>Sign Up with Facebook</span>
      </div>
      <div className='flex flex-row mt-4 border rounded-4xl text-center font-bold justify-between p-4 w-[350px]'>
        <Image 
        src="/apple.svg"
        width={30}
        height={30}
        alt='google image'
        className=''
        />
        <span className='mr-18'>Sign Up with Apple</span>
      </div>
      <div className="my-8 h-[1px] w-[350px] bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
      <div>
        Already have an account? <span className='underline'><Link href={"/signin"}>Log in here</Link></span>.
      </div>
      <div className='w-[350px] font-light text-center text-sm'>
        This site is protected by reCAPTCHA and the Google
        <span className='underline'> Privacy Policy</span> and <span className="underline">Terms of Service</span>apply.
      </div>
    </div>
    // <SignupForm />
  )
}
