import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { PairSelector } from './components/PairSelector';
import { TimeframeSelector } from './components/TimeframeSelector';
import { SignalDisplay } from './components/SignalDisplay';
import { NewsPanel } from './components/NewsPanel';
import { getTradingSignal, fetchCurrencyNews } from './services/geminiService';
import type { CurrencyPair, Timeframe, Indicators, Signal, NewsItem } from './types';
import { CURRENCY_PAIRS, TIMEFRAMES } from './constants';
import { RefreshIcon } from './components/icons/RefreshIcon';

const App: React.FC = () => {
    const [selectedPair, setSelectedPair] = useState<CurrencyPair>(CURRENCY_PAIRS[0]);
    const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>(TIMEFRAMES[2]);
    const [indicators, setIndicators] = useState<Indicators | null>(null);
    const [signal, setSignal] = useState<Signal | null>(null);
    const [news, setNews] = useState<NewsItem[]>([]);
    const [isSignalLoading, setIsSignalLoading] = useState<boolean>(true);
    const [isNewsLoading, setIsNewsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Fix: Correctly initialize the Indicators object to include the 'histogram' property, resolving a TypeScript error.
    const generateRandomIndicators = useCallback(() => {
        const macd = parseFloat(((Math.random() - 0.5) * 0.005).toFixed(5));
        const signalLine = parseFloat(((Math.random() - 0.5) * 0.004).toFixed(5));
        const newIndicators: Indicators = {
            rsi: parseFloat((Math.random() * (85 - 15) + 15).toFixed(2)),
            macd,
            signalLine,
            histogram: parseFloat((macd - signalLine).toFixed(5)),
        };
        setIndicators(newIndicators);
        return newIndicators;
    }, []);

    const fetchData = useCallback(async (currentIndicators: Indicators) => {
        setError(null);
        setIsSignalLoading(true);
        setIsNewsLoading(true);

        try {
            const signalPromise = getTradingSignal(selectedPair, selectedTimeframe, currentIndicators);
            const newsPromise = fetchCurrencyNews(selectedPair);

            const [signalResult, newsResult] = await Promise.all([signalPromise, newsPromise]);
            
            setSignal(signalResult);
            setNews(newsResult);

        } catch (err) {
            console.error(err);
            setError('Failed to fetch data from Gemini API. Please check your API key and try again.');
        } finally {
            setIsSignalLoading(false);
            setIsNewsLoading(false);
        }
    }, [selectedPair, selectedTimeframe]);

    const handleRefresh = useCallback(() => {
      const newIndicators = generateRandomIndicators();
      fetchData(newIndicators);
    }, [generateRandomIndicators, fetchData]);

    useEffect(() => {
        const newIndicators = generateRandomIndicators();
        fetchData(newIndicators);

        const interval = setInterval(() => {
          const freshIndicators = generateRandomIndicators();
          fetchData(freshIndicators);
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedPair, selectedTimeframe]);

    const isLoading = useMemo(() => isSignalLoading || isNewsLoading, [isSignalLoading, isNewsLoading]);

    return (
        <div className="min-h-screen text-gray-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <div className="md:col-span-3 bg-gray-800/60 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-700/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <PairSelector pairs={CURRENCY_PAIRS} selectedPair={selectedPair} onSelect={setSelectedPair} />
                            <TimeframeSelector timeframes={TIMEFRAMES} selectedTimeframe={selectedTimeframe} onSelect={setSelectedTimeframe} />
                             <button
                                onClick={handleRefresh}
                                disabled={isLoading}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                            >
                                <RefreshIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                                <span>{isLoading ? 'Updating...' : 'Update Now'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <SignalDisplay 
                            pair={selectedPair} 
                            timeframe={selectedTimeframe}
                            indicators={indicators} 
                            signal={signal}
                            isLoading={isSignalLoading}
                        />
                    </div>
                    
                    <div className="md:col-span-1">
                        <NewsPanel 
                          pair={selectedPair} 
                          news={news}
                          isLoading={isNewsLoading}
                        />
                    </div>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-900/60 backdrop-blur-md border border-red-700/50 text-red-300 rounded-xl text-center">
                        <p className="font-bold">An Error Occurred</p>
                        <p>{error}</p>
                    </div>
                )}

                 <footer className="text-center text-gray-500 mt-8 text-sm">
                    <p>Disclaimer: This application is for demonstration purposes only. Trading signals are generated by an AI and should not be considered financial advice.</p>
                </footer>
            </div>
        </div>
    );
};

export default App;