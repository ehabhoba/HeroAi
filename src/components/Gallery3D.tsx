
import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { motion } from 'framer-motion';
import { artifacts } from '../data/museumArtifacts';

const Gallery3D: React.FC = () => {
  const { t, language } = useLocalization();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display font-bold text-gold">{t('gallery3DTitle')}</h2>
        <p className="text-lg text-light-text dark:text-dark-text mt-2 max-w-3xl mx-auto">{t('gallery3DDescription')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1000px]">
        {artifacts.map((artifact, index) => (
          <motion.div
            key={artifact.id}
            className="relative h-80 group bg-light-paper dark:bg-dark-paper rounded-lg shadow-lg border border-gold overflow-hidden [transform-style:preserve-3d] transition-all duration-700 hover:[transform:rotateY(180deg)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.15 }}
          >
            {/* Front */}
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <img src={artifact.imageUrl} alt={artifact.name[language]} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-xl font-bold font-display text-gold">{artifact.name[language]}</h3>
              </div>
            </div>
            {/* Back */}
            <div className="absolute inset-0 p-4 bg-light-paper dark:bg-dark-paper [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-center">
                <h3 className="text-xl font-bold font-display text-gold mb-2">{artifact.name[language]}</h3>
                <p className="text-sm font-semibold text-light-text dark:text-dark-text opacity-80 mb-2">{artifact.era[language]}</p>
                <p className="text-sm text-light-text dark:text-dark-text overflow-y-auto max-h-40">{artifact.description[language]}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Gallery3D;
