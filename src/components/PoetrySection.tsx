import React, { useState } from 'react';
import { Language } from '../types';
import { BookOpen, Feather, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';

interface Props {
  language: Language;
}

export const PoetrySection: React.FC<Props> = ({ language }) => {
  const [poem, setPoem] = useState<string>(
    language === 'bn'
      ? `মেঠো পথের বাঁকে বাঁকে কুয়াশার চাদর,\nদূর গাঁয়ের লাল ছাদগুলোতে ভোরের সোনালী স্পর্শ।\nকমলা আর গোলাপী কিরণে হেসে ওঠে দিগন্ত,\nসবুজ ধানখেতের বুকে শিশিরবিন্দুর রূপালী মিষ্টি আলো।`
      : `Silver mist blankets the winding village path,\nGolden rays touch the vibrant red roofs from afar.\nThe horizon blooms in strokes of orange and blush pink,\nAs dewdrops shimmer like diamonds across emerald paddy fields.`
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedMood, setSelectedMood] = useState<string>('peaceful');

  const moods = [
    { id: 'peaceful', labelBn: 'শান্ত ও সুনিবিড়', labelEn: 'Peaceful & Serene' },
    { id: 'misty', labelBn: 'স্নিগ্ধ কুয়াশা', labelEn: 'Soft Morning Mist' },
    { id: 'birds', labelBn: 'ভোরের পাখির কলতান', labelEn: 'Morning Birdsong' },
    { id: 'sunrise', labelBn: 'রাঙা সূর্যোদয়', labelEn: 'Radiant Sunrise' },
  ];

  const fetchCustomPoem = async (mood: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/poem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, language }),
      });
      const data = await res.json();
      if (data.poem) {
        setPoem(data.poem);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(poem);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mt-10 bg-gradient-to-br from-stone-900/90 to-amber-950/40 backdrop-blur-md p-6 rounded-2xl border border-amber-900/40 shadow-xl">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-serif font-bold text-amber-100">
            {language === 'bn' ? 'ভোরের সাহিত্য ও কাব্যিক অনুভূতি' : 'Poetical Reflections & Morning Verses'}
          </h2>
        </div>

        {/* Mood Selection Pills */}
        <div className="flex flex-wrap gap-2">
          {moods.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMood(m.id);
                fetchCustomPoem(m.id);
              }}
              disabled={loading}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                selectedMood === m.id
                  ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
              }`}
            >
              {language === 'bn' ? m.labelBn : m.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Poetry Display Box */}
      <div className="relative bg-stone-950/70 p-6 sm:p-8 rounded-xl border border-amber-900/30 text-center font-serif">
        <Feather className="w-6 h-6 text-amber-500/50 mx-auto mb-3" />

        {loading ? (
          <div className="py-8 flex flex-col items-center gap-3 text-amber-300 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin text-amber-500" />
            <span>{language === 'bn' ? 'কবিতা রচিত হচ্ছে...' : 'Composing morning verse...'}</span>
          </div>
        ) : (
          <div className="space-y-2">
            {poem.split('\n').map((line, idx) => (
              <p key={idx} className="text-lg sm:text-xl text-amber-100/90 leading-relaxed font-serif tracking-wide drop-shadow-sm">
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 rounded-lg bg-stone-900/80 hover:bg-stone-800 text-stone-300 border border-stone-700 text-xs flex items-center gap-1.5 transition-colors"
          title="Copy Verse"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          <span className="hidden sm:inline">{copied ? (language === 'bn' ? 'কপি হয়েছে' : 'Copied') : (language === 'bn' ? 'কপি করুন' : 'Copy')}</span>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-stone-400 font-sans">
        <span className="flex items-center gap-1.5 text-amber-400/90">
          <Sparkles className="w-3.5 h-3.5" />
          {language === 'bn' ? 'গ্রামবাংলার স্নিগ্ধ রূপকথা' : 'The Essence of Rural Morning'}
        </span>
        <button
          onClick={() => fetchCustomPoem(selectedMood)}
          disabled={loading}
          className="flex items-center gap-1 text-amber-300 hover:text-amber-200 underline font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {language === 'bn' ? 'নতুন কবিতা তৈরি করুন' : 'Generate New Verse'}
        </button>
      </div>

    </div>
  );
};
