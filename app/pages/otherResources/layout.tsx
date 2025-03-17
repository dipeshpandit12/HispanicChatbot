import React from 'react';


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4">
                {children}
            </main>
        </div>
    );
}