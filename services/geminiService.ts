
import { GoogleGenAI, Type } from "@google/genai";
import type { CurrencyPair, Timeframe, Indicators, Signal, NewsItem } from '../types';
import { SignalAction } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const signalResponseSchema = {
    type: Type.OBJECT,
    properties: {
        signal: {
            type: Type.STRING,
            enum: [SignalAction.BUY, SignalAction.SELL, SignalAction.HOLD],
            description: 'The trading signal decision.',
        },
        confidence: {
            type: Type.INTEGER,
            description: 'A confidence score from 1 (very low) to 10 (very high).',
        },
    },
    required: ['signal', 'confidence'],
};


export const getTradingSignal = async (
    pair: CurrencyPair,
    timeframe: Timeframe,
    indicators: Indicators
): Promise<Signal> => {
    try {
        const prompt = `
            You are a professional Forex trading analyst AI. Your task is to provide a trading signal (BUY, SELL, or HOLD)
            and a confidence score from 1 to 10 for the given currency pair based on its latest technical indicators.
            A score of 1 is very low confidence, and 10 is very high confidence. Provide your response in JSON format.

            Analysis Details:
            - Currency Pair: ${pair.name}
            - Timeframe: ${timeframe.value}
            - RSI (14): ${indicators.rsi.toFixed(2)}
            - MACD Line: ${indicators.macd.toFixed(5)}
            - MACD Signal Line: ${indicators.signalLine.toFixed(5)}
            - MACD Histogram: ${indicators.histogram.toFixed(5)}

            Trading Strategy Rules:
            1.  RSI: Values above 70 indicate overbought conditions (potential SELL), and values below 30 indicate oversold conditions (potential BUY).
            2.  MACD Crossover: A BUY signal is favored when the MACD line crosses above the Signal line (Histogram is positive and growing). A SELL signal is favored when the MACD line crosses below the Signal line (Histogram is negative and growing in magnitude).
            3.  Confidence Score: Base the confidence on the strength and clarity of the signals. For example, if RSI is below 30 and a bullish MACD crossover just occurred, confidence for a BUY signal should be high. If indicators are conflicting or neutral (e.g., RSI near 50, MACD lines are close), suggest HOLD with low confidence.

            Analyze the provided indicator values based on these rules and return your signal and confidence score.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: signalResponseSchema,
                temperature: 0.2
            }
        });

        const jsonString = response.text.trim();
        const parsedResponse = JSON.parse(jsonString);
        
        // Validate the response
        if (Object.values(SignalAction).includes(parsedResponse.signal) && 
            typeof parsedResponse.confidence === 'number' &&
            parsedResponse.confidence >= 1 && parsedResponse.confidence <= 10) {
            return parsedResponse as Signal;
        } else {
            console.error("Invalid response format from Gemini:", parsedResponse);
            return { signal: SignalAction.HOLD, confidence: 1 };
        }

    } catch (error) {
        console.error("Error fetching trading signal from Gemini:", error);
        return { signal: SignalAction.HOLD, confidence: 1 }; // Return a default neutral signal on error
    }
};

export const fetchCurrencyNews = async (pair: CurrencyPair): Promise<NewsItem[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `What is the latest news and market sentiment for the ${pair.name} currency pair?`,
            config: {
                tools: [{googleSearch: {}}],
            },
        });

        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (!groundingChunks) {
            return [];
        }
        
        const newsItems: NewsItem[] = groundingChunks
            .filter((chunk: any) => chunk.web && chunk.web.uri && chunk.web.title)
            .map((chunk: any) => ({
                title: chunk.web.title,
                uri: chunk.web.uri,
            }));

        // Deduplicate based on URI
        const uniqueNews = Array.from(new Map(newsItems.map(item => [item['uri'], item])).values());
        
        return uniqueNews.slice(0, 5); // Return top 5 unique news items

    } catch (error) {
        console.error("Error fetching news from Gemini with Google Search:", error);
        return [];
    }
};
