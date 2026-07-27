import React, { useState } from 'react';
import { Language, AtmosphereSettings } from '../types';
import { ambientSound } from '../utils/ambientAudio';
import { Volume2, VolumeX, Globe, Sun, CloudFog, Home, Sparkles } from 'lucide-react';

interface Props {
  language: Language;
  setLanguage: (lang: Language) => void;
  atmosphere: AtmosphereSettings;
  setAtmosphere: React.Dispatch<React.SetStateAction<AtmosphereSettings>>;
}

export const Header: React.FC<Props> = ({
  language,
  setLanguage,
  atmosphere,
  setAtmosphere,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleSound = async () => {
    const playing = await ambientSound.toggle();
    setIsPlayingAudio(playing);
  };

  const applySunrisePreset = () => {
    setAtmosphere((prev) => ({
      ...prev,
      timeOfDay: 'sunrise',
      mistDensity: 45,
      sunGlow: 85,
      skyPinkness: 75,
      birdCount: 15,
      smokeEnabled: true,
      dewGlow: true,
    }));
  };

  const applyMistyPreset = () => {
    setAtmosphere((prev) => ({
      ...prev,
      timeOfDay: 'dawn',
      mistDensity: 85,
      sunGlow: 40,
      skyPinkness: 50,
      birdCount: 8,
      smokeEnabled: true,
      dewGlow: true,
    }));
  };

  return (
    <header className="w-full bg-stone-900/95 backdrop-blur-lg border-b border-amber-900/40 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-pink-500 to-amber-400 p-0.5 shadow-md">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
              <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-amber-100 leading-tight">
              {language === 'bn' ? 'শান্ত সকালের গ্রামীণ দৃশ্য' : 'Peaceful Rural Morning Scene'}
            </h1>
            <p className="text-xs text-amber-300/80 font-serif font-light">
              {language === 'bn' 
                ? 'কুয়াশায় ঢাকা সবুজ মাঠ • লাল ছাদওয়ালা বাড়ি • কমলা-গোলাপী সূর্যোদয়' 
                : 'Misty Green Fields • Red-Roofed Houses • Orange-Pink Sunrise'
              }
            </p>
          </div>
        </div>

        {/* Quick Presets & Audio / Language Toggle */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          
          {/* Presets */}
          <button
            onClick={applySunrisePreset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-800/60 text-amber-200 text-xs font-medium transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>{language === 'bn' ? 'সূর্যোদয়ের মোড' : 'Sunrise Mode'}</span>
          </button>

          <button
            onClick={applyMistyPreset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 text-xs font-medium transition-all"
          >
            <CloudFog className="w-3.5 h-3.5 text-sky-300" />
            <span>{language === 'bn' ? 'ঘন কুয়াশা' : 'Heavy Mist'}</span>
          </button>

          {/* Soundscape Audio button */}
          <button
            onClick={toggleSound}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              isPlayingAudio
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-900/30'
                : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300'
            }`}
            title={language === 'bn' ? 'ভোরের পাখির ডাক ও বাতাসের সুর' : 'Toggle Ambient Morning Sounds'}
          >
            {isPlayingAudio ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>{language === 'bn' ? 'সুর বাজছে' : 'Sounds On'}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-stone-400" />
                <span>{language === 'bn' ? 'প্রকৃতির সুর' : 'Ambient Audio'}</span>
              </>
            )}
          </button>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-300 text-xs font-semibold transition-all"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>

        </div>

      </div>
    </header>
  );
};
