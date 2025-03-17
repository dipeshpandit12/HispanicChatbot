'use client';
import { useRouter } from 'next/navigation';
import { MessageSquare, Share2, BookOpen, HelpCircle } from 'lucide-react';

const HomePage = () => {
    const router = useRouter();
    const handleLoginRedirect = () => {
        router.push('/auth/login');
    };

    const features = [
        {
            title: "Business Diagnostics",
            description: "Get insights into your business performance.",
            icon: HelpCircle,
            href: "/questions",
            color: "bg-[#EB2E47]", // Secondary Red
        },
        {
            title: "Social Media",
            description: "Boost your business’s online presence.",
            icon: Share2,
            href: "/social-media",
            color: "bg-[#EBBA45]", // Secondary Yellow
        },
        {
            title: "Resource Center",
            description: "Find valuable tools and guides.",
            icon: BookOpen,
            href: "/resources",
            color: "bg-[#266725]", // Tertiary Dark Green
        },
        {
            title: "AI Assistant",
            description: "Chat with our AI-powered business helper.",
            icon: MessageSquare,
            href: "/chatbot",
            color: "bg-[#007096]", // Tertiary Dark Blue
        },
    ];

    return (
        <div className="min-h-screen pt-24" style={{ backgroundColor: '#F5F1EE' }}>
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Title */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                        Hispanic Business Chatbot
                    </h1>
                    <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        Empowering Hispanic businesses to thrive with cutting-edge AI-powered solutions tailored to your needs.
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature) => (
                        <a key={feature.title} href={feature.href} className="block">
                            <div className="p-8 bg-white shadow-lg rounded-lg hover:shadow-xl transition-all">
                                <div className={`p-4 rounded-full w-fit ${feature.color}`}>
                                    <feature.icon className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="mt-6 text-2xl font-semibold text-gray-800">{feature.title}</h3>
                                <p className="mt-2 text-gray-600">{feature.description}</p>
                            </div>
                        </a>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="mt-20 text-center">
                    <button
                        onClick={handleLoginRedirect}
                        className="bg-[#6A5638] hover:bg-[#419E69] text-white px-8 py-4 rounded-lg text-xl font-medium transition-colors shadow-md"
                    >
                        Let&apos;s Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;