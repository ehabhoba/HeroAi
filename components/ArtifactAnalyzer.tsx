
import React, { useState } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import * as geminiService from '../services/geminiService';
import Markdown from 'react-markdown';


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

const ArtifactAnalyzer: React.FC = () => {
  const { t, language } = useLocalization();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setResult('');
    setError('');
  };

  const handleAnalyze = async () => {
    if (!imageFile) {
        setError(t('noImageSelected'));
        return;
    }
    setLoading(true);
    setError('');
    setResult('');
    try {
      const base64Image = await fileToBase64(imageFile);
      const analysis = await geminiService.analyzeArtifact(base64Image, language);
      setResult(analysis);
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
        <h2 className="text-4xl font-cinzel font-bold text-nile-blue">{t('analyzerTitle')}</h2>
        <p className="text-lg text-stone-gray mt-2">{t('analyzerDescription')}</p>
      </div>

      {!preview && <ImageUploader onImageSelect={handleImageSelect} promptText={t('selectArtifactImage')} />}
      
      {preview && (
        <div className="flex flex-col items-center gap-6">
          <div className="w-full max-w-md rounded-lg overflow-hidden shadow-xl border-4 border-sand-dark">
            <img src={preview} alt="Artifact preview" className="w-full h-auto object-contain" />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-8 py-3 bg-pharaoh-gold text-nile-blue font-bold text-lg rounded-lg shadow-md hover:bg-sand-dark transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {t('analyze')}
          </button>
        </div>
      )}

      {loading && <LoadingSpinner message={t('analyzing')} />}

      {error && <p className="text-center text-red-600 font-bold">{error}</p>}

      {result && (
        <div className="w-full max-w-3xl mx-auto bg-white/50 p-6 rounded-lg shadow-lg border border-sand-dark">
          <h3 className="text-2xl font-cinzel font-bold text-nile-blue mb-4">{t('analysisResult')}</h3>
          <div className="prose max-w-none text-stone-gray">
             <Markdown>{result}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtifactAnalyzer;
