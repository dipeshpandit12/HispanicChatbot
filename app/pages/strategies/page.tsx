'use client';


import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Alert from '@/Components/Alert';


interface Problem {
  id: string;
  title: string;
  description: string;
  icon: string;
  colorClasses: string;
  courseurl: string;
}


interface Strategy {
  _id: string;
  problem: Problem;
}


interface ApiResponse {
  stage: string;
  strategies: Strategy[];
}


const StrategiesPage = () => {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    isOpen: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'warning',
  });


  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        const response = await fetch('/api/strategies');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch strategies');
        }
        const data: ApiResponse = await response.json();
        setStrategies(data.strategies);
      } catch (err) {
        setAlert({
          isOpen: true,
          message: err instanceof Error ? err.message : 'An unknown error occurred',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };


    fetchStrategies();
  }, []);


  const handleAlertClose = () => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
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


      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="mb-8 text-center text-4xl font-extrabold text-gray-900">
          Growth Strategies
        </h1>
        <p className="mb-12 text-center text-lg text-gray-700">
          Select the options to grow your business with personalized AI assistant.
        </p>


        {strategies.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-lg shadow">
            <p className="text-gray-600">No strategies available for your business stage.</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {strategies.map((strategy, index) => (
  <Link
    href={strategy.problem.title === 'Create Content' 
      ? 'https://canvas.txstate.edu/courses/2462560/pages/create-content'
      : 'https://canvas.txstate.edu/courses/2462560/pages/understanding-social-media-marketing'
    }
    key={strategy._id}
    className="group block hover:no-underline"
    target="_blank"
    rel="noopener noreferrer"
  >
    <div className="p-6 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all duration-300">
      {/* Icon Container */}
      <div
        className="mb-4 inline-flex items-center justify-center rounded-full p-4"
        style={{
          backgroundColor: index === 0
            ? '#266725' // Dark green for the first icon
            : index === 1
            ? '#007096' // Dark blue for the second icon
            : index === 2
            ? '#EB2E47' // Red for the third icon
            : index === 3
            ? '#EBBA45' // Yellow for the fourth icon
            : '#BFF3FD', // Light blue for others
        }}
      >
        {/* Icon */}
        {strategy.problem.icon && (
          <div
            className="w-6 h-6"
            style={{
              color: '#FFFFFF', // White icon color for contrast
            }}
            dangerouslySetInnerHTML={{ __html: strategy.problem.icon }}
          />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
        {strategy.problem.title || 'Untitled Strategy'}
      </h3>
      <p className="mt-2 text-gray-600">
        {strategy.problem.description || 'No description available'}
      </p>
      <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-700">
        <span>Get Guidance</span>
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
        )}
      </div>
    </div>
  );
};


export default StrategiesPage;
