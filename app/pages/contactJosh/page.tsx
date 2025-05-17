'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ContactJoshPage = () => {
  return (
    <div className="min-h-screen bg-global-background pt-28 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-global-card p-8 rounded-lg shadow-lg"
        >
          <h1 className="text-3xl font-bold text-global-primary mb-6 text-center">
            Advanced Business Support
          </h1>
          
          <div className="mb-8 p-6 border border-yellow-300 bg-yellow-50 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-yellow-800">
              Congratulations on your business progress!
            </h2>
            <p className="text-lg mb-4">
              Our platform is currently optimized for businesses at the beginner stage. 
              However, we see that your business has advanced to the intermediate or advanced stage.
            </p>
            <p className="text-lg">
              For personalized guidance that matches your current business needs, 
              we recommend connecting directly with our expert advisor.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-global-border mb-6">
            <h2 className="text-2xl font-semibold text-global-secondary mb-4">
              Contact Dr. Josh
            </h2>
            <div className="flex items-start mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-700">Email Dr. Josh directly at:</p>
                <a 
                  href="mailto:josh.daspit@txstate.edu" 
                  className="text-blue-600 hover:text-blue-800 text-lg font-medium"
                >
                  josh.daspit@txstate.edu
                </a>
              </div>
            </div>
            <p className="text-gray-600 mt-6">
              Please include your business name and a brief description of your current challenges or goals
              so Dr. Josh can prepare appropriately for your conversation.
            </p>
          </div>

          <div className="text-center mt-8">
            <Link href="/">
              <button className="px-6 py-3 rounded-lg shadow-md text-white transition duration-200 bg-[#007096] hover:bg-[#005f73]">
                Return to Dashboard
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactJoshPage;