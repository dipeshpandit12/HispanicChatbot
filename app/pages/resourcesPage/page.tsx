'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

interface Solution {
  id: string;
  title: string;
  description: string;
  longDescription: string; // Added for a longer summary
  link: string;
  type: string;
  thumbnail: string;
  colorClasses: string;
}

const ResourcesPage = () => {
  return (
    <Suspense 
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      }
    >
      <ResourcesContent />
    </Suspense>
  );
};

const ResourcesContent = () => {
  const searchParams = useSearchParams();
  const [solution, setSolution] = useState<Solution | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const problemTitle = searchParams.get('id');

    if (problemTitle) {
      const processQuery = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/resources', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: problemTitle }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch resource');
          }
          setSolution(data.solution);
          setError('');
        } catch (error) {
          console.error('Error processing query:', error);
          setError(error instanceof Error ? error.message : 'An error occurred');
          setSolution(null);
        } finally {
          setLoading(false);
        }
      };

      processQuery();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background font-body pt-24"> {/* Added pt-24 to lower the page */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="mb-8 text-center text-4xl font-heading text-primary">
          Hispanic Business Resources
        </h1>
        <p className="mb-12 text-center text-lg text-secondary">
          Explore these tailored resources to help grow your business and overcome challenges.
          Each solution is carefully curated to provide valuable insights and practical steps.
        </p>

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        )}

        {error && (
          <div className="bg-error-light border border-error text-error px-4 py-3 rounded text-center">
            {error}
          </div>
        )}

        {solution && (
          <ul className="space-y-8">
            <li className="flex items-start space-x-6 bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all">
              <img
                src={solution.thumbnail || '/default-thumbnail.jpg'} // Fallback image
                alt={`${solution.title} thumbnail`}
                className="w-32 h-32 rounded-md object-cover"
              />

              <div className="flex-1">
                {solution.link ? (
                  <a
                    href={solution.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-2xl font-semibold hover:underline text-primary`}
                  >
                    {solution.title}
                  </a>
                ) : (
                  <h2 className={`text-2xl font-semibold text-primary`}>
                    {solution.title}
                  </h2>
                )}

                <p className="mt-2 text-secondary text-lg">{solution.description}</p>
                <p className="mt-4 text-gray-700 text-base">{solution.longDescription}</p> {/* Longer summary */}

                <span className="mt-4 inline-block text-sm font-medium text-gray-500">
                  Type: {solution.type}
                </span>
              </div>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;