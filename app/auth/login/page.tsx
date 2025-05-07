

'use client'
import { Suspense } from 'react'
import LoginForm from '@/Components/LoginForm'

// Main Login Page Component
export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
};