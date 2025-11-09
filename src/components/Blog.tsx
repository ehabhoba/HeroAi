
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../hooks/useLocalization';
import { generateBlogPost } from '../services/geminiService';
import Markdown from 'react-markdown';
import LoadingSpinner from './LoadingSpinner';


const Blog: React.FC = () => {
    const { t } = useLocalization();
    const [generatedArticle, setGeneratedArticle] = useState('');
    const [topic, setTopic] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        setGeneratedArticle('');
        try {
            const article = await generateBlogPost(topic);
            setGeneratedArticle(article);
        } catch (error) {
            console.error(error);
            alert(t('errorOccurred'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className="text-4xl font-display font-bold text-gold">{t('blogTitle')}</h2>
                <p className="text-lg text-light-text dark:text-dark-text mt-2 max-w-3xl mx-auto">{t('blogDescription')}</p>
            </div>

            <div className="max-w-4xl mx-auto p-6 bg-light-paper dark:bg-dark-paper rounded-lg shadow-lg border border-light-border dark:border-dark-border space-y-4">
                <h3 className="text-2xl font-display text-gold text-center">{t('generateArticle')}</h3>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <input 
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="flex-grow p-3 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-gold focus:outline-none bg-white dark:bg-charcoal text-light-text dark:text-dark-text"
                        placeholder={t('blogTopicPlaceholder')}
                    />
                    <button onClick={handleGenerate} className="py-3 px-6 bg-gold text-black font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity" disabled={loading}>
                        {loading ? t('generating') : t('generateArticle')}
                    </button>
                </div>
            </div>
            
            {loading && <LoadingSpinner message={t('generating')}/>}

            <AnimatePresence>
                {generatedArticle && (
                    <motion.div
                        className="max-w-4xl mx-auto p-6 bg-light-paper dark:bg-dark-paper rounded-lg shadow-xl border border-light-border dark:border-dark-border"
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                    >
                         <div className="prose prose-lg dark:prose-invert max-w-none text-light-text dark:text-dark-text">
                            <Markdown>{generatedArticle}</Markdown>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Blog;
