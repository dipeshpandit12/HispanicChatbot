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
        <div className="min-h-screen flex items-center justify-center">
            {children}
        </div>
    );
}