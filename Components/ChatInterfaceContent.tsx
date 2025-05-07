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
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Array<{type: 'user' | 'ai', content: string}>>([]);

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
        
        // Initialize with a welcome message
        if (data.problem) {
          setMessages([{
            type: 'ai',
            content: `Hello! I'm your AI assistant to help with your ${data.problem.title} needs. What specific questions do you have about ${data.solution?.title || 'this topic'}?`
          }]);
        }
        
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

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, {type: 'user', content: inputMessage}]);
    
    // In a real implementation, you would send this to your API and get a response
    // For now, we'll simulate a response after a short delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        type: 'ai',
        content: `Thank you for your question about ${chatData?.problem?.title}. This is a simulated response. In a complete implementation, this would be a response from your AI service.`
      }]);
    }, 1000);
    
    setInputMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F6F4] to-[#F5F1EE] font-sans flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-8 rounded-xl bg-white shadow-md">
          <div className="w-16 h-16 border-t-4 border-[#007096] border-solid rounded-full animate-spin mb-4"></div>
          <div className="text-lg text-gray-700 font-medium">Loading resources...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F8F6F4] to-[#F5F1EE] font-sans flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-800">Error</h2>
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/pages/home"
              className="w-full flex justify-center px-4 py-2 bg-[#007096] text-white rounded-lg hover:bg-[#005f73] transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F6F4] to-[#F5F1EE] pt-16 font-sans">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Source information with more subtle styling */}
        {chatData?.sourceInfo?.source === 'canvas' && (
          <div className="mb-6 text-sm text-gray-500 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Connected from Canvas Course ID: <span className="font-medium ml-1">{chatData.sourceInfo.courseId}</span>
          </div>
        )}

        {/* Single problem/solution display with improved styling */}
        {chatData?.problem && chatData?.solution && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100">
            <div className="p-6 md:p-8">
              <div className="flex items-center mb-6">
                {/* Icon from problem with improved styling */}
                <div 
                  className="inline-flex items-center justify-center rounded-xl p-3 mr-4 shadow-sm"
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
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                {chatData.problem.description}
              </p>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl mb-8 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-[#007096]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {chatData.solution.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {chatData.solution.description}
                </p>
              </div>
              
              {/* Enhanced chat interface component */}
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <div className="bg-gradient-to-r from-[#007096] to-[#0091c2] p-4">
                  <h3 className="font-medium text-white flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    AI Assistant
                  </h3>
                </div>
                
                <div className="chat-messages space-y-4 p-4 bg-white max-h-80 overflow-y-auto">
                  {messages.map((message, index) => (
                    <div 
                      key={index} 
                      className={`p-4 rounded-xl ${
                        message.type === 'user' 
                          ? 'bg-[#007096] text-white ml-12' 
                          : 'bg-gray-100 text-gray-800 mr-12'
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                  ))}
                </div>
                
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex">
                    <input 
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your question here..."
                      className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#007096] focus:border-transparent"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="bg-[#007096] text-white px-6 py-3 rounded-r-lg hover:bg-[#005f73] transition-colors flex items-center"
                    >
                      <span>Send</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* List of all issues with card-style design */}
        {!chatData?.problem && chatData?.issues && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Available Resources</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {chatData.issues.map((item, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                  <div 
                    className="h-2"
                    style={{ backgroundColor: item.problem.colorClasses.includes('yellow') 
                      ? '#EBBA45' : item.problem.colorClasses.includes('blue') 
                      ? '#007096' : item.problem.colorClasses.includes('green') 
                      ? '#266725' : item.problem.colorClasses.includes('purple') 
                      ? '#501214' : '#EB2E47' }}
                  ></div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div 
                        className="inline-flex items-center justify-center rounded-lg p-3 mr-3"
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
                    <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                      {item.problem.description}
                    </p>
                    <Link
                      href={`/pages/chatInterface?source=${source || ''}&courseId=${courseId || ''}&problemId=${item.problem.id}`}
                      className="w-full inline-block px-4 py-3 bg-[#007096] text-white rounded-lg hover:bg-[#005f73] transition-colors text-center font-medium"
                    >
                      Get Help
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Footer navigation with improved styling */}
        <div className="mt-12 flex justify-center">
          <Link 
            href="/pages/strategies"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5037cc] to-[#5b3cd6] text-white rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1"
          >
            <span>View All Strategies</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatInterfaceContent;