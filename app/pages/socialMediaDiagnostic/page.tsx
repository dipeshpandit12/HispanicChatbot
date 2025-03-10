'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SocialMediaDiagnostic = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-white">
                    Connect Your Business Social Media Accounts
                </h1>
                <button
                    onClick={() => setIsLoading(true)}
                    disabled={isLoading}
                    className="w-full mb-6 p-3 rounded-lg transition-colors duration-200
                             text-white font-medium bg-blue-600 hover:bg-blue-700"
                >
                    {isLoading ? 'Checking accounts...' : 'Check Connected Accounts'}
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {['Instagram', 'Facebook', 'Twitter', 'LinkedIn'].map((platform) => (
                        <button
                            key={platform}
                            onClick={() => setIsLoading(true)}
                            disabled={isLoading}
                            className="w-full p-3 rounded-lg transition-colors duration-200
                                     text-white font-medium bg-gray-700 hover:bg-gray-600
                                     flex items-center justify-center"
                        >
                            {`Connect ${platform}`}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => router.push('/pages/analytics')}
                    disabled={isLoading}
                    className="w-full mt-8 p-3 rounded-lg transition-colors duration-200
                             text-white font-medium bg-gray-800"
                >
                    Connect at least one account to proceed
                </button>
            </div>
        </div>
    );
};

export default SocialMediaDiagnostic;