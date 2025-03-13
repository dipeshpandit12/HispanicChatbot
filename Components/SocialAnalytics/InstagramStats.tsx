'use client';

import SocialStatsCard from './SocialStatsCard';

interface InstagramStatsData {
  followers_count: number;
  media_count: number;
}

interface InstagramStatsProps {
  data: InstagramStatsData;
}

export default function InstagramStats({ data }: InstagramStatsProps) {
  if (!data) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>No Instagram business account connected</p>
      </div>
    );
  }

  return (
    <SocialStatsCard
      title="Instagram Business Account"
      stats={[
        {
          label: 'Followers',
          value: data.followers_count,
          icon: 'users'
        },
        {
          label: 'Total Posts',
          value: data.media_count,
          icon: 'image'
        }
      ]}
      theme="purple"
    />
  );
}