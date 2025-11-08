import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { motion, AnimatePresence } from 'framer-motion';
import { evaluateQuizAnswer, getChat } from '../services/geminiService';
import { QuizFeedback } from '../types';
import ResultsPanel from './ResultsPanel';
import LoadingSpinner from './LoadingSpinner';

type Tab = 'lessons' | 'quiz' | 'explain';

const LearningHub: React.FC = () => {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState<Tab>('lessons');

  const tabs = [
    { id: 'lessons', label: t('learnLessons') },
    { id: 'quiz', label: t('learnQuiz') },
    { id: 'explain', label: t('learnAIExplain') },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'lessons': return <Lessons />;
      case 'quiz': return <Quiz />;
      case 'explain': return <AIExplain />;
      default: return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display font-bold text-gold">{t('learnTitle')}</h2>
        <p className="text-lg text-light-text dark:text-dark-text mt-2 max-w-2xl mx-auto">{t('learnDescription')}</p>
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <div className="flex justify-center border-b border-light-border dark:border-dark-border mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`${activeTab === tab.id ? 'border-gold text-gold' : 'border-transparent text-light-text/70 dark:text-dark-text/70'} relative py-4 px-6 text-lg font-bold transition-colors duration-300 focus:outline-none`}
            >
              {tab.label}
              {activeTab === tab.id && <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" layoutId="underline-learn" />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
            <motion.div
                key={activeTab}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                {renderContent()}
            </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const Lessons: React.FC = () => {
    const { t } = useLocalization();
    const topics = [
      { titleKey: 'learnTopic1Title', contentKey: 'learnTopic1Content' },
      { titleKey: 'learnTopic2Title', contentKey: 'learnTopic2Content' },
    ];
    return (
        <div className="space-y-6">
            {topics.map((topic, index) => (
                <div key={index} className="bg-light-paper dark:bg-dark-paper p-6 rounded-lg shadow-lg border border-light-border dark:border-dark-border">
                    <h3 className="text-2xl font-display text-gold mb-3">{t(topic.titleKey)}</h3>
                    <p className="text-light-text dark:text-dark-text">{t(topic.contentKey)}</p>
                </div>
            ))}
        </div>
    );
};

const Quiz: React.FC = () => {
    const { t } = useLocalization();
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<QuizFeedback | null>(null);
    const [loading, setLoading] = useState(false);
    const question = t('quizQuestion');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!answer) return;
        setLoading(true);
        setFeedback(null);
        try {
            const resultJson = await evaluateQuizAnswer(question, answer);
            setFeedback(JSON.parse(resultJson));
        } catch (error) {
            console.error(error);
            alert(t('errorOccurred'));
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-light-paper dark:bg-dark-paper p-6 rounded-lg shadow-lg border border-light-border dark:border-dark-border space-y-4">
            <h3 className="text-2xl font-bold text-light-text dark:text-dark-text text-center">{question}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input 
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="flex-grow p-3 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-gold focus:outline-none bg-white dark:bg-charcoal text-light-text dark:text-dark-text"
                    placeholder="e.g., Anubis, Osiris..."
                />
                <button type="submit" className="py-3 px-6 bg-gold text-black font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity" disabled={loading}>
                    {t('submitAnswer')}
                </button>
            </form>
            {loading && <div className="text-center font-bold">{t('analyzing')}</div>}
            {feedback && (
                <div className={`mt-4 p-4 rounded-lg text-center ${feedback.is_correct ? 'bg-green-500/20 text-green-800 dark:text-green-300' : 'bg-red-500/20 text-red-800 dark:text-red-300'}`}>
                    <p className="font-bold text-lg">{feedback.is_correct ? "Correct!" : "Not quite..."}</p>
                    <p>{feedback.explanation}</p>
                </div>
            )}
        </div>
    );
};

const AIExplain: React.FC = () => {
    const { t } = useLocalization();
    const [prompt, setPrompt] = useState('');
    const [explanation, setExplanation] = useState('');
    const [loading, setLoading] = useState(false);

    const handleExplain = async () => {
        if (!prompt) return;
        setLoading(true);
        setExplanation('');
        try {
            const chat = getChat();
            const response = await chat.sendMessage(`Explain the following in the context of ancient Egypt: "${prompt}"`);
            setExplanation(response.text);
        } catch(error) {
            console.error(error);
            alert(t('errorOccurred'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light-paper dark:bg-dark-paper p-6 rounded-lg shadow-lg border border-light-border dark:border-dark-border space-y-4">
            <h3 className="text-2xl font-bold text-light-text dark:text-dark-text text-center">{t('learnAIExplain')}</h3>
             <div className="flex flex-col sm:flex-row gap-4">
                <input 
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="flex-grow p-3 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-gold focus:outline-none bg-white dark:bg-charcoal text-light-text dark:text-dark-text"
                    placeholder={t('aiExplainPrompt')}
                />
                <button onClick={handleExplain} className="py-3 px-6 bg-gold text-black font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity" disabled={loading}>
                    {t('getExplanation')}
                </button>
            </div>
            {loading && <LoadingSpinner message={t('analyzing')} />}
            {explanation && <ResultsPanel title="Explanation" content={explanation} textToSpeak={explanation} />}
        </div>
    );
}

export default LearningHub;
