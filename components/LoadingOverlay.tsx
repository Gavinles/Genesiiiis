
import React, { useState, useEffect } from 'react';

const messages = [
  "Warming up the digital director's chair...",
  "Teaching pixels to dance...",
  "Composing a symphony of light and color...",
  "Rendering reality, one frame at a time...",
  "Unleashing creative algorithms...",
  "Please wait, magic is in the making...",
  "Generating your cinematic masterpiece...",
];

interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading }) => {
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setMessage(messages[Math.floor(Math.random() * messages.length)]);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      <p className="mt-6 text-lg text-white font-medium">{message}</p>
    </div>
  );
};
