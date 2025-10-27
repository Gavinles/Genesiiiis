
import { GoogleGenAI } from "@google/genai";
import type { AspectRatio } from '../types';

const POLLING_INTERVAL_MS = 10000;

const fileToGenerativePart = async (file: File): Promise<string> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  return base64EncodedDataPromise;
};

export const generateVideo = async (
  imageFile: File,
  prompt: string,
  aspectRatio: AspectRatio,
): Promise<Blob> => {
  // IMPORTANT: Create a new GoogleGenAI instance before each call
  // to ensure it uses the most up-to-date API key from the aistudio dialog.
  if (!process.env.API_KEY) {
      throw new Error("API_KEY environment variable not set. Please select a key.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const imageBase64 = await fileToGenerativePart(imageFile);

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: {
      imageBytes: imageBase64,
      mimeType: imageFile.type,
    },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio,
    },
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL_MS));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) {
    throw new Error('Video generation failed: No download link found.');
  }
  
  // The response.body contains the MP4 bytes. You must append an API key when fetching from the download link.
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) {
    throw new Error(`Failed to download video: ${videoResponse.statusText}`);
  }

  return videoResponse.blob();
};
