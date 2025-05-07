'use client';

import React, { Suspense } from 'react';
import ChatInterfaceContent from '@/Components/ChatInterfaceContent';

// Parent component that provides the Suspense boundary
export default function ChatInterfacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F5F1EE] font-sans flex items-center justify-center">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    }>
      <ChatInterfaceContent />
    </Suspense>
  );
}