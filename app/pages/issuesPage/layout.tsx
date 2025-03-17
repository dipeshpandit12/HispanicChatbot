import React from 'react';

export default function issuesPageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex flex-1 flex-col">
                {children}
            </main>
        </div>
    );
}