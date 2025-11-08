import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import Footer from './components/Footer';
import HieroglyphTranslator from './components/HieroglyphTranslator';
import RealisticRenderer from './components/RealisticRenderer';
import MuseumExplorer from './components/MuseumExplorer';
import AiAssistant from './components/AiAssistant';
import LearningHub from './components/LearningHub';
import HomePage from './components/HomePage';
import Library from './components/Library';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Gallery3D from './components/Gallery3D'; // Import new component

import { locales } from './data/locales';

export type Language = 'en' | 'ar';
export type View = 'home' | 'translate' | 'render' | 'library' | 'learn' | 'museum' | 'blog' | 'contact' | 'assistant' | 'gallery3d'; // Add new view
export type Theme = 'light' | 'dark';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
export const LocalizationContext = React.createContext<LocalizationContextType | null>(null);

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
export const ThemeContext = React.createContext<ThemeContextType | null>(null);

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const t = useCallback((key: string): string => {
    const langData = locales[language] as Record<string, string> | undefined;
    return langData?.[key] || key;
  }, [language]);

  const localizationContextValue = useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    t
  }), [language, handleSetLanguage, t]);
  
  const themeContextValue = useMemo(() => ({
    theme,
    setTheme,
  }), [theme, setTheme]);

  const renderView = () => {
    switch (view) {
      case 'home': return <HomePage setActiveView={setView} />;
      case 'translate': return <HieroglyphTranslator />;
      case 'render': return <RealisticRenderer />;
      case 'library': return <Library />;
      case 'learn': return <LearningHub />;
      case 'museum': return <MuseumExplorer />;
      case 'gallery3d': return <Gallery3D />; // Add case for new component
      case 'blog': return <Blog />;
      case 'contact': return <Contact />;
      case 'assistant': return <AiAssistant />;
      default: return <HomePage setActiveView={setView} />;
    }
  };
  
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <LocalizationContext.Provider value={localizationContextValue}>
      <ThemeContext.Provider value={themeContextValue}>
        <div className={`flex flex-col min-h-screen transition-colors duration-500 font-sans bg-light-bg dark:bg-dark-bg ${language === 'ar' ? 'font-kufi' : ''}`}>
          <Header activeView={view} setActiveView={setView} />
          <main className="flex-grow container mx-auto px-4 py-8 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={view}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </ThemeContext.Provider>
    </LocalizationContext.Provider>
  );
};

export default App;
