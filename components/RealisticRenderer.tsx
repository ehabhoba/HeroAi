import React, { useState, useEffect } from 'react';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import ImageComparator from './ImageComparator';
import { useLocalization } from '../hooks/useLocalization';
import { generateRealisticRender } from '../services/geminiService';
import { saveAnalysis } from '../services/supabaseService';

interface RealisticRendererProps {
    initialImageUrl?: string | null;
    onClearInitialImage: () => void;
}

const RealisticRenderer: React.FC<RealisticRendererProps> = ({ initialImageUrl, onClearInitialImage }) => {
  const { t } = useLocalization();
  const [originalImage, setOriginalImage] = useState<string>('');
  const [renderedImage, setRenderedImage] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialImageUrl) {
        const handleInitialImage = async () => {
            setLoading(true);
            setError('');
            setRenderedImage('');
            setDescription('');
            setOriginalImage(initialImageUrl);
            
            try {
                // Fetch the image and convert to a File object.
                // NOTE: This may fail due to CORS policy on the image host.
                // A server-side proxy would be needed for a robust solution.
                const response = await fetch(initialImageUrl);
                if (!response.ok) {
                    throw new Error(`Failed to fetch image: ${response.statusText}`);
                }
                const blob = await response.blob();
                const filename = initialImageUrl.substring(initialImageUrl.lastIndexOf('/') + 1).split('?')[0] || 'artifact.jpg';
                const file = new File([blob], filename, { type: blob.type || 'image/jpeg' });

                const [resultUrl, resultDescription] = await generateRealisticRender(file);
                setRenderedImage(resultUrl);
                setDescription(resultDescription);
                
                await saveAnalysis({
                    type: 'render',
                    prompt: `Render from Gallery: ${filename}`,
                    result_url: resultUrl,
                });
            } catch (err) {
                console.error(err);
                setError(`${t('errorOccurred')} Could not load image from URL due to security restrictions (CORS). Please download it and upload it manually.`);
                // Reset original image so the uploader shows up
                setOriginalImage('');
            } finally {
                setLoading(false);
                onClearInitialImage(); // Clear the prop to prevent re-triggering
            }
        };

        handleInitialImage();
    }
  }, [initialImageUrl, onClearInitialImage, t]);


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

  const handleReset = () => {
    setOriginalImage('');
    setRenderedImage('');
    setDescription('');
    setError('');
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display font-bold text-gold">{t('rendererTitle')}</h2>
        <p className="text-lg text-light-text dark:text-dark-text mt-2 max-w-2xl mx-auto">{t('rendererDescription')}</p>
      </div>

      {!originalImage && !loading && <ImageUploader onImageSelect={handleImageSelect} promptText={t('rendererImagePrompt')} />}
      
      {loading && <LoadingSpinner message={t('loadingRenderer')} />}
      
      {error && !loading && (
          <div className="text-center text-red-500 bg-red-500/10 p-4 rounded-lg">
              <p>{error}</p>
          </div>
      )}

      {originalImage && !loading && renderedImage && (
         <div className="flex flex-col items-center gap-6">
            <ImageComparator original={originalImage} rendered={renderedImage} />
            {description && <p className="text-center italic text-lg text-light-text dark:text-dark-text max-w-3xl">"{description}"</p>}
            <div className="flex flex-wrap justify-center gap-4">
                 <button 
                    onClick={handleReset}
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
