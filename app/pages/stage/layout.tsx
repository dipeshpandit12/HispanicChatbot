import React from 'react';

export default function StageLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="stage-layout">
            {children}
        </div>
    );
}