'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

const Login = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })

            if (response.ok) {
                console.log('Login successful')
                router.push('/pages/businessData')

            } else {
                console.error('Login failed')
            }
        } catch (error) {
            console.error('Error during login:', error)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-black p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6">Login</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Sign in
                    </button>
                </form>
                <div className="mt-4 text-sm">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/signup" className="text-blue-600 hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login