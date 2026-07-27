import React, { useState } from 'react';
import { GalleryItem, Language } from '../types';
import { Maximize2, Download, Sparkles, Tag, Calendar, Heart, X, Image as ImageIcon } from 'lucide-react';

interface Props {
  language: Language;
}

export const ArtworkGallery: React.FC<Props> = ({ language }) => {
  const [items] = useState<GalleryItem[]>([
    {
      id: 'art_1',
      title: 'শান্ত গ্রামীণ ভোর ও লাল ছাদের কুটির',
      titleEn: 'Peaceful Rural Morning & Red Roof Cottages',
      description: 'কুয়াশায় ঢাকা শ্যামল ধানখেতের মাঝে দাঁড়িয়ে আছে লাল ছাদওয়ালা গ্রামীন বাড়ি। আকাশে ছড়িয়ে পড়েছে সূর্যোদয়ের কমলা ও গোলাপী দ্যুতি।',
      descriptionEn: 'Red-roofed village homes nestled among misty paddy fields under a breathtaking orange and pink dawn sky.',
      src: '/src/assets/images/rural_morning_art_1784784135419.jpg',
      date: '২০২৬-০৭-২২',
      tags: ['সূর্যোদয়', 'লাল ছাদ', 'সবুজ মাঠ', 'কুয়াশা', 'ডিঙি নৌকা']
    },
    {
      id: 'art_2',
      title: 'শিশির ভেজা লাল ছাদের ঘর',
      titleEn: 'Dew-Kissed Cottage Detail',
      description: 'ভোরের সতেজ আলোয় আলোকিত লাল টিনের ছাদ এবং বাড়ির চারপাশে ফুটে থাকা ভোরের ফুল ও মেঠো পথ।',
      descriptionEn: 'Close-up artwork of a cozy village cottage framed by blooming flowers and morning mist rays.',
      src: '/src/assets/images/village_cottage_art_1784784147635.jpg',
      date: '২০২৬-০৭-২২',
      tags: ['জলরং', 'লাল টিনের ছাদ', 'শিশির কণা', 'ভোরের ফুল']
    }
  ]);

  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full mt-10">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-amber-900/30">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-serif font-bold text-amber-100">
              {language === 'bn' ? 'ডিজিটাল চিত্রপ্রদর্শনী' : 'Digital Masterpiece Gallery'}
            </h2>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            {language === 'bn' 
              ? 'কুয়াশায় ঢাকা গ্রামবাংলা ও সূর্যোদয়ের উচ্চমানের চিত্রকর্মসমূহ' 
              : 'High-definition digital paintings of Bangladesh rural morning landscapes'
            }
          </p>
        </div>
      </div>

      {/* Grid of Artworks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item)}
            className="group relative bg-stone-900 rounded-2xl overflow-hidden border border-amber-900/40 shadow-xl cursor-pointer hover:border-amber-500/60 transition-all transform hover:-translate-y-1"
          >
            {/* Image display */}
            <div className="relative aspect-video overflow-hidden bg-stone-950">
              <img
                src={item.src}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity" />

              {/* Top Action Badge */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={(e) => toggleLike(item.id, e)}
                  className={`p-2 rounded-full backdrop-blur-md border transition-colors ${
                    liked[item.id]
                      ? 'bg-rose-600/90 text-white border-rose-500'
                      : 'bg-stone-900/60 text-stone-300 border-stone-700/60 hover:text-white'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${liked[item.id] ? 'fill-current' : ''}`} />
                </button>
                <div className="p-2 rounded-full bg-stone-900/60 backdrop-blur-md border border-stone-700/60 text-stone-300">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-lg font-serif font-bold text-white drop-shadow-md">
                  {language === 'bn' ? item.title : item.titleEn}
                </h3>
                <p className="text-xs text-amber-200/90 line-clamp-2 mt-1 drop-shadow-sm font-light">
                  {language === 'bn' ? item.description : item.descriptionEn}
                </p>
              </div>
            </div>

            {/* Bottom Tag Bar */}
            <div className="p-3 bg-stone-900/95 flex flex-wrap items-center justify-between gap-2 border-t border-stone-800">
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] font-medium text-amber-300/80 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-800/30"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-stone-500 flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3" />
                {item.date}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full bg-stone-900 border border-amber-900/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-900/80 border border-stone-700 text-stone-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image preview */}
            <div className="md:w-2/3 bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[75vh]"
              />
            </div>

            {/* Details panel */}
            <div className="md:w-1/3 p-6 flex flex-col justify-between border-t md:border-t-0 md:border-l border-stone-800 bg-stone-900/90">
              <div>
                <span className="text-xs font-mono font-semibold text-amber-500 bg-amber-950/80 px-2.5 py-1 rounded-md border border-amber-800/50">
                  {language === 'bn' ? 'চিত্রশিল্প প্রদর্শনী' : 'Masterpiece Detail'}
                </span>

                <h3 className="text-2xl font-serif font-bold text-amber-100 mt-3">
                  {language === 'bn' ? selectedImage.title : selectedImage.titleEn}
                </h3>

                <p className="text-sm text-stone-300 mt-4 leading-relaxed font-serif">
                  {language === 'bn' ? selectedImage.description : selectedImage.descriptionEn}
                </p>

                <div className="mt-6 space-y-2 text-xs text-stone-400">
                  <p className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>
                      {language === 'bn'
                        ? 'বিষয়বস্তু: কুয়াশায় ঢাকা সবুজ প্রান্তর, লাল টিনের ছাদ ও কমলা সূর্যোদয়'
                        : 'Themes: Misty Green Paddy, Red Terracotta Roofs, Orange Sunrise'
                      }
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-stone-800 flex items-center justify-between">
                <a
                  href={selectedImage.src}
                  download={`shanto-sakal-art-${selectedImage.id}.jpg`}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-medium text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {language === 'bn' ? 'ছবি ডাউনলোড করুন' : 'Download Image'}
                </a>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
