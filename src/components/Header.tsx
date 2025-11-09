
import React from 'react';
import { motion } from 'framer-motion';
import { View, Language, Theme, ThemeContext } from '../App';
import { useLocalization } from '../hooks/useLocalization';

interface HeaderProps {
  activeView: View;
  setActiveView: (view: View) => void;
}

const AnkhIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gold">
        <path d="M12 10v12"/>
        <path d="M12 5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
        <path d="M4 10h16"/>
    </svg>
);

const ThemeToggle: React.FC = () => {
    const { theme, setTheme } = React.useContext(ThemeContext)!;
    const { t } = useLocalization();
    const isDark = theme === 'dark';

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <button
            onClick={toggleTheme}
            className="w-12 h-6 rounded-full p-1 relative bg-charcoal dark:bg-sand flex items-center"
            aria-label={t('toggleTheme')}
        >
            <motion.div
                className="w-4 h-4 rounded-full bg-sand dark:bg-charcoal"
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                style={{ marginLeft: isDark ? 'auto' : '0' }}
            />
        </button>
    );
};


const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const { language, setLanguage, t } = useLocalization();

  const navItems: { view: View; labelKey: string }[] = [
    { view: 'home', labelKey: 'navHome' },
    { view: 'translate', labelKey: 'navTranslate' },
    { view: 'render', labelKey: 'navRender' },
    { view: 'gallery3d', labelKey: 'navGallery3D' },
    { view: 'library', labelKey: 'navLibrary' },
    { view: 'learn', labelKey: 'navLearn' },
    { view: 'museum', labelKey: 'navMuseum' },
    { view: 'blog', labelKey: 'navBlog' },
    { view: 'assistant', labelKey: 'navAssistant' },
    { view: 'contact', labelKey: 'navContact' },
  ];

  return (
    <header className="bg-black/80 backdrop-blur-md shadow-lg text-sand sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <motion.div 
            className="flex items-center space-x-2 rtl:space-x-reverse cursor-pointer" 
            onClick={() => setActiveView('home')}
            whileHover={{ scale: 1.05 }}
            >
             <AnkhIcon />
            <h1 className="text-2xl md:text-3xl font-display font-bold text-gold">{t('appTitle')}</h1>
          </motion.div>
          
          <nav className="hidden lg:flex items-center space-x-1 rtl:space-x-reverse">
            {navItems.map(item => (
              <motion.button
                key={item.view}
                onClick={() => setActiveView(item.view)}
                className={`relative px-3 py-2 rounded-md text-sm font-semibold transition-colors duration-300 hover:text-gold ${activeView === item.view ? 'text-gold' : 'text-sand'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {t(item.labelKey)}
                {activeView === item.view && (
                    <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" layoutId="underline" />
                )}
              </motion.button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="p-2 rounded-full hover:bg-charcoal transition-colors duration-300 font-bold text-lg"
            >
              {language === 'en' ? 'ع' : 'En'}
            </button>
          </div>
        </div>
        
        {/* Mobile Nav */}
        <div className="lg:hidden pb-3">
            <div className="flex justify-center flex-wrap gap-2">
                {navItems.map(item => (
                <button
                    key={item.view}
                    onClick={() => setActiveView(item.view)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors duration-300 ${activeView === item.view ? 'bg-gold text-black' : 'bg-charcoal text-sand'}`}
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
