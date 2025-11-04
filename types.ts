
export type CurrencyPair = {
    name: string;
    base: string;
    quote: string;
};

export type Timeframe = {
    label: string;
    value: string;
};

export interface Indicators {
    rsi: number;
    macd: number;
    signalLine: number;
    histogram: number;
}

export enum SignalAction {
    BUY = 'BUY',
    SELL = 'SELL',
    HOLD = 'HOLD',
}

export interface Signal {
    signal: SignalAction;
    confidence: number;
}

export interface NewsItem {
    title: string;
    uri: string;
}
