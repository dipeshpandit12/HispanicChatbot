import React from 'react';

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col min-h-screen">
            <div className="flex-grow container mx-auto px-4 py-8">
                {children}
            </div>
        </section>
    );
}