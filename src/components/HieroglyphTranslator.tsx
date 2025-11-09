
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import LoadingSpinner from './LoadingSpinner';
import ResultsPanel from './ResultsPanel';
import { useLocalization } from '../hooks/useLocalization';
import { analyzeAndTranslateImage } from '../services/geminiService';
import { saveAnalysis } from '../services/supabaseService';
import { HieroglyphTranslation } from '../types';

const HieroglyphTranslator: React.FC = () => {
  const { t } = useLocalization();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [analysisResult, setAnalysisResult] = useState<HieroglyphTranslation | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setAnalysisResult(null);
    setError('');
  };
  
  const handleTranslate = async () => {
    if (!imageFile) {
      setError(t('imageRequiredError'));
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const userPrompt = prompt || "Translate the hieroglyphs and analyze the artifact.";
      const resultJson = await analyzeAndTranslateImage(imageFile, userPrompt);
      const result: HieroglyphTranslation = JSON.parse(resultJson);
      setAnalysisResult(result);
      
      // Save to history
      await saveAnalysis({
        type: 'translation',
        prompt: userPrompt,
        result_url: URL.createObjectURL(imageFile),
      });

    } catch (err) {
      console.error(err);
      setError(t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };
  
  const formatAnalysisForDisplay = (result: HieroglyphTranslation): string => {
    return `
### ${t('translation')}
${result.translation}
***
### ${t('context')}
${result.context}
***
### ${t('symbolism')}
${result.symbolism}
***
### ${t('artifact_type')}
${result.artifact_type}
    `;
  };
  
  const prepareTextForSpeech = (result: HieroglyphTranslation): string => {
    return `
      ${t('translation')}: ${result.translation}.
      ${t('context')}: ${result.context}.
      ${t('symbolism')}: ${result.symbolism}.
      ${t('artifact_type')}: ${result.artifact_type}.
    `;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-display font-bold text-gold">{t('translatorTitle')}</h2>
        <p className="text-lg text-light-text dark:text-dark-text mt-2 max-w-2xl mx-auto">{t('translatorDescription')}</p>
      </div>

      {!imageFile && <ImageUploader onImageSelect={handleImageSelect} promptText={t('translatorImagePrompt')} />}
      
      {imageFile && !analysisResult && !loading && (
        <div className="flex flex-col items-center gap-8">
            <div className='w-full max-w-lg'>
                <img src={URL.createObjectURL(imageFile)} alt="Selected artifact" className="rounded-lg shadow-lg w-full object-contain max-h-96" />
            </div>
            
            <div className="w-full max-w-lg space-y-4">
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('translatorTextInputPlaceholder')}
                    className="w-full p-3 border border-light-border dark:border-dark-border rounded-lg focus:ring-2 focus:ring-gold focus:outline-none bg-white dark:bg-charcoal text-light-text dark:text-dark-text"
                    rows={3}
                />
                <button
                    onClick={handleTranslate}
                    disabled={loading}
                    className="w-full py-3 px-6 bg-gold text-black font-bold rounded-lg shadow-md hover:opacity-90 transition-opacity disabled:bg-gray-400"
                >
                    {loading ? t('analyzing') : t('startAnalysis')}
                </button>
            </div>
        </div>
      )}

      {loading && <LoadingSpinner message={t('loadingTranslation')} />}
      {error && <p className="text-center text-red-500">{error}</p>}
      
      {analysisResult && (
        <div className="flex flex-col items-center gap-4">
            <ResultsPanel 
              title={t('analysisResults')} 
              content={formatAnalysisForDisplay(analysisResult)}
              textToSpeak={prepareTextForSpeech(analysisResult)}
            />
            <button 
                onClick={() => {
                    setAnalysisResult(null);
                    setImageFile(null);
                    setPrompt('');
                    setError('');
                }}
                className="py-2 px-6 bg-charcoal text-sand font-bold rounded-lg shadow-md hover:bg-black transition-all duration-300"
            >
                {t('translateAnother')}
            </button>
        </div>
      )}
    </div>
  );
};

export default HieroglyphTranslator;
