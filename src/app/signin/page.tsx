import Image from "next/image"
import Link from "next/link"
import CustomOAuthSignIn from '@/components/OAuht'
import SigninForm from "@/components/SigninForm"

export default function Signin(){
    
    return (
        <div className="flex flex-col items-center  justify-center w-full mt-4">
          <div className="mt-8 flex justify-center">
            <Image src="/Spotify_White.png" width={50} height={50} alt="spotify logo" className="mix-blend-color-dodge" />
          </div>
          <div className="flex flex-col justify-center w-[350px] py-2 mt-6 text-center gap-y-4 font-bold font-sans text-4xl">
            Log in to Spotify
          </div>
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
          <SigninForm />
          <div className="mt-4">
            Don't have an account?<span className='underline'><Link href={"/signup"}> Sign up for Spotify</Link></span>.
          </div>
          <div className="w-full mt-6 bg-black p-6 text-center ">
          This site is protected by reCAPTCHA and the Google <span className="underline">Privacy Policy</span> and <span className="underline">Terms of Service</span> apply.
          </div>
        </div>

      )
}