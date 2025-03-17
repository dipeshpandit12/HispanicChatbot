'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Alert from '@/Components/Alert';

interface Problem {
  _id: string;
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string; // Explicitly set the background color
}

const IssuesPage = () => {
  const [problems, setProblems] = useState<Problem[]>([
    {
      _id: '1',
      id: 'feedback',
      title: 'Reward Customer Feedback',
      description: 'Encourage and reward customer reviews to build credibility.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>',
      color: '#EBBA45',
    },
    {
      _id: '2',
      id: 'website',
      title: 'Get Website',
      description: 'Build your online presence with a professional website.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9-3-9m-9 9a9 9 0 019-9"/></svg>',
      color: '#007096',
    },
    {
      _id: '3',
      id: 'content',
      title: 'Create Content',
      description: 'Develop engaging social media content that connects with your audience.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>',
      color: '#266725',
    },
    {
      _id: '4',
      id: 'story',
      title: 'Share Your Story',
      description: 'Connect with your audience by sharing your business journey.',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>',
      color: '#EB2E47',
    },
  ]);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EE] font-sans flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-[#F5F1EE] font-sans">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
          Business Issues and Strategies
        </h1>
        <p className="mb-12 text-center text-lg text-gray-700">
          Select an issue to explore strategies and get personalized guidance from our AI assistant.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem) => (
            <Link
              href={`/pages/resourcesPage?id=${problem.title}`}
              key={problem.title}
              className="group block"
            >
              <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all">
                <div
                  className="mb-4 inline-flex items-center justify-center rounded-full p-4"
                  style={{ backgroundColor: problem.color }}
                >
                  <div
                    className="text-white"
                    dangerouslySetInnerHTML={{ __html: problem.icon }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">{problem.title}</h3>
                <p className="mt-2 text-gray-600">{problem.description}</p>
                <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
                  Get Guidance
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default IssuesPage;