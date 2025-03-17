'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AlertProps {
    isOpen: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose?: () => void;
}

export default function Alert({
    isOpen,
    message,
    type,
    onClose
}: AlertProps) {
    const getAlertColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-100 border-green-500 text-green-700';
            case 'error':
                return 'bg-red-100 border-red-500 text-red-700';
            case 'warning':
                return 'bg-yellow-100 border-yellow-500 text-yellow-700';
            default:
                return 'bg-blue-100 border-blue-500 text-blue-700';
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className="fixed top-4 right-4 z-50"
                >
                    <div
                        className={`px-6 py-4 rounded-lg border ${getAlertColor()} shadow-lg flex items-center`}
                        role="alert"
                    >
                        <div className="flex-grow">{message}</div>
                        {onClose && (
                            <button
                                onClick={onClose}
                                className="ml-4 text-current hover:opacity-75 transition-opacity"
                            >
                                <span className="text-xl">&times;</span>
                            </button>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}