'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'
import GoogleLoginButton from '@/Components/GoogleLogin'
import Alert from '@/Components/Alert'

const Login = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [alertState, setAlertState] = useState({
        isOpen: false,
        message: '',
        type: 'error' as 'success' | 'error' | 'warning'
    })

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful');
                router.push('/pages/businessData');
            } else {
                console.error('Login failed:', data.error);
                setAlertState({
                    isOpen: true,
                    message: data.error || 'Login failed',
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error during login:', error);
            setAlertState({
                isOpen: true,
                message: 'An error occurred during login',
                type: 'error'
            });
        }
    }

    return (
        <>
            <Alert
                isOpen={alertState.isOpen}
                message={alertState.message}
                type={alertState.type}
                onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
            />

            <div className="bg-white p-8 rounded-lg shadow-lg w-96 border-2 border-[#501214]">
                <h1 className="text-3xl font-bold text-[#501214] mb-6 text-center">Login</h1>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#501214]">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-[#AC9155] shadow-sm focus:border-[#AC9155] focus:ring-[#AC9155]"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-[#501214]">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full rounded-lg border-[#AC9155] shadow-sm focus:border-[#AC9155] focus:ring-[#AC9155]"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-[#EB2E47] hover:bg-[#EBBA45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#266725]"
                    >
                        Sign in
                    </button>
                </form>
                <div className="mt-6 flex items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="px-4 text-sm text-[#501214]">Or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <div className="mt-6 flex justify-center">
                    <GoogleLoginButton />
                </div>
                <div className="mt-6 text-sm text-center text-[#501214]">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/signup" className="text-[#EB2E47] hover:text-[#419E69] hover:underline font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Login