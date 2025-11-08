import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { motion } from 'framer-motion';
import { getAnalysisHistory } from '../services/supabaseService';
import { AnalysisRecord } from '../types';
import LoadingSpinner from './LoadingSpinner';

const HistoryItem: React.FC<{ record: AnalysisRecord, index: number }> = ({ record, index }) => {
    return (
        <motion.div
            className="flex items-center gap-4 bg-light-paper dark:bg-dark-paper p-3 rounded-lg shadow-md border border-light-border dark:border-dark-border"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <img src={record.result_url} alt={record.prompt} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
            <div className="flex-1 overflow-hidden">
                <p className="font-bold text-gold capitalize">{record.type}</p>
                <p className="text-sm text-light-text dark:text-dark-text truncate">"{record.prompt}"</p>
                <p className="text-xs text-light-text/70 dark:text-dark-text/70">{new Date(record.created_at).toLocaleString()}</p>
            </div>
        </motion.div>
    );
}

const Library: React.FC = () => {
    const { t } = useLocalization();
    const [history, setHistory] = useState<AnalysisRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const records = await getAnalysisHistory();
                setHistory(records);
            } catch (error) {
                console.error("Failed to fetch history", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div className="space-y-12">
            <div className="text-center">
                <h2 className="text-4xl font-display font-bold text-gold">{t('libraryTitle')}</h2>
                <p className="text-lg text-light-text dark:text-dark-text mt-2 max-w-2xl mx-auto">{t('libraryDescription')}</p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
                <h3 className="text-3xl font-display text-gold text-center">{t('libraryRecentAnalyses')}</h3>
                {loading ? (
                    <LoadingSpinner message="Loading history..." />
                ) : history.length > 0 ? (
                    <div className="space-y-4">
                        {history.map((record, index) => (
                            <HistoryItem key={record.id} record={record} index={index} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-lg text-light-text/80 dark:text-dark-text/80 bg-light-paper dark:bg-dark-paper p-6 rounded-lg">
                        {t('libraryNoHistory')}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Library;
