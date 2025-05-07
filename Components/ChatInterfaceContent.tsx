'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Problem {
  id: string;
  title: string;
  description: string;
  icon: string;
  colorClasses: string;
}

interface Solution {
  id: string;
  title: string;
  description: string;
  link: string;
  type: string;
  thumbnail: string;
  colorClasses: string;
}

interface ChatData {
  problem?: Problem;
  solution?: Solution;
  issues?: Array<{
    problem: Problem;
    solution: Solution;
  }>;
  sourceInfo?: {
    source: string;
    courseId: string;
  };
}

const ChatInterfaceContent = () => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chatData, setChatData] = useState<ChatData | null>(null);

  // Extract URL parameters
  const source = searchParams.get('source');
  const courseId = searchParams.get('courseId');
  const problemId = searchParams.get('problemId');

  useEffect(() => {
    const fetchChatData = async () => {
      try {
        setLoading(true);
        
        // Build API URL with query parameters
        let apiUrl = `/api/chatInterface?source=${source || ''}&courseId=${courseId || ''}`;
        if (problemId) {
          apiUrl += `&problemId=${problemId}`;
        }
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch chat data');
        }
        
        const data = await response.json();
        setChatData(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching chat data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchChatData();
  }, [source, courseId, problemId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EE] font-sans flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F1EE] font-sans flex flex-col items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
        <Link 
          href="/pages/home"
          className="px-4 py-2 bg-[#007096] text-white rounded-lg hover:bg-[#005f73] transition-colors"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EE] pt-24 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Source information */}
        {chatData?.sourceInfo?.source === 'canvas' && (
          <div className="mb-6 text-sm text-gray-600">
            Connected from Canvas Course ID: {chatData.sourceInfo.courseId}
          </div>
        )}

        {/* Single problem/solution display */}
        {chatData?.problem && chatData?.solution && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="p-6">
              <div className="flex items-center mb-4">
                {/* Icon from problem */}
                <div 
                  className="inline-flex items-center justify-center rounded-full p-3 mr-4"
                  style={{ backgroundColor: chatData.problem.colorClasses.includes('yellow') 
                    ? '#EBBA45' : chatData.problem.colorClasses.includes('blue') 
                    ? '#007096' : chatData.problem.colorClasses.includes('green') 
                    ? '#266725' : chatData.problem.colorClasses.includes('purple') 
                    ? '#501214' : '#EB2E47' }}
                >
                  <div 
                    className="w-6 h-6 text-white"
                    dangerouslySetInnerHTML={{ __html: chatData.problem.icon }}
                  />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {chatData.problem.title}
                </h1>
              </div>
              
              <p className="text-gray-600 mb-6">
                {chatData.problem.description}
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {chatData.solution.title}
                </h2>
                <p className="text-gray-600">
                  {chatData.solution.description}
                </p>
              </div>
              
              {/* Chat interface component would go here */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <h3 className="font-medium text-gray-800 mb-4">AI Assistant</h3>
                
                <div className="chat-messages space-y-4 mb-4">
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <p>Hello! I&apos;m your AI assistant to help with your <strong>{chatData.problem.title}</strong> needs. What specific questions do you have about {chatData.solution.title}?</p>
                  </div>
                </div>
                
                <div className="flex">
                  <input 
                    type="text"
                    placeholder="Type your question here..."
                    className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#007096]"
                  />
                  <button className="bg-[#007096] text-white px-4 py-2 rounded-r-lg hover:bg-[#005f73]">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* List of all issues if no specific problem ID was provided */}
        {!chatData?.problem && chatData?.issues && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Resources</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {chatData.issues.map((item, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <div 
                        className="inline-flex items-center justify-center rounded-full p-2 mr-3"
                        style={{ backgroundColor: item.problem.colorClasses.includes('yellow') 
                          ? '#EBBA45' : item.problem.colorClasses.includes('blue') 
                          ? '#007096' : item.problem.colorClasses.includes('green') 
                          ? '#266725' : item.problem.colorClasses.includes('purple') 
                          ? '#501214' : '#EB2E47' }}
                      >
                        <div 
                          className="w-5 h-5 text-white"
                          dangerouslySetInnerHTML={{ __html: item.problem.icon }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.problem.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {item.problem.description}
                    </p>
                    <Link
                      href={`/pages/chatInterface?source=${source || ''}&courseId=${courseId || ''}&problemId=${item.problem.id}`}
                      className="inline-block px-4 py-2 bg-[#007096] text-white rounded-lg hover:bg-[#005f73] transition-colors text-sm"
                    >
                      Get Help
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Link 
            href="/pages/strategies"
            className="inline-block px-4 py-2 bg-[#EBBA45] text-white rounded-lg hover:bg-[#D9A93E] transition-colors"
          >
            View All Strategies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatInterfaceContent;