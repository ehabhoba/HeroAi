
import React from 'react';
import { View, Language } from '../App';
import { useLocalization } from '../hooks/useLocalization';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const AnkhIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-pharaoh-gold">
        <path d="M12 10v12"/>
        <path d="M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        <path d="M4 10h16"/>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const { language, setLanguage, t } = useLocalization();

  const navItems: { view: View; labelKey: string }[] = [
    { view: 'translator', labelKey: 'navTranslator' },
    { view: 'analyzer', labelKey: 'navAnalyzer' },
    { view: 'renderer', labelKey: 'navRenderer' },
    { view: 'explorer', labelKey: 'navExplorer' },
    { view: 'assistant', labelKey: 'navAssistant' },
  ];

  return (
    <header className="bg-nile-blue/95 backdrop-blur-sm shadow-lg text-papyrus-beige sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
             <AnkhIcon />
            <h1 className="text-2xl md:text-3xl font-cinzel font-bold text-pharaoh-gold">{t('appTitle')}</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            {navItems.map(item => (
              <button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300 ${activeView === item.view ? 'bg-pharaoh-gold text-nile-blue' : 'hover:bg-stone-gray'}`}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </nav>

          <div className="flex items-center">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="p-2 rounded-full hover:bg-stone-gray transition-colors duration-300"
            >
              {language === 'en' ? '🇪🇬' : '🇬🇧'}
              <span className="sr-only">Toggle Language</span>
            </button>
          </div>
        </div>
        
        {/* Mobile Nav */}
        <div className="md:hidden pb-2">
            <div className="flex justify-center flex-wrap gap-2">
                {navItems.map(item => (
                <button
                    key={item.view}
                    onClick={() => setActiveView(item.view)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-300 ${activeView === item.view ? 'bg-pharaoh-gold text-nile-blue' : 'bg-stone-gray'}`}
                >
                    {t(item.labelKey)}
                </button>
                ))}
            </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
