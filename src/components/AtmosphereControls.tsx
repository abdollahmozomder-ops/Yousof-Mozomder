import React from 'react';
import { AtmosphereSettings, ToolType, TimeOfDay, Language } from '../types';
import { 
  Home, 
  Trees, 
  Bird, 
  Ship, 
  CloudFog, 
  Brush, 
  MousePointer, 
  Sun, 
  Wind, 
  Flame, 
  Sparkles,
  Sliders,
  Palette
} from 'lucide-react';

interface Props {
  atmosphere: AtmosphereSettings;
  setAtmosphere: React.Dispatch<React.SetStateAction<AtmosphereSettings>>;
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  language: Language;
}

export const AtmosphereControls: React.FC<Props> = ({
  atmosphere,
  setAtmosphere,
  activeTool,
  setActiveTool,
  language,
}) => {

  const tools: { id: ToolType; labelBn: string; labelEn: string; icon: React.ReactNode }[] = [
    { id: 'select', labelBn: 'বাছাই ও সরানো', labelEn: 'Select / Move', icon: <MousePointer className="w-4 h-4" /> },
    { id: 'house', labelBn: 'লাল ছাদের বাড়ি', labelEn: 'Red Roof House', icon: <Home className="w-4 h-4 text-red-500" /> },
    { id: 'palm', labelBn: 'নারকেল গাছ', labelEn: 'Palm Tree', icon: <Trees className="w-4 h-4 text-emerald-500" /> },
    { id: 'boat', labelBn: 'ডিঙি নৌকা', labelEn: 'Wooden Boat', icon: <Ship className="w-4 h-4 text-amber-600" /> },
    { id: 'bird', labelBn: 'উড়ন্ত পাখি', labelEn: 'Flying Bird', icon: <Bird className="w-4 h-4 text-blue-400" /> },
    { id: 'brush', labelBn: 'জলরং আঁকা', labelEn: 'Watercolor Brush', icon: <Brush className="w-4 h-4 text-purple-400" /> },
    { id: 'mist_brush', labelBn: 'কুয়াশার পরশ', labelEn: 'Mist Layer Brush', icon: <CloudFog className="w-4 h-4 text-sky-200" /> },
  ];

  const timePresets: { id: TimeOfDay; labelBn: string; labelEn: string; color: string }[] = [
    { id: 'dawn', labelBn: 'ভোররাত', labelEn: 'Early Dawn', color: 'bg-purple-900 border-purple-600' },
    { id: 'sunrise', labelBn: 'কমলা-গোলাপী সূর্যোদয়', labelEn: 'Orange-Pink Sunrise', color: 'bg-gradient-to-r from-orange-500 to-pink-500 border-orange-400' },
    { id: 'golden_morning', labelBn: 'সোনালী সকাল', labelEn: 'Golden Morning', color: 'bg-amber-500 border-yellow-300 text-stone-900' },
    { id: 'misty_noon', labelBn: 'কুয়াশাচ্ছন্ন দুপুর', labelEn: 'Misty Noon', color: 'bg-slate-600 border-slate-400' },
    { id: 'sunset', labelBn: 'গোধূলি বেলা', labelEn: 'Sunset Glow', color: 'bg-rose-800 border-amber-600' },
  ];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
      
      {/* LEFT: Drawing & Element Placement Tools */}
      <div className="lg:col-span-5 bg-stone-900/90 backdrop-blur-md p-5 rounded-2xl border border-amber-900/40 shadow-xl">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-stone-800">
          <Palette className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-stone-100 text-sm tracking-wide">
            {language === 'bn' ? 'দৃশ্য সাজানোর টুলস' : 'Scene Studio Tools'}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {tools.map((t) => {
            const isActive = activeTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium border transition-all text-left ${
                  isActive
                    ? 'bg-amber-600/30 border-amber-500 text-amber-200 shadow-md ring-1 ring-amber-500/50'
                    : 'bg-stone-800/80 hover:bg-stone-800 border-stone-700/70 text-stone-300 hover:border-stone-600'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-amber-500/30' : 'bg-stone-900/60'}`}>
                  {t.icon}
                </div>
                <span className="leading-tight">{language === 'bn' ? t.labelBn : t.labelEn}</span>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-stone-400 mt-4 italic bg-stone-950/40 p-2.5 rounded-lg border border-stone-800/60">
          💡 {language === 'bn' 
            ? 'টুল নির্বাচন করে ক্যানভাসে ক্লিক করুন। লাল ছাদের ঘর, গাছপালা বা পাখি যোগ করতে ক্লিক করুন।'
            : 'Select a tool and click on the canvas to place houses, trees, or paint watercolor strokes.'
          }
        </p>
      </div>

      {/* RIGHT: Atmosphere & Environment Controls */}
      <div className="lg:col-span-7 bg-stone-900/90 backdrop-blur-md p-5 rounded-2xl border border-amber-900/40 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-stone-800">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-stone-100 text-sm tracking-wide">
                {language === 'bn' ? 'প্রকৃতি ও আবহাওয়া নিয়ন্ত্রণ' : 'Atmosphere & Light Controls'}
              </h3>
            </div>
            <span className="text-xs text-amber-400/90 font-mono bg-amber-950/50 px-2.5 py-1 rounded-md border border-amber-800/40">
              {language === 'bn' ? 'সকালের পরিবেশ' : 'Morning Ambience'}
            </span>
          </div>

          {/* Time Preset Buttons */}
          <div className="mb-4">
            <label className="text-xs font-medium text-stone-300 block mb-2">
              {language === 'bn' ? 'দিনের আলো:' : 'Time of Day:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {timePresets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setAtmosphere((prev) => ({ ...prev, timeOfDay: p.id }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${p.color} ${
                    atmosphere.timeOfDay === p.id ? 'ring-2 ring-white shadow-lg scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {language === 'bn' ? p.labelBn : p.labelEn}
                </button>
              ))}
            </div>
          </div>

          {/* Sliders Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Mist Density */}
            <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/80">
              <div className="flex justify-between items-center text-xs mb-1.5 text-stone-300">
                <span className="flex items-center gap-1.5">
                  <CloudFog className="w-4 h-4 text-sky-300" />
                  {language === 'bn' ? 'কুয়াশার ঘনত্ব:' : 'Mist Density:'}
                </span>
                <span className="font-mono text-amber-300">{atmosphere.mistDensity}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={atmosphere.mistDensity}
                onChange={(e) => setAtmosphere((prev) => ({ ...prev, mistDensity: Number(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
              />
            </div>

            {/* Orange-Pink Sky Balance */}
            <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/80">
              <div className="flex justify-between items-center text-xs mb-1.5 text-stone-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  {language === 'bn' ? 'কমলা-গোলাপী আভা:' : 'Orange-Pink Glow:'}
                </span>
                <span className="font-mono text-pink-300">{atmosphere.skyPinkness}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={atmosphere.skyPinkness}
                onChange={(e) => setAtmosphere((prev) => ({ ...prev, skyPinkness: Number(e.target.value) }))}
                className="w-full accent-pink-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
              />
            </div>

            {/* Sun Rays & Brightness */}
            <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/80">
              <div className="flex justify-between items-center text-xs mb-1.5 text-stone-300">
                <span className="flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-400" />
                  {language === 'bn' ? 'সূর্যোদয়ের আলো:' : 'Sunrise Rays:'}
                </span>
                <span className="font-mono text-amber-300">{atmosphere.sunGlow}%</span>
              </div>
              <input
                type="range"
                min={10}
                max={100}
                value={atmosphere.sunGlow}
                onChange={(e) => setAtmosphere((prev) => ({ ...prev, sunGlow: Number(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
              />
            </div>

            {/* Bird Count */}
            <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-800/80">
              <div className="flex justify-between items-center text-xs mb-1.5 text-stone-300">
                <span className="flex items-center gap-1.5">
                  <Bird className="w-4 h-4 text-blue-400" />
                  {language === 'bn' ? 'পাখির সংখ্যা:' : 'Flying Birds:'}
                </span>
                <span className="font-mono text-blue-300">{atmosphere.birdCount}</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={atmosphere.birdCount}
                onChange={(e) => setAtmosphere((prev) => ({ ...prev, birdCount: Number(e.target.value) }))}
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
              />
            </div>

          </div>
        </div>

        {/* Toggles bar */}
        <div className="flex items-center justify-between gap-4 mt-4 pt-3 border-t border-stone-800/80">
          <label className="flex items-center gap-2 text-xs font-medium text-stone-300 cursor-pointer select-none">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>{language === 'bn' ? 'রান্নার ধোঁয়া (বাড়ির চিমনি)' : 'Chimney Smoke'}</span>
            <input
              type="checkbox"
              checked={atmosphere.smokeEnabled}
              onChange={(e) => setAtmosphere((prev) => ({ ...prev, smokeEnabled: e.target.checked }))}
              className="ml-1 w-4 h-4 accent-amber-500 cursor-pointer"
            />
          </label>

          <label className="flex items-center gap-2 text-xs font-medium text-stone-300 cursor-pointer select-none">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{language === 'bn' ? 'ধানের পাতায় শিশিরবিন্দু' : 'Dewdrops on Grass'}</span>
            <input
              type="checkbox"
              checked={atmosphere.dewGlow}
              onChange={(e) => setAtmosphere((prev) => ({ ...prev, dewGlow: e.target.checked }))}
              className="ml-1 w-4 h-4 accent-emerald-500 cursor-pointer"
            />
          </label>
        </div>

      </div>

    </div>
  );
};
