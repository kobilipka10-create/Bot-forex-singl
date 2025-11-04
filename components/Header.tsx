import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 [text-shadow:0_0_12px_rgba(52,211,153,0.4)]">
                Gemini Forex Signal Pro
            </h1>
            <p className="mt-2 text-lg text-gray-300/80">AI-Powered Trading Insights</p>
        </header>
    );
};