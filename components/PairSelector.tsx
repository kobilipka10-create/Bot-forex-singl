
import React from 'react';
import type { CurrencyPair } from '../types';

interface PairSelectorProps {
    pairs: CurrencyPair[];
    selectedPair: CurrencyPair;
    onSelect: (pair: CurrencyPair) => void;
}

export const PairSelector: React.FC<PairSelectorProps> = ({ pairs, selectedPair, onSelect }) => {
    return (
        <div className="flex items-center gap-2">
            <label htmlFor="pair-select" className="text-gray-400 font-medium">Pair:</label>
            <select
                id="pair-select"
                value={selectedPair.name}
                onChange={(e) => {
                    const newPair = pairs.find(p => p.name === e.target.value);
                    if (newPair) onSelect(newPair);
                }}
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
                {pairs.map(pair => (
                    <option key={pair.name} value={pair.name}>
                        {pair.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
