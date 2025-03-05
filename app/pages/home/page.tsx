'use client'
import { useRouter } from 'next/navigation';



const HomePage = () => {
    const router = useRouter();

    const handleLoginRedirect = () => {
        router.push('/auth/login');
    };

    return (
        <div className="container mx-auto px-4">
            <div className="py-16">
                {/* Centered Title */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold">Hispanic Business Chatbot Home Page</h1>
                    <button
                        onClick={handleLoginRedirect}
                        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition-colors"
                    >
                        Let&apos;s Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
