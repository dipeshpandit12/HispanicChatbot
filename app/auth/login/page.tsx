'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import LoginForm from '@/Components/LoginForm'

// Message component for returning from Canvas
const CanvasReturnMessage = () => {
  const searchParams = useSearchParams()
  const returnFromCanvas = searchParams.get('returnFromCanvas') === 'true'
  
  if (!returnFromCanvas) return null
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 mb-6 rounded-lg">
      Your session has expired. Please log in again to continue your chat session from Canvas.
    </div>
  )
}

// Main Login Page Component with SearchParams support
export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F1EE] p-4">
      <div className="w-full max-w-md">
        {/* The CanvasReturnMessage needs to be inside the Suspense boundary 
            since it uses useSearchParams */}
        <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
          <CanvasReturnMessage />
          <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-[#501214]">
            <h1 className="text-3xl font-bold text-[#501214] mb-6 text-center">Login</h1>
            <LoginForm />
          </div>
        </Suspense>
      </div>
    </div>
  )
}