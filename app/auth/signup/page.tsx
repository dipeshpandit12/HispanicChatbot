'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Signup = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            });

            if (response.ok) {
                router.push('/auth/login');
            } else {
                console.error('Signup failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-96 border-2 border-[#501214]">
            <h1 className="text-3xl font-bold text-[#501214] mb-6 text-center">Sign Up</h1>
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
                        required
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
                        required
                        className="mt-1 block w-full rounded-lg border-[#AC9155] shadow-sm focus:border-[#AC9155] focus:ring-[#AC9155]"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-[#EB2E47] hover:bg-[#EBBA45] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#266725]"
                >
                    Sign up
                </button>
            </form>
            <div className="mt-6 text-sm text-center text-[#501214]">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-[#EB2E47] hover:text-[#419E69] hover:underline font-medium">
                    Log in
                </Link>
            </div>
        </div>
    )
}

export default Signup