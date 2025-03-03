import React from 'react';

export const metadata = {
    title: 'Social Media Diagnostic',
    description: 'Social media diagnostic tool and assessment',
};

export default function SocialMediaDiagnosticLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen p-4">
            <main className="container mx-auto">
                {children}
            </main>
        </div>
    );
}