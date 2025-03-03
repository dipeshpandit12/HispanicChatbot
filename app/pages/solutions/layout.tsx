import React from 'react';

export default function SolutionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="solutions-layout">
            {children}
        </div>
    );
}