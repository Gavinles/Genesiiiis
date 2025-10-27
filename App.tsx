import React, { useState, useEffect, useCallback } from 'react';
import { generateVideo } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { VideoPlayer } from './components/VideoPlayer';
import { ApiKeySelector } from './components/ApiKeySelector';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { LoadingOverlay } from './components/LoadingOverlay';
import type { AspectRatio } from './types';
import { GithubIcon } from './components/Icons';

// FIX: To resolve declaration merging issues, define a named interface for the `aistudio` object.
interface AIStudio {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}

declare global {
  interface Window {
    aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [apiKeySelected, setApiKeySelected] = useState(false);
  const [checkingApiKey, setCheckingApiKey] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkApiKey = useCallback(async () => {
    if (window.aistudio) {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      } catch (e) {
        console.error('Error checking for API key:', e);
        setApiKeySelected(false);
      } finally {
        setCheckingApiKey(false);
      }
    } else {
      // If aistudio is not available, assume we are in a dev environment and proceed
      setApiKeySelected(true); 
      setCheckingApiKey(false);
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  const handleApiKeySelected = () => {
    setApiKeySelected(true);
  };
  
  const handleGenerateVideo = async () => {
    if (!imageFile) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      const videoBlob = await generateVideo(imageFile, prompt, aspectRatio);
      const url = URL.createObjectURL(videoBlob);
      setVideoUrl(url);
    } catch (err: unknown) {
      let errorMessage = 'An unknown error occurred.';
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      
      if (errorMessage.includes('Requested entity was not found.')) {
        setError("Your API key is invalid. Please select a valid key.");
        setApiKeySelected(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (checkingApiKey) {
      return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    
    if (!apiKeySelected) {
      return <ApiKeySelector onApiKeySelected={handleApiKeySelected} />;
    }

    return (
      <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          Veo Video Generator
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Upload an image, describe a scene, and let Veo create a video.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <ImageUploader onImageUpload={setImageFile} />
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
                Prompt
              </label>
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A neon hologram of a cat driving at top speed"
                className="w-full h-32 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            <AspectRatioSelector
              selectedAspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
            />
          </div>
          <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg p-4 border border-gray-700 min-h-[300px] md:min-h-0">
            {videoUrl ? (
              <VideoPlayer src={videoUrl} />
            ) : (
              <div className="text-center text-gray-500">
                <p>Your generated video will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="mt-8 text-center">
          <button
            onClick={handleGenerateVideo}
            disabled={isLoading || !imageFile}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-full hover:scale-105 transform transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
          >
            {isLoading ? 'Generating...' : 'Generate Video'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center font-sans relative">
      <LoadingOverlay isLoading={isLoading} />
      {renderContent()}
      <footer className="absolute bottom-4 text-gray-500 text-sm">
        <a href="https://github.com/google/generative-ai-docs/tree/main/site/en/gemini-api/docs/get-started/tutorial?app=react" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
          <GithubIcon />
          <span>View on GitHub</span>
        </a>
      </footer>
    </main>
  );
};

export default App;
