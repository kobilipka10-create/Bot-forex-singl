
import type { CurrencyPair, Timeframe } from './types';

export const CURRENCY_PAIRS: CurrencyPair[] = [
    { name: 'EUR/USD', base: 'EUR', quote: 'USD' },
    { name: 'GBP/USD', base: 'GBP', quote: 'USD' },
    { name: 'USD/JPY', base: 'USD', quote: 'JPY' },
    { name: 'USD/CHF', base: 'USD', quote: 'CHF' },
    { name: 'AUD/USD', base: 'AUD', quote: 'USD' },
    { name: 'USD/CAD', base: 'USD', quote: 'CAD' },
    { name: 'NZD/USD', base: 'NZD', quote: 'USD' },
    { name: 'EUR/JPY', base: 'EUR', quote: 'JPY' },
    { name: 'GBP/JPY', base: 'GBP', quote: 'JPY' },
    { name: 'BTC/USD', base: 'BTC', quote: 'USD' },
];

export const TIMEFRAMES: Timeframe[] = [
    { label: '1 Min', value: '1 minute' },
    { label: '2 Min', value: '2 minutes' },
    { label: '5 Min', value: '5 minutes' },
    { label: '24 Hour', value: '24 hours' },
];
