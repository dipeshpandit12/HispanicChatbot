'use client'
import { useRouter } from 'next/navigation';



const HomePage = () => {
    const router = useRouter();
    return (
      <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center text-center p-6">
        <h1 className="text-4xl font-bold text-blue-600">Grow Your Business with AI</h1>
        <p className="text-gray-700 mt-4 max-w-2xl">
          Hispanic Chatbot helps local businesses streamline their social media marketing with AI-powered automation.
        </p>
        <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700" onClick={() => router.push('/auth/login')}>
          Get Started
        </button>
      </div>
    );
  };

export default HomePage;
