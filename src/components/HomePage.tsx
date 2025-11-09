
import React from 'react';
import { motion } from 'framer-motion';
import { useLocalization } from '../hooks/useLocalization';
import { View } from '../App';

interface HomePageProps {
    setActiveView: (view: View) => void;
}

const ToolCard: React.FC<{title: string, description: string, onClick: () => void}> = ({title, description, onClick}) => {
    return (
        <motion.div
            className="bg-light-paper dark:bg-dark-paper p-6 rounded-lg shadow-lg border border-light-border dark:border-dark-border cursor-pointer text-center h-full flex flex-col justify-center"
            whileHover={{ scale: 1.05, y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            onClick={onClick}
        >
            <h3 className="text-2xl font-display text-gold mb-2">{title}</h3>
            <p className="text-light-text dark:text-dark-text">{description}</p>
        </motion.div>
    )
}

const HomePage: React.FC<HomePageProps> = ({setActiveView}) => {
    const { t } = useLocalization();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-16">
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
                <h1 className="text-5xl md:text-7xl font-display font-bold text-gold">{t('homeTitle')}</h1>
                <p className="text-xl md:text-2xl text-light-text dark:text-dark-text mt-4 max-w-3xl mx-auto">{t('homeSubtitle')}</p>
            </motion.div>

            <div className="w-full max-w-6xl mx-auto">
                <h2 className="text-4xl font-display text-center text-gold mb-8">{t('homeExploreTools')}</h2>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                    <motion.div variants={itemVariants}>
                      <ToolCard 
                        title={t('homeTranslatorCardTitle')} 
                        description={t('homeTranslatorCardDesc')} 
                        onClick={() => setActiveView('translate')} 
                      />
                    </motion.div>
                     <motion.div variants={itemVariants}>
                      <ToolCard 
                        title={t('homeRendererCardTitle')} 
                        description={t('homeRendererCardDesc')} 
                        onClick={() => setActiveView('render')} 
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                        <ToolCard 
                          title={t('homeGallery3DCardTitle')} 
                          description={t('homeGallery3DCardDesc')} 
                          onClick={() => setActiveView('gallery3d')} 
                        />
                      </motion.div>
                     <motion.div variants={itemVariants}>
                      <ToolCard 
                        title={t('homeLibraryCardTitle')} 
                        description={t('homeLibraryCardDesc')} 
                        onClick={() => setActiveView('library')} 
                      />
                    </motion.div>
                     <motion.div variants={itemVariants}>
                      <ToolCard 
                        title={t('homeLearnCardTitle')} 
                        description={t('homeLearnCardDesc')} 
                        onClick={() => setActiveView('learn')} 
                      />
                    </motion.div>
                    <motion.div variants={itemVariants}>
                      <ToolCard 
                        title={t('navMuseum')} 
                        description={t('explorerDescription')} 
                        onClick={() => setActiveView('museum')} 
                      />
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default HomePage;
