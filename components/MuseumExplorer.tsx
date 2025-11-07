
import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { artifacts } from '../data/museumArtifacts';
import { MuseumArtifact } from '../types';

const ArtifactCard: React.FC<{ artifact: MuseumArtifact }> = ({ artifact }) => {
    const { language } = useLocalization();
    return (
        <div className="bg-white/60 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl border border-sand-dark/50">
            <img src={artifact.imageUrl} alt={artifact.name[language]} className="w-full h-56 object-cover" />
            <div className="p-4">
                <h3 className="text-xl font-bold font-cinzel text-nile-blue">{artifact.name[language]}</h3>
                <p className="text-sm font-semibold text-pharaoh-gold my-1">{artifact.era[language]}</p>
                <p className="text-stone-gray text-sm mt-2 h-20 overflow-y-auto">{artifact.description[language]}</p>
            </div>
        </div>
    );
}

const MuseumExplorer: React.FC = () => {
  const { t } = useLocalization();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-cinzel font-bold text-nile-blue">{t('explorerTitle')}</h2>
        <p className="text-lg text-stone-gray mt-2">{t('explorerDescription')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {artifacts.map(artifact => (
            <ArtifactCard key={artifact.id} artifact={artifact} />
        ))}
      </div>
    </div>
  );
};

export default MuseumExplorer;
