
import { AnalysisRecord } from '../types';

// This is a simulated Supabase client using localStorage for persistence.
// It mimics the async nature of a real database client.

const HISTORY_KEY = 'hiero-ai-analysis-history';

// Helper to get current history from localStorage
const getHistory = (): AnalysisRecord[] => {
    try {
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
        console.error("Could not parse history from localStorage", error);
        return [];
    }
};

export const saveAnalysis = async (record: Omit<AnalysisRecord, 'id' | 'created_at'>): Promise<AnalysisRecord> => {
    console.log("Saving analysis to DB (mock):", record);
    
    const newRecord: AnalysisRecord = {
        ...record,
        id: new Date().toISOString() + Math.random(), // Simple unique ID
        created_at: new Date().toISOString(),
    };

    const history = getHistory();
    history.unshift(newRecord); // Add to the beginning
    
    // Keep history limited to the last 20 items
    if (history.length > 20) {
        history.pop();
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    
    return Promise.resolve(newRecord);
};

export const getAnalysisHistory = async (): Promise<AnalysisRecord[]> => {
    console.log("Fetching analysis history from DB (mock)");
    
    const history = getHistory();
    return Promise.resolve(history);
};
