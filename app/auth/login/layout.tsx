import React from 'react';

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1b1d1e]">
            <div className="max-w-md w-full space-y-8 p-8">
                {children}
            </div>
        </div>
    );
}