import React from 'react';
import type { CurrencyPair, Timeframe, Indicators, Signal } from '../types';
import { SignalAction } from '../types';
import { ArrowUpIcon } from './icons/ArrowUpIcon';
import { ArrowDownIcon } from './icons/ArrowDownIcon';

interface SignalDisplayProps {
    pair: CurrencyPair;
    timeframe: Timeframe;
    indicators: Indicators | null;
    signal: Signal | null;
    isLoading: boolean;
}

const SkeletonLoader: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-gray-700/50 animate-pulse rounded-md ${className}`}></div>
);

const ConfidenceMeter: React.FC<{ confidence: number }> = ({ confidence }) => {
    const bars = Array.from({ length: 10 }, (_, i) => i < confidence);
    const confidenceColor = confidence >= 7 ? 'bg-emerald-500' : confidence >= 4 ? 'bg-yellow-500' : 'bg-red-500';

    return (
        <div className="flex items-center gap-1.5">
            {bars.map((isActive, index) => (
                <div
                    key={index}
                    className={`h-5 w-full rounded-sm transition-colors duration-300 ${isActive ? confidenceColor : 'bg-gray-600/50'}`}
                ></div>
            ))}
        </div>
    );
};

const IndicatorDisplay: React.FC<{ label: string; value: number | undefined; color: string }> = ({ label, value, color }) => (
    <div className="text-center bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
        <p className="text-sm text-gray-400">{label}</p>
        <p className={`font-mono text-xl font-bold ${color}`}>{value?.toFixed(5) ?? '...'}</p>
    </div>
);

export const SignalDisplay: React.FC<SignalDisplayProps> = ({ pair, timeframe, indicators, signal, isLoading }) => {

    const signalColor = signal?.signal === SignalAction.BUY ? 'text-green-400' : signal?.signal === SignalAction.SELL ? 'text-red-400' : 'text-yellow-400';
    
    return (
        <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-lg border border-gray-700/50 h-full flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">{pair.name}</h2>
                    <span className="text-sm font-medium bg-gray-700/80 px-3 py-1 rounded-full">{timeframe.label}</span>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                     <IndicatorDisplay label="RSI" value={indicators?.rsi} color={ indicators && indicators.rsi > 70 ? 'text-red-400' : indicators && indicators.rsi < 30 ? 'text-green-400' : 'text-gray-300' } />
                     <IndicatorDisplay label="MACD" value={indicators?.macd} color="text-blue-400" />
                     <IndicatorDisplay label="Signal" value={indicators?.signalLine} color="text-orange-400" />
                     <IndicatorDisplay label="Histogram" value={indicators?.histogram} color={ indicators && indicators.histogram >= 0 ? 'text-green-400' : 'text-red-400' } />
                </div>

                <div className="mt-6 py-4 flex flex-col items-center justify-center min-h-[160px]">
                    {isLoading ? (
                        <div className="w-full max-w-sm space-y-4">
                            <SkeletonLoader className="h-16 w-1/2 mx-auto" />
                            <SkeletonLoader className="h-5 w-full" />
                        </div>
                    ) : signal ? (
                        <div className="text-center">
                            <p className={`text-6xl lg:text-7xl font-bold tracking-wider ${signalColor}`}>{signal.signal}</p>
                            <div className="mt-4 w-full max-w-xs mx-auto">
                                <p className="text-sm text-gray-400 mb-1 text-left">Confidence ({signal.confidence}/10)</p>
                                <ConfidenceMeter confidence={signal.confidence} />
                            </div>
                        </div>
                    ) : (
                         <p className="text-gray-500">No signal available.</p>
                    )}
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
                <button disabled={isLoading || signal?.signal !== SignalAction.BUY} className="flex items-center justify-center gap-2 w-full p-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg shadow-green-900/30 disabled:shadow-none">
                    <ArrowUpIcon className="w-6 h-6" />
                    BUY
                </button>
                <button disabled={isLoading || signal?.signal !== SignalAction.SELL} className="flex items-center justify-center gap-2 w-full p-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-500 transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed shadow-lg shadow-red-900/30 disabled:shadow-none">
                    <ArrowDownIcon className="w-6 h-6" />
                    SELL
                </button>
            </div>
        </div>
    );
};