
import React from 'react';
import type { AspectRatio } from '../types';
import { LandscapeIcon, PortraitIcon } from './Icons';

interface AspectRatioSelectorProps {
  selectedAspectRatio: AspectRatio;
  onAspectRatioChange: (ratio: AspectRatio) => void;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedAspectRatio, onAspectRatioChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Aspect Ratio
      </label>
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onAspectRatioChange('16:9')}
          className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-200 ${
            selectedAspectRatio === '16:9' ? 'bg-blue-600 border-blue-500' : 'bg-gray-800 border-gray-700 hover:border-blue-500'
          }`}
        >
          <LandscapeIcon />
          <span className="mt-2 text-sm">16:9 (Landscape)</span>
        </button>
        <button
          onClick={() => onAspectRatioChange('9:16')}
          className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all duration-200 ${
            selectedAspectRatio === '9:16' ? 'bg-blue-600 border-blue-500' : 'bg-gray-800 border-gray-700 hover:border-blue-500'
          }`}
        >
          <PortraitIcon />
          <span className="mt-2 text-sm">9:16 (Portrait)</span>
        </button>
      </div>
    </div>
  );
};
