'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_URLS = {
    Facebook: `https://www.facebook.com/v22.0/dialog/oauth`,
    Instagram: '/auth/instagram',
    Twitter: '/auth/twitter',
    LinkedIn: '/auth/linkedin'
};

interface SocialAccounts {
    Instagram: string;
    Facebook: string;
    Twitter: string;
    LinkedIn: string;
}

const SocialMediaDiagnostic = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [socialAccounts, setSocialAccounts] = useState<SocialAccounts>({
        Instagram: '',
        Facebook: '',
        Twitter: '',
        LinkedIn: ''
    });

    useEffect(() => {
        const fetchSocialAccounts = async () => {
            try {
                const response = await fetch('/api/socialMediaDiagnostics');
                if (!response.ok) throw new Error('Failed to fetch social accounts');
                const data = await response.json();
                if (data.socialAccounts) {
                    setSocialAccounts(data.socialAccounts);
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to fetch social accounts';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSocialAccounts();
    }, []);

    const handleAuthRedirect = async (platform: keyof typeof AUTH_URLS) => {
        try {
            setIsLoading(true);

            if (platform === 'Facebook') {
                const params = new URLSearchParams({
                    client_id: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!,
                    redirect_uri: `${window.location.origin}/api/auth/callback/facebook`,
                    scope: 'email,pages_show_list,instagram_basic,instagram_manage_insights',
                    response_type: 'code'
                });

                window.location.href = `${AUTH_URLS.Facebook}?${params.toString()}`;
                return;
            }

            // ... handle other platforms
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Authentication failed');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    const hasConnectedAccounts = Object.values(socialAccounts).some(account => account && account !== 'pending');

    return (
        <div className="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-white">
                    Manage Your Business Social Media Accounts
                </h1>

                <div className="grid grid-cols-1 gap-4">
                    {Object.entries(socialAccounts).map(([platform, username]) => (
                        <div
                            key={platform}
                            className="p-4 rounded-lg bg-gray-700 flex justify-between items-center"
                        >
                            <span className="text-white font-medium">{platform}</span>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-300">
                                    {username 
                                        ? username === 'pending' 
                                            ? 'Connecting...' 
                                            : `Connected as ${username}`
                                        : 'Not Connected'
                                    }
                                </span>
                                <button
                                    onClick={() => handleAuthRedirect(platform as keyof typeof AUTH_URLS)}
                                    disabled={username === 'pending'}
                                    className={`px-4 py-2 rounded ${
                                        username
                                            ? username === 'pending'
                                                ? 'bg-gray-500 cursor-not-allowed'
                                                : 'bg-green-600 hover:bg-green-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    } text-white text-sm transition-colors`}
                                >
                                    {username
                                        ? username === 'pending'
                                            ? 'Connecting...'
                                            : 'Reconnect'
                                        : 'Connect Account'
                                    }
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => router.push('/analytics')}
                    disabled={!hasConnectedAccounts}
                    className={`w-full mt-8 p-3 rounded-lg transition-colors duration-200
                             text-white font-medium ${
                                 hasConnectedAccounts 
                                     ? 'bg-blue-600 hover:bg-blue-700' 
                                     : 'bg-gray-800 cursor-not-allowed'
                             }`}
                >
                    {hasConnectedAccounts 
                        ? 'Continue to Analytics' 
                        : 'Connect at least one account to proceed'}
                </button>
            </div>
        </div>
    );
};

export default SocialMediaDiagnostic;