
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { MuseumArtifact } from '../types';
import { useLocalization } from '../hooks/useLocalization';
import Artifact3DViewer from './Artifact3DViewer';
import { AppContext } from '../App';

interface ArtifactModalProps {
    artifact: MuseumArtifact;
    onClose: () => void;
}

const Backdrop: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ children, onClick }) => {
    return (
        <motion.div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            {children}
        </motion.div>
    );
};

const modalVariants = {
    hidden: { y: "-100vh", opacity: 0 },
    visible: { y: "0", opacity: 1, transition: { duration: 0.3, type: "spring", damping: 25, stiffness: 500 } },
    exit: { y: "100vh", opacity: 0, transition: { duration: 0.3 } },
};

const ArtifactModal: React.FC<ArtifactModalProps> = ({ artifact, onClose }) => {
    const { t, language } = useLocalization();
    const appContext = useContext(AppContext);

    const handleViewInRenderer = () => {
        if (appContext) {
            appContext.viewInRenderer(artifact.imageUrl);
            onClose(); // Close modal after clicking
        }
    };

    return (
        <Backdrop onClick={onClose}>
            <motion.div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl max-h-[90vh] bg-light-paper dark:bg-dark-paper rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div className="w-full md:w-1/2 h-64 md:h-auto bg-charcoal dark:bg-black relative">
                    {artifact.modelUrl ? (
                        <Artifact3DViewer modelUrl={artifact.modelUrl} />
                    ) : (
                        <img src={artifact.imageUrl} alt={artifact.name[language]} className="w-full h-full object-contain" />
                    )}
                </div>
                <div className="p-6 flex flex-col flex-1 overflow-y-auto">
                    <div className="flex-1">
                        <h2 className="text-3xl font-display text-gold mb-2">{artifact.name[language]}</h2>
                        <div className="space-y-2 text-sm text-light-text dark:text-dark-text mb-4">
                            <p><strong className='font-bold'>{t('era')}:</strong> {artifact.era[language]}</p>
                            <p><strong className='font-bold'>{t('discoveryYear')}:</strong> {artifact.discoveryYear}</p>
                            <p><strong className='font-bold'>{t('location')}:</strong> {artifact.location[language]}</p>
                        </div>
                        <p className="text-light-text dark:text-dark-text">{artifact.description[language]}</p>
                    </div>
                    <div className="mt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={handleViewInRenderer}
                            className="flex-1 py-3 px-4 bg-gold text-black font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity"
                        >
                            {t('viewInRenderer')}
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-charcoal text-sand font-bold rounded-lg shadow-md hover:bg-black transition-colors"
                        >
                            {t('close')}
                        </button>
                    </div>
                </div>
            </motion.div>
        </Backdrop>
    );
};

export default ArtifactModal;
