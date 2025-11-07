
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HieroglyphTranslator from './components/HieroglyphTranslator';
import ArtifactAnalyzer from './components/ArtifactAnalyzer';
import RealisticRenderer from './components/RealisticRenderer';
import MuseumExplorer from './components/MuseumExplorer';
import AiAssistant from './components/AiAssistant';
import { locales } from './data/locales';

export type Language = 'en' | 'ar';
export type View = 'translator' | 'analyzer' | 'renderer' | 'explorer' | 'assistant';

interface LocalizationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const LocalizationContext = React.createContext<LocalizationContextType | null>(null);

const App: React.FC = () => {
  const [view, setView] = useState<View>('translator');
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
  }, []);

  const t = useCallback((key: string): string => {
    return locales[language][key] || key;
  }, [language]);

  const localizationContextValue = useMemo(() => ({
    language,
    setLanguage: handleSetLanguage,
    t
  }), [language, handleSetLanguage, t]);

  const renderView = () => {
    switch (view) {
      case 'translator':
        return <HieroglyphTranslator />;
      case 'analyzer':
        return <ArtifactAnalyzer />;
      case 'renderer':
        return <RealisticRenderer />;
      case 'explorer':
        return <MuseumExplorer />;
      case 'assistant':
        return <AiAssistant />;
      default:
        return <HieroglyphTranslator />;
    }
  };

  return (
    <LocalizationContext.Provider value={localizationContextValue}>
      <div className={`flex flex-col min-h-screen bg-papyrus-beige text-stone-gray font-cairo ${language === 'ar' ? 'rtl' : 'ltr'}`}>
        <Header activeView={view} setActiveView={setView} />
        <main className="flex-grow container mx-auto px-4 py-8">
          {renderView()}
        </main>
        <Footer />
      </div>
    </LocalizationContext.Provider>
  );
};

export default App;
