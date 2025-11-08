import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocalization } from '../hooks/useLocalization';
import { artifacts } from '../data/museumArtifacts';
import { MuseumArtifact } from '../types';
import ArtifactModal from './ArtifactModal';

const ArtifactCard: React.FC<{ artifact: MuseumArtifact, onClick: () => void }> = ({ artifact, onClick }) => {
    const { language } = useLocalization();
    return (
        <motion.div 
            className="bg-light-paper dark:bg-dark-paper rounded-lg shadow-lg overflow-hidden border border-light-border dark:border-dark-border cursor-pointer"
            whileHover={{ y:-5, scale:1.03 }}
            onClick={onClick}
        >
            <img src={artifact.imageUrl} alt={artifact.name[language]} className="w-full h-56 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-bold font-display text-gold">{artifact.name[language]}</h3>
                <p className="text-sm font-semibold text-light-text dark:text-dark-text opacity-80 my-1">{artifact.era[language]}</p>
                <p className="text-light-text dark:text-dark-text text-sm mt-2 h-20 overflow-y-auto">{artifact.description[language]}</p>
            </div>
        </motion.div>
    );
}

const MuseumExplorer: React.FC = () => {
  const { t } = useLocalization();
  const [selectedArtifact, setSelectedArtifact] = useState<MuseumArtifact | null>(null);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display font-bold text-gold">{t('explorerTitle')}</h2>
        <p className="text-lg text-light-text dark:text-dark-text mt-2 max-w-2xl mx-auto">{t('explorerDescription')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {artifacts.map(artifact => (
            <ArtifactCard key={artifact.id} artifact={artifact} onClick={() => setSelectedArtifact(artifact)} />
        ))}
      </div>

      <AnimatePresence>
        {selectedArtifact && (
            <ArtifactModal artifact={selectedArtifact} onClose={() => setSelectedArtifact(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MuseumExplorer;
