export type Language = 'bn' | 'en';

export type TimeOfDay = 'dawn' | 'sunrise' | 'golden_morning' | 'misty_noon' | 'sunset';

export interface AtmosphereSettings {
  timeOfDay: TimeOfDay;
  mistDensity: number; // 0 to 100
  sunGlow: number; // 0 to 100
  birdCount: number; // 0 to 30
  smokeEnabled: boolean;
  breezeSpeed: number; // 0 to 100
  dewGlow: boolean;
  skyPinkness: number; // 0 to 100 (controls pink vs orange balance)
}

export type ToolType = 
  | 'select' 
  | 'house' 
  | 'tree' 
  | 'palm' 
  | 'boat' 
  | 'bird' 
  | 'paddy' 
  | 'mist_brush' 
  | 'brush' 
  | 'eraser';

export interface SceneElement {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  scale: number;
  color?: string;
  rotation?: number;
}

export interface DrawStroke {
  id: string;
  tool: 'brush' | 'mist_brush' | 'eraser';
  points: { x: number; y: number }[];
  color: string;
  width: number;
  opacity: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  src: string;
  date: string;
  tags: string[];
}
