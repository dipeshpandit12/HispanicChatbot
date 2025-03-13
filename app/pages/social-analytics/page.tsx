'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FacebookStats from '@/Components/SocialAnalytics/FacebookStats';
import InstagramStats from '@/Components/SocialAnalytics/InstagramStats';

interface Analytics {
  facebook?: {
    data: Array<{
      id: string;
      name: string;
      followers_count: number;
      fan_count: number;
    }>;
  };
  instagram?: {
    followers_count: number;
    media_count: number;
  };
}

export default function SocialAnalyticsPage() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/social/analytics', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();
        setAnalytics(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
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

  const hasNoSocialData = !analytics?.facebook?.data && !analytics?.instagram;

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Social Media Analytics</h1>
          <button
            onClick={() => router.push('/pages/socialMediaDiagnostic')}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Back to Manager
          </button>
        </div>

        {hasNoSocialData ? (
          <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-lg p-6 text-yellow-200">
            <p>No social media accounts connected. Please connect your accounts in the Social Media Manager.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Facebook Stats Component */}
            {analytics?.facebook?.data && (
              <div className="bg-blue-600 rounded-lg overflow-hidden">
                <FacebookStats data={analytics.facebook.data} />
              </div>
            )}

            {/* Instagram Stats Component */}
            {analytics?.instagram && (
              <div className="bg-purple-600 rounded-lg overflow-hidden">
                <InstagramStats data={analytics.instagram} />
              </div>
            )}
          </div>
        )}

        {/* Add Social Media Button */}
        {hasNoSocialData && (
          <button
            onClick={() => router.push('/pages/socialMediaDiagnostic')}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
          >
            Connect Social Media Accounts
          </button>
        )}

        {/* Analytics Summary */}
        {!hasNoSocialData && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Analytics Summary</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400">Total Platforms Connected</p>
                <p className="text-2xl font-bold text-white">
                  {Number(!!analytics?.facebook) + Number(!!analytics?.instagram)}
                </p>
              </div>
              <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400">Total Followers</p>
                <p className="text-2xl font-bold text-white">
                  {(
                    (analytics?.facebook?.data?.[0]?.followers_count || 0) +
                    (analytics?.instagram?.followers_count || 0)
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}