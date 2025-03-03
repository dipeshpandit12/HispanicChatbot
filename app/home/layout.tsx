import React from 'react';
import Navbar from '../../Components/Navbar';


export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4">
                <Navbar/>
                {children}
            </main>
        </div>
    );
}