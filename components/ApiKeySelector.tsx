
import React from 'react';

interface ApiKeySelectorProps {
  onApiKeySelected: () => void;
}

export const ApiKeySelector: React.FC<ApiKeySelectorProps> = ({ onApiKeySelected }) => {
  const handleSelectKey = async () => {
    if (window.aistudio) {
      try {
        await window.aistudio.openSelectKey();
        // Assume selection was successful and let the parent component handle re-checking.
        onApiKeySelected();
      } catch (e) {
        console.error('Error opening select key dialog:', e);
      }
    } else {
        alert("aistudio context not found. Cannot select API key.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-4">
      <div className="max-w-md p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold mb-4 text-white">API Key Required for Veo</h2>
        <p className="text-gray-400 mb-6">
          To use the Veo video generation models, you must select an API key. Please ensure your project is configured for billing.
        </p>
        <button
          onClick={handleSelectKey}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          Select API Key
        </button>
        <p className="text-xs text-gray-500 mt-4">
          For more information on billing, please visit the{' '}
          <a
            href="https://ai.google.dev/gemini-api/docs/billing"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            official documentation
          </a>
          .
        </p>
      </div>
    </div>
  );
};
