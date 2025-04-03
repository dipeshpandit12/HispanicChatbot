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
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning'
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('/api/issues');
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        const data = await response.json();
        setProblems(data.problems.map((problem: Problem, index: number) => ({
          ...problem,
          color: ['#EBBA45', '#EB2E47', '#266725', '#007096'][index % 4] // Assign colors in sequence
        })));
        setAlert({
          isOpen: true,
          message: 'Successfully loaded business issues',
          type: 'success'
        });
      } catch (err) {
        setAlert({
          isOpen: true,
          message: err instanceof Error ? err.message : 'An unknown error occurred',
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const handleAlertClose = () => {
    setAlert(prev => ({ ...prev, isOpen: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EE] font-sans flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-[#F5F1EE] font-sans">
      <Alert
        isOpen={alert.isOpen}
        message={alert.message}
        type={alert.type}
        onClose={handleAlertClose}
      />

      <div className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
          Growth Strategies
        </h1>
        <p className="mb-12 text-center text-lg text-gray-700">
          Select the options to grow your business with personalized AI assistant.
        </p>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem) => (
            <Link href={`/pages/resourcesPage?id=${problem.title}`} key={problem.title} className="group block">
              <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all">
                <div
                  className="mb-4 inline-flex items-center justify-center rounded-full p-4"
                  style={{ backgroundColor: problem.color }}
                >
                  {problem.icon ? (
                    <div
                      className="text-white"
                      dangerouslySetInnerHTML={{ __html: problem.icon }}
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gray-300 rounded-full" />
                  )}
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
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