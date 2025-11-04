
import React from 'react';
import type { Timeframe } from '../types';

interface TimeframeSelectorProps {
    timeframes: Timeframe[];
    selectedTimeframe: Timeframe;
    onSelect: (timeframe: Timeframe) => void;
}

export const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({ timeframes, selectedTimeframe, onSelect }) => {
    return (
        <div className="flex items-center gap-2 flex-wrap">
             <span className="text-gray-400 font-medium">Timeframe:</span>
            {timeframes.map(tf => (
                <button
                    key={tf.value}
                    onClick={() => onSelect(tf)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                        selectedTimeframe.value === tf.value
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                >
                    {tf.label}
                </button>
            ))}
        </div>
    );
};
