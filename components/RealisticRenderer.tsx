import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import ImageComparator from './ImageComparator';
import { useLocalization } from '../hooks/useLocalization';
import { generateRealisticRender } from '../services/geminiService';
import { saveAnalysis } from '../services/supabaseService';

const RealisticRenderer: React.FC = () => {
  const { t } = useLocalization();
  const [originalImage, setOriginalImage] = useState<string>('');
  const [renderedImage, setRenderedImage] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageSelect = async (file: File) => {
    const originalImageUrl = URL.createObjectURL(file);
    setOriginalImage(originalImageUrl);
    setRenderedImage('');
    setDescription('');
    setError('');
    setLoading(true);

    try {
      const [resultUrl, resultDescription] = await generateRealisticRender(file);
      setRenderedImage(resultUrl);
      setDescription(resultDescription);
      
      // Save to history
      await saveAnalysis({
          type: 'render',
          prompt: "Realistic 2025 Render",
          result_url: resultUrl,
      });

    } catch (err) {
      console.error(err);
      setError(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = renderedImage;
    link.download = 'HieroAI_Render.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display font-bold text-gold">{t('rendererTitle')}</h2>
        <p className="text-lg text-light-text dark:text-dark-text mt-2 max-w-2xl mx-auto">{t('rendererDescription')}</p>
      </div>

      {!originalImage && !loading && <ImageUploader onImageSelect={handleImageSelect} promptText={t('rendererImagePrompt')} />}
      
      {loading && <LoadingSpinner message={t('loadingRenderer')} />}
      {error && <p className="text-center text-red-500">{error}</p>}

      {originalImage && renderedImage && (
         <div className="flex flex-col items-center gap-6">
            <ImageComparator original={originalImage} rendered={renderedImage} />
            {description && <p className="text-center italic text-lg text-light-text dark:text-dark-text max-w-3xl">"{description}"</p>}
            <div className="flex flex-wrap justify-center gap-4">
                 <button 
                    onClick={() => {
                        setOriginalImage('');
                        setRenderedImage('');
                        setDescription('');
                        setError('');
                    }}
                    className="py-2 px-6 bg-charcoal text-sand font-bold rounded-lg shadow-md hover:bg-black transition-all duration-300"
                >
                    {t('renderAnother')}
                </button>
                 <button 
                    onClick={handleDownload}
                    className="py-2 px-6 bg-gold text-black font-bold rounded-lg shadow-md hover:opacity-90 transition-all duration-300"
                >
                    {t('downloadRender')}
                </button>
            </div>
         </div>
      )}
    </div>
  );
};

export default RealisticRenderer;
