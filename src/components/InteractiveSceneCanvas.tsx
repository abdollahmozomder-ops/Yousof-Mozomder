import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AtmosphereSettings, ToolType, SceneElement, DrawStroke, Language } from '../types';
import { Download, RotateCcw, Trash2, ZoomIn, ZoomOut, Sparkles, Move, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  atmosphere: AtmosphereSettings;
  activeTool: ToolType;
  language: Language;
  onSelectElement?: (element: SceneElement | null) => void;
}

export const InteractiveSceneCanvas: React.FC<Props> = ({
  atmosphere,
  activeTool,
  language,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Canvas elements state
  const [elements, setElements] = useState<SceneElement[]>([
    { id: 'h1', type: 'house', x: 280, y: 390, scale: 1 },
    { id: 'h2', type: 'house', x: 420, y: 410, scale: 0.85 },
    { id: 't1', type: 'palm', x: 230, y: 340, scale: 1.1 },
    { id: 't2', type: 'palm', x: 480, y: 360, scale: 0.95 },
    { id: 'b1', type: 'boat', x: 680, y: 490, scale: 1 },
    { id: 'bird1', type: 'bird', x: 300, y: 150, scale: 1 },
  ]);

  const [strokes, setStrokes] = useState<DrawStroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<{ x: number; y: number }[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<{ elements: SceneElement[]; strokes: DrawStroke[] }[]>([]);
  const [strokeColor, setStrokeColor] = useState<string>('#E65100'); // Sunrise Orange default
  const [strokeWidth, setStrokeWidth] = useState<number>(8);
  const [isHovered, setIsHovered] = useState(false);

  // Animation time state
  const timeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Save undo history state
  const pushHistory = useCallback(() => {
    setHistory((prev) => [...prev.slice(-15), { elements: [...elements], strokes: [...strokes] }]);
  }, [elements, strokes]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setElements(last.elements);
    setStrokes(last.strokes);
    setHistory((prev) => prev.slice(0, -1));
  };

  const handleClearCanvas = () => {
    if (window.confirm(language === 'bn' ? 'আপনি কি সব আঁকা মুছে ফেলতে চান?' : 'Clear custom elements and drawings?')) {
      pushHistory();
      setElements([]);
      setStrokes([]);
      setSelectedId(null);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `shanto-sakal-rural-morning-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#FF7E5F', '#FEB47B', '#4CAF50', '#81C784']
    });
  };

  // Main Render Loop
  const renderScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const t = timeRef.current * 0.02;

    ctx.clearRect(0, 0, width, height);

    // 1. SKY GRADIENT based on Time & Pinkness
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
    
    if (atmosphere.timeOfDay === 'dawn') {
      skyGrad.addColorStop(0, '#2C1B4D');
      skyGrad.addColorStop(0.5, '#6C3483');
      skyGrad.addColorStop(0.8, '#C0392B');
      skyGrad.addColorStop(1, '#E67E22');
    } else if (atmosphere.timeOfDay === 'sunrise') {
      // Orange-pink sunrise sky requested!
      const pinkness = atmosphere.skyPinkness / 100;
      const topPink = `rgb(${Math.round(255 - pinkness * 20)}, ${Math.round(110 + pinkness * 40)}, ${Math.round(160 + pinkness * 80)})`;
      const midOrange = `rgb(255, ${Math.round(140 - pinkness * 30)}, ${Math.round(100 - pinkness * 40)})`;
      const bottomGold = '#F9E79F';

      skyGrad.addColorStop(0, topPink);
      skyGrad.addColorStop(0.4, midOrange);
      skyGrad.addColorStop(0.75, '#F39C12');
      skyGrad.addColorStop(1, bottomGold);
    } else if (atmosphere.timeOfDay === 'golden_morning') {
      skyGrad.addColorStop(0, '#5DADE2');
      skyGrad.addColorStop(0.5, '#F9E79F');
      skyGrad.addColorStop(1, '#FEF9E7');
    } else if (atmosphere.timeOfDay === 'misty_noon') {
      skyGrad.addColorStop(0, '#85929E');
      skyGrad.addColorStop(0.6, '#AEB6BF');
      skyGrad.addColorStop(1, '#D5D8DC');
    } else {
      // Sunset
      skyGrad.addColorStop(0, '#1F618D');
      skyGrad.addColorStop(0.4, '#AF7AC5');
      skyGrad.addColorStop(0.7, '#EC7063');
      skyGrad.addColorStop(1, '#F5B041');
    }

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. SUN & SUNBEAMS (কমলা-গোলাপী সূর্যোদয়)
    const sunX = width * 0.52;
    const sunY = height * 0.28 - (atmosphere.sunGlow * 0.5);
    const sunRadius = 45;

    // Sun Rays
    const rayCount = 12;
    ctx.save();
    ctx.translate(sunX, sunY);
    ctx.rotate(t * 0.05);
    for (let i = 0; i < rayCount; i++) {
      const angle = (i * Math.PI * 2) / rayCount;
      const rayGrad = ctx.createLinearGradient(0, 0, Math.cos(angle) * 350, Math.sin(angle) * 350);
      rayGrad.addColorStop(0, `rgba(255, 230, 150, ${0.12 * (atmosphere.sunGlow / 100)})`);
      rayGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 350, angle - 0.1, angle + 0.1);
      ctx.fillStyle = rayGrad;
      ctx.fill();
    }
    ctx.restore();

    // Sun Outer Glow
    const sunGlowGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, sunRadius * 4);
    sunGlowGrad.addColorStop(0, 'rgba(255, 245, 200, 0.95)');
    sunGlowGrad.addColorStop(0.2, 'rgba(255, 160, 122, 0.6)');
    sunGlowGrad.addColorStop(0.6, 'rgba(255, 105, 180, 0.25)');
    sunGlowGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunGlowGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius * 4, 0, Math.PI * 2);
    ctx.fill();

    // Core Sun
    const sunCoreGrad = ctx.createRadialGradient(sunX - 10, sunY - 10, 5, sunX, sunY, sunRadius);
    sunCoreGrad.addColorStop(0, '#FFFDF0');
    sunCoreGrad.addColorStop(0.5, '#FFE082');
    sunCoreGrad.addColorStop(1, '#FF7E5F');
    ctx.fillStyle = sunCoreGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
    ctx.fill();

    // 3. DRIFTING SUNRISE CLOUDS
    ctx.fillStyle = 'rgba(255, 220, 230, 0.35)';
    for (let i = 0; i < 4; i++) {
      const cx = ((i * 300 + t * 15 * (i + 1)) % (width + 300)) - 150;
      const cy = 60 + i * 35;
      ctx.beginPath();
      ctx.arc(cx, cy, 45, 0, Math.PI * 2);
      ctx.arc(cx + 35, cy - 15, 35, 0, Math.PI * 2);
      ctx.arc(cx + 70, cy, 40, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. DISTANT HORIZON TREES (দূরবর্তী বনাঞ্চল)
    ctx.fillStyle = 'rgba(40, 80, 50, 0.45)';
    ctx.beginPath();
    ctx.moveTo(0, height * 0.42);
    for (let x = 0; x <= width; x += 15) {
      const h = Math.sin(x * 0.03 + 1) * 12 + Math.cos(x * 0.08) * 8;
      ctx.lineTo(x, height * 0.42 - h);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.fill();

    // Horizon Light Mist Layer
    const horizMist = ctx.createLinearGradient(0, height * 0.38, 0, height * 0.46);
    horizMist.addColorStop(0, 'rgba(255, 235, 210, 0.6)');
    horizMist.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = horizMist;
    ctx.fillRect(0, height * 0.38, width, height * 0.08);

    // 5. MEANDERING RIVER (ডিঙি নৌকা ও বাঁকা নদী)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(width * 0.45, height * 0.42);
    ctx.bezierCurveTo(width * 0.55, height * 0.48, width * 0.85, height * 0.52, width * 0.75, height * 0.62);
    ctx.bezierCurveTo(width * 0.62, height * 0.75, width * 0.95, height * 0.88, width * 1.1, height);
    ctx.lineTo(width * 0.3, height);
    ctx.bezierCurveTo(width * 0.4, height * 0.82, width * 0.48, height * 0.68, width * 0.55, height * 0.6);
    ctx.bezierCurveTo(width * 0.65, height * 0.5, width * 0.46, height * 0.45, width * 0.45, height * 0.42);
    
    const riverGrad = ctx.createLinearGradient(0, height * 0.42, 0, height);
    riverGrad.addColorStop(0, '#5DADE2');
    riverGrad.addColorStop(0.4, '#85C1E9');
    riverGrad.addColorStop(0.7, '#F5B7B1'); // Sunrise pink river reflection!
    riverGrad.addColorStop(1, '#A9CCE3');
    ctx.fillStyle = riverGrad;
    ctx.fill();
    ctx.restore();

    // River Dawn Shimmering Ripples
    ctx.strokeStyle = 'rgba(255, 245, 200, 0.5)';
    ctx.lineWidth = 2;
    for (let r = 0; r < 6; r++) {
      const rx = width * 0.58 + Math.sin(t + r) * 20;
      const ry = height * 0.52 + r * 25;
      ctx.beginPath();
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx + 40 + Math.sin(r) * 15, ry);
      ctx.stroke();
    }

    // 6. LUSH GREEN PADDY FIELDS & VILLAGE LANDSCAPE (সবুজ মাঠ ও মেঠো পথ)
    // Left Field Contour
    const fieldGradLeft = ctx.createLinearGradient(0, height * 0.4, width * 0.5, height);
    fieldGradLeft.addColorStop(0, '#2E7D32'); // Rich paddy green
    fieldGradLeft.addColorStop(0.5, '#4CAF50');
    fieldGradLeft.addColorStop(1, '#81C784');

    ctx.fillStyle = fieldGradLeft;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.42);
    ctx.bezierCurveTo(width * 0.25, height * 0.44, width * 0.35, height * 0.5, width * 0.42, height * 0.6);
    ctx.bezierCurveTo(width * 0.2, height * 0.75, width * 0.1, height * 0.9, 0, height);
    ctx.fill();

    // Right Field Contour
    const fieldGradRight = ctx.createLinearGradient(width * 0.5, height * 0.4, width, height);
    fieldGradRight.addColorStop(0, '#388E3C');
    fieldGradRight.addColorStop(0.6, '#66BB6A');
    fieldGradRight.addColorStop(1, '#2E7D32');

    ctx.fillStyle = fieldGradRight;
    ctx.beginPath();
    ctx.moveTo(width, height * 0.42);
    ctx.lineTo(width * 0.65, height * 0.44);
    ctx.bezierCurveTo(width * 0.78, height * 0.52, width * 0.88, height * 0.65, width, height * 0.85);
    ctx.fill();

    // Winding Dirt Pathway (মেঠো পথ)
    ctx.fillStyle = '#D7CCC8'; // Warm clay path
    ctx.beginPath();
    ctx.moveTo(width * 0.25, height * 0.44);
    ctx.bezierCurveTo(width * 0.32, height * 0.52, width * 0.22, height * 0.68, width * 0.38, height);
    ctx.bezierCurveTo(width * 0.42, height, width * 0.28, height * 0.7, width * 0.28, height * 0.44);
    ctx.fill();

    // Paddy Field Grass Blade Details (ধানখেত)
    ctx.strokeStyle = '#2E7D32';
    ctx.lineWidth = 1.5;
    const breeze = Math.sin(t * (1 + atmosphere.breezeSpeed * 0.02)) * (3 + atmosphere.breezeSpeed * 0.1);
    
    for (let gx = 20; gx < width * 0.4; gx += 18) {
      for (let gy = height * 0.48; gy < height * 0.9; gy += 25) {
        if (Math.random() > 0.3) {
          ctx.beginPath();
          ctx.moveTo(gx, gy);
          ctx.quadraticCurveTo(gx + breeze, gy - 12, gx + breeze * 1.5 + 4, gy - 20);
          ctx.moveTo(gx + 5, gy);
          ctx.quadraticCurveTo(gx + 5 + breeze, gy - 10, gx + 8 + breeze * 1.2, gy - 18);
          ctx.stroke();

          // Dewdrop glistens (শিশিরকণা)
          if (atmosphere.dewGlow && (gx + gy) % 7 === 0) {
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(gx + breeze * 1.5 + 4, gy - 20, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // 7. RENDER PLACED SCENE ELEMENTS (houses, trees, birds, boats)
    elements.forEach((elem) => {
      ctx.save();
      ctx.translate(elem.x, elem.y);
      ctx.scale(elem.scale, elem.scale);

      const isSel = elem.id === selectedId;

      if (elem.type === 'house') {
        // Red-roofed village house (লাল ছাদওয়ালা গ্রামীন বাড়ি)
        // Main Mud Wall
        ctx.fillStyle = '#D7CCC8';
        ctx.fillRect(-35, -20, 70, 40);

        // Bamboo Wood Trim
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 2;
        ctx.strokeRect(-35, -20, 70, 40);

        // VIBRANT RED ROOF (লাল ছাদ)
        const roofGrad = ctx.createLinearGradient(0, -45, 0, -20);
        roofGrad.addColorStop(0, '#E53935'); // Radiant village red
        roofGrad.addColorStop(0.7, '#C62828');
        roofGrad.addColorStop(1, '#B71C1C');

        ctx.fillStyle = roofGrad;
        ctx.beginPath();
        ctx.moveTo(-45, -20);
        ctx.lineTo(0, -48);
        ctx.lineTo(45, -20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Roof corrugated tin lines
        ctx.strokeStyle = '#FF8A80';
        ctx.lineWidth = 1;
        for (let rx = -35; rx <= 35; rx += 10) {
          ctx.beginPath();
          ctx.moveTo(rx * 0.2, -45);
          ctx.lineTo(rx, -20);
          ctx.stroke();
        }

        // Porch Door & Window
        ctx.fillStyle = '#3E2723';
        ctx.fillRect(-10, 0, 18, 20); // Door

        // Morning Lamp Window Glow
        ctx.fillStyle = '#FFF59D';
        ctx.fillRect(12, -8, 14, 12);
        ctx.strokeStyle = '#5D4037';
        ctx.strokeRect(12, -8, 14, 12);

        // Chimney & Rising Smoke (রান্নার ধোঁয়া)
        ctx.fillStyle = '#795548';
        ctx.fillRect(20, -42, 8, 15);

        if (atmosphere.smokeEnabled) {
          ctx.fillStyle = 'rgba(240, 240, 240, 0.4)';
          for (let sm = 0; sm < 4; sm++) {
            const smY = -45 - sm * 15 - (t * 10) % 20;
            const smX = 24 + Math.sin(t + sm) * (6 + sm * 3);
            const smR = 5 + sm * 4;
            ctx.beginPath();
            ctx.arc(smX, smY, smR, 0, Math.PI * 2);
            ctx.fill();
          }
        }

      } else if (elem.type === 'palm') {
        // Coconut / Palm Tree (নারকেল গাছ)
        ctx.strokeStyle = '#4E342E';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(0, 20);
        ctx.quadraticCurveTo(-15, -40, -10, -90);
        ctx.stroke();

        // Palm Leaves
        ctx.save();
        ctx.translate(-10, -90);
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 3;
        for (let a = 0; a < 7; a++) {
          const ang = (a * Math.PI) / 3.5 - Math.PI * 0.8;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(Math.cos(ang) * 35, Math.sin(ang) * 35 + 10, Math.cos(ang) * 55, Math.sin(ang) * 55 + 20);
          ctx.stroke();
        }
        ctx.restore();

      } else if (elem.type === 'boat') {
        // Wooden Dinghy Boat (ডিঙি নৌকা)
        ctx.fillStyle = '#3E2723';
        ctx.beginPath();
        ctx.moveTo(-35, 0);
        ctx.quadraticCurveTo(0, 18, 35, 0);
        ctx.quadraticCurveTo(0, -6, -35, 0);
        ctx.fill();

        // Bamboo Canopy (ছৈ)
        ctx.fillStyle = '#8D6E63';
        ctx.beginPath();
        ctx.arc(0, -2, 16, Math.PI, 0);
        ctx.fill();

        // Oar / Pole
        ctx.strokeStyle = '#D7CCC8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-25, 5);
        ctx.lineTo(20, -15);
        ctx.stroke();

      } else if (elem.type === 'bird') {
        // Flying Bird (উড়ন্ত পাখি)
        ctx.strokeStyle = '#1A237E';
        ctx.lineWidth = 2.5;
        const wing = Math.sin(t * 3) * 8;
        ctx.beginPath();
        ctx.moveTo(-15, -wing);
        ctx.quadraticCurveTo(-7, 0, 0, -4);
        ctx.quadraticCurveTo(7, 0, 15, -wing);
        ctx.stroke();
      }

      // Selection Highlight Box
      if (isSel) {
        ctx.strokeStyle = '#FF5722';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(-45, -55, 90, 80);
        ctx.setLineDash([]);
      }

      ctx.restore();
    });

    // 8. RENDER ANIMATED BIRDS FROM ATMOSPHERE COUNT (পাখির ঝাঁক)
    ctx.strokeStyle = '#283593';
    ctx.lineWidth = 2;
    for (let b = 0; b < atmosphere.birdCount; b++) {
      const bx = ((b * 120 + t * 40) % (width + 200)) - 100;
      const by = 80 + Math.sin(b * 2 + t) * 30 + (b % 4) * 25;
      const wing = Math.sin(t * 4 + b) * 7;

      ctx.beginPath();
      ctx.moveTo(bx - 12, by - wing);
      ctx.quadraticCurveTo(bx - 6, by, bx, by - 3);
      ctx.quadraticCurveTo(bx + 6, by, bx + 12, by - wing);
      ctx.stroke();
    }

    // 9. HEAVY MORNING MIST & FOG LAYERS (কুয়াশার চাদর)
    if (atmosphere.mistDensity > 0) {
      const mistAlpha = (atmosphere.mistDensity / 100) * 0.55;

      // Layer 1: Ground Mist
      const groundMistGrad = ctx.createLinearGradient(0, height * 0.5, 0, height);
      groundMistGrad.addColorStop(0, `rgba(255, 255, 255, ${mistAlpha * 0.8})`);
      groundMistGrad.addColorStop(0.5, `rgba(245, 235, 225, ${mistAlpha})`);
      groundMistGrad.addColorStop(1, `rgba(255, 255, 255, ${mistAlpha * 0.4})`);

      ctx.fillStyle = groundMistGrad;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.5);
      for (let mx = 0; mx <= width; mx += 40) {
        const my = height * 0.5 + Math.sin(mx * 0.01 + t * 0.5) * 20;
        ctx.lineTo(mx, my);
      }
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.fill();

      // Layer 2: Floating Mist Clouds
      ctx.fillStyle = `rgba(255, 248, 240, ${mistAlpha * 0.4})`;
      for (let mc = 0; mc < 3; mc++) {
        const mcX = ((mc * 400 + t * 10) % (width + 400)) - 200;
        const mcY = height * 0.4 + mc * 60;
        ctx.beginPath();
        ctx.ellipse(mcX, mcY, 180, 35, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 10. USER DRAWN CUSTOM WATERCOLOR STROKES
    strokes.forEach((s) => {
      if (s.points.length < 2) return;
      ctx.save();
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.globalAlpha = s.opacity;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (s.tool === 'mist_brush') {
        ctx.shadowBlur = 15;
        ctx.shadowColor = s.color;
      }

      ctx.beginPath();
      ctx.moveTo(s.points[0].x, s.points[0].y);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x, s.points[i].y);
      }
      ctx.stroke();
      ctx.restore();
    });

    // Current stroke being drawn
    if (isDrawing && currentStroke.length > 1) {
      ctx.save();
      ctx.strokeStyle = activeTool === 'mist_brush' ? 'rgba(255, 255, 255, 0.6)' : strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.globalAlpha = activeTool === 'mist_brush' ? 0.5 : 0.85;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(currentStroke[0].x, currentStroke[0].y);
      for (let i = 1; i < currentStroke.length; i++) {
        ctx.lineTo(currentStroke[i].x, currentStroke[i].y);
      }
      ctx.stroke();
      ctx.restore();
    }

  }, [atmosphere, elements, strokes, isDrawing, currentStroke, activeTool, strokeColor, strokeWidth, selectedId]);

  // Request animation frame for smooth movement
  useEffect(() => {
    const loop = () => {
      timeRef.current += 1;
      renderScene();
      animFrameRef.current = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [renderScene]);

  // Resize handler for Canvas container
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = Math.max(500, rect.width * 0.5625); // 16:9 ratio
    };

    updateSize();
    const observer = new ResizeObserver(updateSize);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  // Pointer & Interaction Handlers
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);

    if (activeTool === 'brush' || activeTool === 'mist_brush') {
      setIsDrawing(true);
      setCurrentStroke([coords]);
      return;
    }

    if (activeTool === 'select') {
      // Check if clicking existing element
      const clicked = elements.find((el) => {
        const dx = el.x - coords.x;
        const dy = el.y - coords.y;
        return Math.sqrt(dx * dx + dy * dy) < 40 * el.scale;
      });

      if (clicked) {
        setSelectedId(clicked.id);
        setIsDragging(true);
        setDragOffset({ x: coords.x - clicked.x, y: coords.y - clicked.y });
      } else {
        setSelectedId(null);
      }
      return;
    }

    // Place element tool
    if (['house', 'palm', 'boat', 'bird'].includes(activeTool)) {
      pushHistory();
      const newElem: SceneElement = {
        id: `el_${Date.now()}`,
        type: activeTool,
        x: coords.x,
        y: coords.y,
        scale: activeTool === 'house' ? 0.9 : 1,
      };
      setElements((prev) => [...prev, newElem]);
      setSelectedId(newElem.id);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);

    if (isDrawing) {
      setCurrentStroke((prev) => [...prev, coords]);
      return;
    }

    if (isDragging && selectedId) {
      setElements((prev) =>
        prev.map((el) =>
          el.id === selectedId
            ? { ...el, x: coords.x - dragOffset.x, y: coords.y - dragOffset.y }
            : el
        )
      );
    }
  };

  const handlePointerUp = () => {
    if (isDrawing && currentStroke.length > 0) {
      pushHistory();
      const newStroke: DrawStroke = {
        id: `str_${Date.now()}`,
        tool: activeTool === 'mist_brush' ? 'mist_brush' : 'brush',
        points: currentStroke,
        color: activeTool === 'mist_brush' ? 'rgba(255, 255, 255, 0.6)' : strokeColor,
        width: activeTool === 'mist_brush' ? strokeWidth * 2 : strokeWidth,
        opacity: activeTool === 'mist_brush' ? 0.5 : 0.85,
      };
      setStrokes((prev) => [...prev, newStroke]);
    }

    setIsDrawing(false);
    setCurrentStroke([]);
    setIsDragging(false);
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-stone-900 to-stone-950 border border-amber-900/30 shadow-2xl">
      {/* Top Toolbar overlay */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-stone-900/80 backdrop-blur-md border border-stone-700/50 text-stone-200">
        
        {/* Color Palette for Brush Tool */}
        {(activeTool === 'brush' || activeTool === 'mist_brush') && (
          <div className="flex items-center gap-2 bg-stone-800/80 p-1.5 rounded-lg border border-stone-700">
            <span className="text-xs text-amber-200 font-medium px-1">
              {language === 'bn' ? 'রং:' : 'Color:'}
            </span>
            {['#E53935', '#FF7E5F', '#FEB47B', '#4CAF50', '#2E7D32', '#1A237E', '#FFFFFF'].map((c) => (
              <button
                key={c}
                onClick={() => setStrokeColor(c)}
                className={`w-6 h-6 rounded-full border border-white/30 transition-transform ${
                  strokeColor === c ? 'scale-125 ring-2 ring-amber-400' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
            <input
              type="range"
              min={3}
              max={24}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-16 accent-amber-500 cursor-pointer ml-2"
              title={language === 'bn' ? 'ব্রাশের পুরুত্ব' : 'Brush Size'}
            />
          </div>
        )}

        {/* Selected Element Controls (Scale / Delete) */}
        {selectedId && (
          <div className="flex items-center gap-2 bg-amber-950/70 px-3 py-1.5 rounded-lg border border-amber-700/50 text-amber-100 text-xs">
            <span>{language === 'bn' ? 'বাছাইকৃত উপাদান' : 'Selected Element'}</span>
            <button
              onClick={() => {
                setElements((prev) =>
                  prev.map((el) => (el.id === selectedId ? { ...el, scale: el.scale * 1.15 } : el))
                );
              }}
              className="p-1 hover:bg-amber-800/60 rounded"
              title="Scale Up"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setElements((prev) =>
                  prev.map((el) => (el.id === selectedId ? { ...el, scale: Math.max(0.4, el.scale * 0.85) } : el))
                );
              }}
              className="p-1 hover:bg-amber-800/60 rounded"
              title="Scale Down"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setElements((prev) => prev.filter((el) => el.id !== selectedId));
                setSelectedId(null);
              }}
              className="p-1 hover:bg-red-800/80 rounded text-red-300"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium border border-stone-700 disabled:opacity-40 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {language === 'bn' ? 'পূর্বাবস্থা' : 'Undo'}
          </button>

          <button
            onClick={handleClearCanvas}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 text-red-200 text-xs font-medium border border-red-800/50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {language === 'bn' ? 'মুছে ফেলুন' : 'Clear'}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-semibold shadow-md transition-all transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            {language === 'bn' ? 'ছবি সেভ করুন' : 'Save Image'}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Element */}
      <div ref={containerRef} className="w-full relative cursor-crosshair">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full block touch-none"
        />

        {/* Watermark overlay */}
        <div className="absolute bottom-3 right-4 pointer-events-none text-right">
          <p className="text-xs font-serif font-medium text-amber-100/80 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {language === 'bn' ? 'শান্ত সকালের গ্রামীণ ক্যানভাস' : 'Peaceful Rural Morning Canvas'}
          </p>
          <p className="text-[10px] text-amber-200/60 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {language === 'bn' ? 'কুয়াশায় ঢাকা লাল ছাদ ও সূর্যোদয়' : 'Misty Red Roofs & Orange Sunrise'}
          </p>
        </div>
      </div>
    </div>
  );
};
