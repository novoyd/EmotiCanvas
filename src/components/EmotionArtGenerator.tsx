import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Activity, Star, Brain, Eye } from 'lucide-react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900']
});

type Palette = string[];
type Elements = string[];

interface Mood {
  name: string;
  color: string;
  elements: Elements;
  palette: Palette;
}

interface EmotionIntensityLevels {
  [key: number]: string[];
}

interface EmotionStylesEnhanced {
  energy: EmotionIntensityLevels;
  subjectivity: EmotionIntensityLevels;
  complexity: EmotionIntensityLevels;
}

interface EmotionState {
  energy: number;
  mood: number;
  subjectivity: number;
  complexity: number;
}

const Moods: Mood[] = [
    {
      name: 'Peaceful',
      color: 'from-blue-400 to-green-400',
      elements: ['tranquil waters', 'floating clouds', 'gentle waves', 'serene landscapes'],
      palette: ['soft blues', 'gentle greens', 'misty whites', 'calm grays']
    },
    {
      name: 'Energetic',
      color: 'from-yellow-400 to-red-400',
      elements: ['bursting stars', 'dynamic swirls', 'electric currents', 'radiant beams'],
      palette: ['vibrant yellows', 'energetic reds', 'bright oranges', 'electric whites']
    },
    {
      name: 'Melancholic',
      color: 'from-purple-400 to-blue-400',
      elements: ['falling leaves', 'fading lights', 'lonely shadows', 'distant horizons'],
      palette: ['deep purples', 'muted blues', 'somber grays', 'faded whites']
    },
    {
      name: 'Joyful',
      color: 'from-yellow-300 to-orange-400',
      elements: ['dancing lights', 'rising bubbles', 'playful spirals', 'celebratory bursts'],
      palette: ['happy yellows', 'warm oranges', 'cheerful pinks', 'bright whites']
    },
    {
      name: 'Bored',
      color: 'from-indigo-400 to-purple-500',
      elements: ['static patterns', 'repeating shapes', 'monotonous lines', 'empty spaces'],
      palette: ['dull grays', 'muted purples', 'faded blues', 'lifeless whites']
    },
    {
      name: 'Angry',
      color: 'from-red-500 to-orange-500',
      elements: ['jagged peaks', 'sharp angles', 'explosive forms', 'violent storms'],
      palette: ['fierce reds', 'burning oranges', 'intense blacks', 'harsh whites']
    },
    {
      name: 'Reflective',
      color: 'from-pink-400 to-purple-400',
      elements: ['rippling pools', 'mirrored surfaces', 'crystal fragments', 'prismatic light'],
      palette: ['deep purples', 'reflective silvers', 'thoughtful blues', 'ethereal whites']
    },
    {
      name: 'Inspired',
      color: 'from-emerald-400 to-blue-500',
      elements: ['soaring forms', 'expanding circles', 'ascending paths', 'illuminated portals'],
      palette: ['brilliant blues', 'innovative greens', 'inspiring golds', 'pure whites']
    }
  ];

const emotionStyles: EmotionStylesEnhanced = {
  energy: {
    0: ['completely still', 'motionless', 'frozen in time', 'static'],
    10: ['barely stirring', 'faintly moving', 'whispered motion', 'delicately floating'],
    20: ['softly drifting', 'gently swaying', 'quietly flowing', 'subtly shifting'],
    30: ['calmly moving', 'peacefully flowing', 'smoothly transitioning', 'steadily drifting'],
    40: ['moderately flowing', 'rhythmically moving', 'balanced motion', 'steady progression'],
    50: ['actively flowing', 'purposefully moving', 'continuous motion', 'definite movement'],
    60: ['energetically flowing', 'vibrantly moving', 'dynamic progression', 'lively motion'],
    70: ['intensely moving', 'powerfully flowing', 'forceful progression', 'strong dynamics'],
    80: ['rapidly flowing', 'explosively moving', 'intensely dynamic', 'forcefully energetic'],
    90: ['turbulently flowing', 'violently moving', 'extremely dynamic', 'maximum energy'],
    100: ['chaotically surging', 'overwhelming force', 'ultimate dynamism', 'pure energy']
  },
  subjectivity: {
    0: ['purely objective', 'completely neutral', 'utterly detached', 'entirely impersonal'],
    10: ['mostly objective', 'minimally personal', 'largely neutral', 'generally detached'],
    20: ['slightly personal', 'somewhat subjective', 'mildly emotional', 'faintly intimate'],
    30: ['partially personal', 'moderately subjective', 'noticeably emotional', 'gently intimate'],
    40: ['distinctly personal', 'clearly subjective', 'evidently emotional', 'warmly intimate'],
    50: ['balanced perspective', 'equally personal/objective', 'emotionally centered', 'measured intimacy'],
    60: ['predominantly personal', 'mainly subjective', 'emotionally rich', 'intimately expressed'],
    70: ['highly personal', 'very subjective', 'deeply emotional', 'strongly intimate'],
    80: ['intensely personal', 'profoundly subjective', 'powerfully emotional', 'deeply intimate'],
    90: ['extremely personal', 'heavily subjective', 'intensely emotional', 'deeply passionate'],
    100: ['purely subjective', 'completely personal', 'utterly emotional', 'absolutely intimate']
  },
  complexity: {
    0: ['utterly minimal', 'pure simplicity', 'absolute clarity', 'completely basic'],
    10: ['very simple', 'barely complex', 'mostly minimal', 'predominantly basic'],
    20: ['relatively simple', 'lightly detailed', 'mildly complex', 'somewhat basic'],
    30: ['moderately simple', 'partially detailed', 'notably complex', 'clearly structured'],
    40: ['balanced simplicity', 'measured detail', 'controlled complexity', 'defined structure'],
    50: ['moderately complex', 'reasonably detailed', 'balanced intricacy', 'structured detail'],
    60: ['notably complex', 'well detailed', 'significantly intricate', 'richly structured'],
    70: ['highly complex', 'very detailed', 'deeply intricate', 'elaborately structured'],
    80: ['intensely complex', 'richly detailed', 'profoundly intricate', 'densely layered'],
    90: ['extremely complex', 'heavily detailed', 'incredibly intricate', 'maximally layered'],
    100: ['ultimately complex', 'infinitely detailed', 'absolutely intricate', 'purely maximal']
  }
};

function getRandomElement<T>(arr: T[]): T {
  if (!arr.length) throw new Error('Cannot get random element from empty array');
  return arr[Math.floor(Math.random() * arr.length)];
}

function getIntensityLevel(value: number): number {
  return Math.floor(value / 10) * 10;
}

function getEmotionDescriptor(value: number, emotionType: keyof EmotionStylesEnhanced): string {
  const intensityLevel = getIntensityLevel(value);
  const descriptors = emotionStyles[emotionType][intensityLevel];
  return getRandomElement(descriptors);
}

export default function EmotionArtGenerator() {
  const [emotions, setEmotions] = useState<EmotionState>({
    energy: 50,
    mood:    50,
    subjectivity: 50,
    complexity: 50,
  });
  const [selectedMood, setSelectedMood] = useState<Mood>(Moods[0]);
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const clientSideId = useMemo(() => Math.random().toString(36).slice(2, 8), []);

  const generateEnhancedPrompt = (): string => {
    const mood = selectedMood;
    const element = getRandomElement(mood.elements);
    const palette = getRandomElement(mood.palette);
    
    const energyDesc = getEmotionDescriptor(emotions.energy, 'energy');
    const subjectivityDesc = getEmotionDescriptor(emotions.subjectivity, 'subjectivity');
    const complexityDesc = getEmotionDescriptor(emotions.complexity, 'complexity');

    const artStyles = [
      "abstract expressionism", "contemporary digital art", "fluid art",
      "geometric abstraction", "emotional minimalism", "atmospheric art",
      "conceptual abstraction", "experimental digital painting"
    ];
    const artStyle = getRandomElement(artStyles);

    return `Create a ${complexityDesc} ${artStyle} composition expressing ${mood.name.toLowerCase()} emotions. 
    Feature ${element} with ${palette}, ${energyDesc} through the composition. 
    The piece should feel ${subjectivityDesc}, using light and shadow to create depth.
    Incorporate textures and atmospheric elements that reflect the ${getEmotionDescriptor(emotions.complexity, 'complexity')} nature of the piece.
    The overall mood should be distinctly ${mood.name.toLowerCase()}, with ${energyDesc} qualities throughout.
    Maintain an abstract, non-representational approach while conveying ${subjectivityDesc} emotional resonance.
    [Version: ${clientSideId}]`;
  };

  const handleGenerateArt = async (): Promise<void> => {
    setLoading(true);
    setError('');
    const prompt = generateEnhancedPrompt();
    setGeneratedPrompt(prompt);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) throw new Error('Failed to generate image');

      const data: { imageUrl: string } = await response.json();
      if (data.imageUrl) setGeneratedImage(data.imageUrl);
    } catch (error) {
      setError('Error generating art. Please try again.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full w-screen bg-gradient-to-br from-indigo-900 to-purple-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card className="bg-black/40 backdrop-blur-xl border-0">
          <CardHeader className="space-y-2">
            <CardTitle className={`
              ${orbitron.className}
              text-5xl text-center text-transparent bg-clip-text
              bg-gradient-to-r from-purple-300 via-white to-purple-300
              font-black tracking-wider
            `}>
              Digital Emotion Portraits
            </CardTitle>
            <div className="text-center text-purple-200 text-sm font-light">
              Transform your feelings into abstract art
            </div>
          </CardHeader>

          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Moods.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood)}
                  className={`p-4 rounded-xl transition-all border-2 bg-gradient-to-r ${mood.color} ${
                    selectedMood.name === mood.name
                      ? 'scale-105 border-white shadow-lg shadow-white/20'
                      : 'opacity-70 border-transparent hover:opacity-100'
                  }`}
                >
                  <h3 className={`${orbitron.className} text-lg font-bold text-white`}>{mood.name}</h3>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {Object.entries(emotions).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center gap-2">
                      {key === 'energy' && <Activity className="text-white" />}
                      {key === 'mood' && <Star className="text-white" />}
                      {key === 'subjectivity' && <Eye className="text-white" />}
                      {key === 'complexity' && <Brain className="text-white" />}
                      <label className="text-sm font-medium text-white capitalize">{key}</label>
                    </div>

                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${selectedMood.color} opacity-20`} />
                      <Slider
                        value={[value]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(newValue) => setEmotions((prev) => ({ ...prev, [key]: newValue[0] }))}
                        className="relative z-10"
                      />
                    </div>

                    <div className="text-xs text-white/70 text-right">{value}%</div>
                  </div>
                ))}
              </div>

              <div className="aspect-square w-full bg-black/30 rounded-xl border-2 border-white/10 flex items-center justify-center overflow-hidden">
                {generatedImage ? (
                  <img src={generatedImage} alt="Generated artwork" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-white/50 text-center">
                    <div>Your generated artwork will appear here</div>
                    <div className="text-sm">(1024 x 1024)</div>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleGenerateArt}
              disabled={loading}
              className={`w-full h-14 text-lg font-bold bg-gradient-to-r ${selectedMood.color} hover:opacity-90 transition-opacity ${orbitron.className}`}
            >
              {loading ? 'Generating...' : 'Generate Portrait'}
            </Button>

            {generatedPrompt && (
              <div className="mt-4 p-4 bg-black/30 rounded-lg text-white">
                <h3 className={`${orbitron.className} font-medium mb-2`}>Generated Prompt:</h3>
                <div className="text-sm opacity-90">{generatedPrompt}</div>
              </div>
            )}

            {error && (
              <div className="text-red-400 text-sm text-center">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}