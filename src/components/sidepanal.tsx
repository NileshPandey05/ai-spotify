'use client'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LibrarySidebar() {
  return (
    <div className="w-[350px] ml-4 rounded-xl h-[450px] bg-gray-700 text-white flex flex-col justify-between p-4">
      {/* Top Section */}
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-md font-semibold">Your Library</h2>
          <Plus className="w-4 h-4 cursor-pointer" />
        </div>

        <div className="overflow-y-auto max-h-[220px] pr-1 scrollbar-thin">
          <div className="bg-neutral-800 p-4 rounded-lg mb-2">
            <p className="text-sm font-semibold mb-1">Create your first playlist</p>
            <p className="text-xs text-gray-400 mb-4">It’s easy, we’ll help you</p>
            <Button className="bg-white text-black text-sm px-3 py-1 rounded-full font-semibold hover:scale-105 transition-all">
              Create playlist
            </Button>
          </div>

          <div className="bg-neutral-800 p-4 rounded-lg mb-2">
            <p className="text-sm font-semibold mb-1">Create your first playlist</p>
            <p className="text-xs text-gray-400 mb-4">It’s easy, we’ll help you</p>
            <Button className="bg-white text-black text-sm px-3 py-1 rounded-full font-semibold hover:scale-105 transition-all">
              Create playlist
            </Button>
          </div>

          {/* Add more playlist cards if needed */}
        </div>
      </div>

      {/* Divider */}
      <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

      {/* Bottom Section */}
      <div className="text-xs text-gray-400 space-y-1">
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <a href="#">Legal</a>
          <a href="#">Safety & Privacy Center</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookies</a>
          <a href="#">About Ads</a>
          <a href="#">Accessibility</a>
        </div>
        <div className="mt-4">
          <Button className="text-white bg-black border border-gray-500 text-sm px-3 py-1 rounded-full">
            🌐 English
          </Button>
        </div>
      </div>
    </div>
  )
}
