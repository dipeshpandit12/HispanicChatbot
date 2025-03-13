'use client';

interface FacebookPage {
  id: string;
  name: string;
  followers_count: number;
  fan_count: number;
}

interface FacebookStatsProps {
  data: FacebookPage[];
}

export default function FacebookStats({ data }: FacebookStatsProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        <p>No Facebook pages found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((page) => (
        <div 
          key={page.id}
          className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {page.name}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Followers</p>
              <p className="text-2xl font-bold text-blue-600">
                {page.followers_count.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Page Likes</p>
              <p className="text-2xl font-bold text-blue-600">
                {page.fan_count.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}