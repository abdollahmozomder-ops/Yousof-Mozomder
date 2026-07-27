import React, { useState } from 'react';
import { AtmosphereSettings, ToolType, Language } from './types';
import { Header } from './components/Header';
import { InteractiveSceneCanvas } from './components/InteractiveSceneCanvas';
import { AtmosphereControls } from './components/AtmosphereControls';
import { ArtworkGallery } from './components/ArtworkGallery';
import { PoetrySection } from './components/PoetrySection';
import { Sparkles, Image, Compass, BookOpen, Heart } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [activeTool, setActiveTool] = useState<ToolType>('select');

  const [atmosphere, setAtmosphere] = useState<AtmosphereSettings>({
    timeOfDay: 'sunrise',
    mistDensity: 55,
    sunGlow: 80,
    birdCount: 12,
    smokeEnabled: true,
    breezeSpeed: 40,
    dewGlow: true,
    skyPinkness: 70,
  });

  const [activeTab, setActiveTab] = useState<'canvas' | 'gallery' | 'poetry'>('canvas');

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 font-sans selection:bg-amber-600 selection:text-white">
      {/* Header Bar */}
      <Header
        language={language}
        setLanguage={setLanguage}
        atmosphere={atmosphere}
        setAtmosphere={setAtmosphere}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        
        {/* Navigation Tabs */}
        <div className="flex items-center justify-center sm:justify-start gap-2 border-b border-stone-800/80 pb-3">
          <button
            onClick={() => setActiveTab('canvas')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'canvas'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                : 'bg-stone-900/80 hover:bg-stone-800 text-stone-400 border border-stone-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>{language === 'bn' ? 'ইন্টারেক্টিভ ক্যানভাস স্টুডিও' : 'Interactive Canvas Studio'}</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                : 'bg-stone-900/80 hover:bg-stone-800 text-stone-400 border border-stone-800'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>{language === 'bn' ? 'চিত্রশিল্প প্রদর্শনী' : 'Digital Masterpieces'}</span>
          </button>

          <button
            onClick={() => setActiveTab('poetry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'poetry'
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                : 'bg-stone-900/80 hover:bg-stone-800 text-stone-400 border border-stone-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>{language === 'bn' ? 'ভোরের কবিতা' : 'Morning Verses'}</span>
          </button>
        </div>

        {/* Tab 1: Interactive Canvas Studio */}
        {activeTab === 'canvas' && (
          <div className="space-y-6">
            <InteractiveSceneCanvas
              atmosphere={atmosphere}
              activeTool={activeTool}
              language={language}
            />

            <AtmosphereControls
              atmosphere={atmosphere}
              setAtmosphere={setAtmosphere}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              language={language}
            />
          </div>
        )}

        {/* Tab 2: High Res Digital Art Gallery */}
        {activeTab === 'gallery' && (
          <ArtworkGallery language={language} />
        )}

        {/* Tab 3: Poetic Reflections */}
        {activeTab === 'poetry' && (
          <PoetrySection language={language} />
        )}

        {/* Always display lower Poetry preview or Art snippet when on canvas tab */}
        {activeTab === 'canvas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <PoetrySection language={language} />
            <ArtworkGallery language={language} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full mt-16 py-8 border-t border-amber-900/20 bg-stone-950 text-center text-xs text-stone-500 font-serif">
        <p className="flex items-center justify-center gap-1.5 text-stone-400">
          <span>{language === 'bn' ? 'শান্ত সকালের গ্রামীণ শিল্পকলা' : 'Peaceful Village Morning Artwork'}</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          <span>{language === 'bn' ? 'কুয়াশা ও সূর্যোদয়ের ছোঁয়া' : 'Misty Sunrise Reflections'}</span>
        </p>
      </footer>
    </div>
  );
}
