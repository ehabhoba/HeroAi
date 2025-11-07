
import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import * as geminiService from '../services/geminiService';
import ImageComparator from './ImageComparator';

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            reject(new Error('Failed to read file as base64'));
        }
    };
    reader.onerror = (error) => reject(error);
  });

const RealisticRenderer: React.FC = () => {
  const { t } = useLocalization();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [renderedImage, setRenderedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setOriginalImage(URL.createObjectURL(file));
    setRenderedImage(null);
    setError('');
  };

  const handleRender = async () => {
    if (!imageFile) {
        setError(t('noImageSelected'));
        return;
    }
    setLoading(true);
    setError('');
    setRenderedImage(null);
    try {
      const base64Image = await fileToBase64(imageFile);
      const generatedImage = await geminiService.renderRealisticImage(base64Image);
      setRenderedImage(`data:image/jpeg;base64,${generatedImage}`);
    } catch (err) {
      console.error(err);
      setError(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-cinzel font-bold text-nile-blue">{t('rendererTitle')}</h2>
        <p className="text-lg text-stone-gray mt-2">{t('rendererDescription')}</p>
      </div>

      {!originalImage && <ImageUploader onImageSelect={handleImageSelect} promptText={t('selectRenderImage')} />}

      {originalImage && !renderedImage && !loading && (
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-md rounded-lg overflow-hidden shadow-xl border-4 border-sand-dark">
            <img src={originalImage} alt="Original artifact preview" className="w-full h-auto object-contain" />
          </div>
          <button
            onClick={handleRender}
            disabled={loading}
            className="px-8 py-3 bg-pharaoh-gold text-nile-blue font-bold text-lg rounded-lg shadow-md hover:bg-sand-dark transition-all duration-300 disabled:bg-gray-400"
          >
            {t('render')}
          </button>
        </div>
      )}

      {loading && <LoadingSpinner message={t('generating')} />}
      
      {error && <p className="text-center text-red-600 font-bold">{error}</p>}
      
      {originalImage && renderedImage && (
        <div className="w-full max-w-4xl mx-auto">
            <h3 className="text-2xl font-cinzel text-center font-bold text-nile-blue mb-4">{t('comparisonView')}</h3>
            <ImageComparator
                original={originalImage}
                rendered={renderedImage}
            />
        </div>
      )}
    </div>
  );
};

export default RealisticRenderer;
