'use client';


import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Alert from '@/Components/Alert';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


const StagePage = () => {
    const [stage, setStage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const router = useRouter();


    const fetchStage = async () => {
        try {
            const response = await fetch('/api/stage');
            if (response.status === 404) {
                setError('Business stage not found');
                setShowAlert(true);
                return null;
            }
            if (!response.ok) {
                const error = await response.json();
                setError(error.error || 'Failed to fetch business stage');
                setShowAlert(true);
                return null;
            }
            const data = await response.json();
            return data.stage;
        } catch (error) {
            console.error('Failed to fetch stage:', error);
            throw error;
        }
    };


    useEffect(() => {
        const getStage = async () => {
            try {
                const result = await fetchStage();
                setStage(result);
                setError(null);
            } catch (err: unknown) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(errorMessage);
                setShowAlert(true);

                if (errorMessage === 'Business stage not found') {
                    setTimeout(() => {
                        router.push('/pages/businessData');
                    }, 3000);
                }
            } finally {
                setLoading(false);
            }
        };
        getStage();
    }, [router]);


    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }


    if (error) {
        return (
            <Alert
                isOpen={showAlert}
                message={error === 'Business stage not found' 
                    ? "Your business stage information was not found. Redirecting to business data collection page..." 
                    : error}
                type={error === 'Business stage not found' ? 'warning' : 'error'}
                onClose={() => setShowAlert(false)}
            />

           
        );
    }


    const stageColors = {
        beginner: 'text-global-beginner-text border-global-beginner-border',
        intermediate: 'text-global-intermediate-text border-global-intermediate-border',
        advance: 'text-global-advance-text border-global-advance-border',
    };


    const stageDescriptions = {
        beginner: 'You are at the beginning of your business journey. Focus on building strong foundations.',
        intermediate: 'Your business is growing steadily. Time to scale and optimize operations.',
        advance: 'Your business is well-established. Focus on expansion and market leadership.',
    };


    return (
        <>
            <div className="min-h-screen bg-global-background pt-28 py-12 px-4 sm:px-6 lg:px-8">
                {/* Increased pt-28 to push the content further below the navbar */}
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-global-card p-8 rounded-lg shadow-lg"
                    >
                        <h1 className="text-3xl font-bold text-global-primary mb-8 text-center">
                            Your Business Stage
                        </h1>


                        <div className={`p-6 rounded-lg border bg-white ${stageColors[stage as keyof typeof stageColors]} mb-8`}>
                            <h2 className="text-2xl font-semibold capitalize mb-4">{stage} Stage</h2>
                            <p className="text-lg">{stageDescriptions[stage as keyof typeof stageDescriptions]}</p>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-white rounded-lg border border-global-border shadow-sm">
                                <h3 className="font-semibold text-lg mb-2 text-global-secondary">Next Steps</h3>
                                <ul className="list-disc list-inside text-global-secondary">
                                    <li>Set clear goals</li>
                                    <li>Create action plans</li>
                                    <li>Track progress</li>
                                </ul>
                            </div>


                            <div className="p-4 bg-white rounded-lg border border-global-border shadow-sm">
                                <h3 className="font-semibold text-lg mb-2 text-global-secondary">Resources</h3>
                                <ul className="list-disc list-inside text-global-secondary">
                                    <li>Business templates</li>
                                    <li>Learning materials</li>
                                    <li>Expert guidance</li>
                                </ul>
                            </div>


                            <div className="p-4 bg-white rounded-lg border border-global-border shadow-sm">
                                <h3 className="font-semibold text-lg mb-2 text-global-secondary">Support</h3>
                                <ul className="list-disc list-inside text-global-secondary">
                                    <li>Community forums</li>
                                    <li>Expert mentoring</li>
                                    <li>24/7 assistance</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                    <Link href="/pages/strategies" className="mt-8 block text-center">
                        <button
                            className="px-4 py-2 rounded-lg shadow-md text-white transition duration-200 bg-[#007096] hover:bg-[#005f73]"
                        >
                            Get Personalized Guidance
                        </button>
                    </Link>
                </div>
            </div>
        </>
    );
};


export default StagePage;
