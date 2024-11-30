'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Image from 'next/image';

interface EmotionState {
  energy: number;
  mood: number;
  intensity: number;
  complexity: number;
}

// Move our descriptors outside the component to avoid re-creation
const artStyles = [
  "abstract expressionism", "digital art", "fluid art",
  "geometric abstraction", "minimalist art"
];

const descriptors = {
  energy: {
    high: ["dynamic", "vibrant", "energetic"],
    low: ["calm", "serene", "peaceful"]
  },
  mood: {
    high: ["warm", "bright", "positive"],
    low: ["cool", "muted", "contemplative"]
  }
};

export default function EmotionArtGenerator() {
  // Add mounted state to handle client-side rendering
  const [mounted, setMounted] = useState(false);
  const [emotions, setEmotions] = useState<EmotionState>({
    energy: 50,
    mood: 50,
    intensity: 50,
    complexity: 50
  });
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Set mounted state once component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const getRandomElement = (arr: string[]) => {
    // Only generate random values after mounting
    if (!mounted) return arr[0];
    return arr[Math.floor(Math.random() * arr.length)];
  };

  const generatePrompt = (emotionData: EmotionState) => {
    if (!mounted) return '';
    
    const style = getRandomElement(artStyles);
    const energyDesc = getRandomElement(
      emotionData.energy > 50 ? descriptors.energy.high : descriptors.energy.low
    );
    const moodDesc = getRandomElement(
      emotionData.mood > 50 ? descriptors.mood.high : descriptors.mood.low
    );
    
    // Use a counter instead of timestamp for uniqueness
    const counter = Math.floor(Math.random() * 10000);
    
    return `Create a ${energyDesc} ${style} artwork with ${moodDesc} tones. ` +
           `Make it ${emotionData.intensity > 50 ? 'bold and intense' : 'subtle and delicate'} ` +
           `with ${emotionData.complexity > 50 ? 'complex' : 'simple'} composition. ` +
           `ID: ${counter}`;
  };

  const handleGenerateArt = async () => {
    if (!mounted) return;
    
    setLoading(true);
    setError('');
    const prompt = generatePrompt(emotions);
    setGeneratedPrompt(prompt);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      }
    } catch (error) {
      setError('Error generating art. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Emotional Art Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {Object.entries(emotions).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium capitalize">
                {key}: {value}
              </label>
              <Slider
                value={[value]}
                min={0}
                max={100}
                step={1}
                onValueChange={(newValue) => 
                  setEmotions(prev => ({ ...prev, [key]: newValue[0] }))
                }
              />
            </div>
          ))}
        </div>

        <Button 
          onClick={handleGenerateArt}
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Generating...' : 'Generate Art'}
        </Button>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        {generatedPrompt && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium mb-2">Generated Prompt:</h3>
            <p className="text-sm">{generatedPrompt}</p>
          </div>
        )}

        {generatedImage && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Generated Image:</h3>
            <Image 
              src={generatedImage} 
              alt="Generated artwork" 
              width={500}
              height={300}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}