import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { motion } from 'framer-motion';
import { generateSpeech } from '../services/geminiService';
import { playBase64Audio } from '../services/audioService';
import { useLocalization } from '../hooks/useLocalization';

interface ResultsPanelProps {
  title: string;
  content: string;
  textToSpeak?: string; // Optional specific text for TTS
}

const AudioIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>;

const ResultsPanel: React.FC<ResultsPanelProps> = ({ title, content, textToSpeak }) => {
  const { t, language } = useLocalization();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePlayAudio = async () => {
    if (isSpeaking) return;
    
    const effectiveText = textToSpeak || content;
    if (!effectiveText) return;

    setIsSpeaking(true);
    try {
      const base64Audio = await generateSpeech(effectiveText, language);
      await playBase64Audio(base64Audio);
    } catch (error) {
      console.error("Failed to play audio", error);
      alert(t('errorOccurred'));
    } finally {
      setIsSpeaking(false);
    }
  };

  return (
    <motion.div
      className="w-full bg-light-paper dark:bg-dark-paper p-6 rounded-lg shadow-lg border border-light-border dark:border-dark-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-display text-gold">{title}</h3>
        <button
          onClick={handlePlayAudio}
          disabled={isSpeaking}
          className="flex items-center gap-2 px-3 py-1.5 bg-charcoal text-sand rounded-lg shadow-md hover:bg-black transition-all duration-300 disabled:opacity-50"
          aria-label={t('playAudio')}
        >
          <AudioIcon />
          <span className="text-sm font-bold">{isSpeaking ? t('playingAudio') : t('playAudio')}</span>
        </button>
      </div>
      <div className="prose prose-lg dark:prose-invert max-w-none text-light-text dark:text-dark-text">
        <Markdown>{content}</Markdown>
      </div>
    </motion.div>
  );
};

export default ResultsPanel;
