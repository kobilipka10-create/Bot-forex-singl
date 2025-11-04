import React from 'react';
import type { CurrencyPair, NewsItem } from '../types';

interface NewsPanelProps {
    pair: CurrencyPair;
    news: NewsItem[];
    isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="flex items-start gap-3">
        <div className="w-5 h-5 mt-0.5 bg-gray-700/50 rounded-sm shrink-0 animate-pulse"></div>
        <div className="w-full space-y-2">
            <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-700/50 rounded w-1/2 animate-pulse"></div>
        </div>
    </div>
);

export const NewsPanel: React.FC<NewsPanelProps> = ({ pair, news, isLoading }) => {
    return (
        <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700/50 h-full">
            <h3 className="text-xl font-bold mb-4">Latest News for {pair.name}</h3>
            {isLoading ? (
                <div className="space-y-6">
                    <SkeletonLoader />
                    <SkeletonLoader />
                    <SkeletonLoader />
                    <SkeletonLoader />
                </div>
            ) : news.length > 0 ? (
                <ul className="space-y-2">
                    {news.map((item, index) => (
                        <li key={index}>
                            <a 
                                href={item.uri} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="group block p-3 -m-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    <img 
                                        src={`https://www.google.com/s2/favicons?sz=32&domain_url=${item.uri}`}
                                        alt=""
                                        className="w-5 h-5 mt-0.5 rounded-sm shrink-0"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    <div>
                                        <p className="text-blue-400 group-hover:underline font-medium leading-tight">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 truncate group-hover:text-gray-400 transition-colors">
                                            {item.uri}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    <p>No recent news found.</p>
                </div>
            )}
        </div>
    );
};