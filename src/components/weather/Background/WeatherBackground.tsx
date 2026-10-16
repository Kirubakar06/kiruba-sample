import React, { useEffect, useRef, useState } from 'react';

interface WeatherBackgroundProps {
  conditionCode: number;
  isDay: number;
  countryName: string;
}

export type WeatherBackgroundType = 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'stormy' | 'night';

export const getWeatherType = (code: number, isDay: number): WeatherBackgroundType => {
  if (isDay === 0) return 'night';
  
  // WeatherAPI.com codes mapping:
  // 1000 - Sunny / Clear
  if (code === 1000) return 'sunny';
  
  // 1003, 1006, 1009 - Cloudy / Overcast
  if ([1003, 1006, 1009, 1030, 1135, 1147].includes(code)) return 'cloudy';
  
  // Rain / drizzle codes
  if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246].includes(code)) return 'rainy';
  
  // Snow / sleet / ice pellet codes
  if ([1066, 1069, 1072, 1114, 1117, 1210, 1213, 1216, 1219, 1222, 1225, 1255, 1258].includes(code)) return 'snowy';
  
  // Thunderstorm codes
  if ([1087, 1273, 1276, 1279, 1282].includes(code)) return 'stormy';
  
  return 'sunny'; // Default
};

const landmarkMap: Record<string, string> = {
  'india': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  'japan': 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
  'united states': 'https://images.unsplash.com/photo-1522083165195-342750297f05?auto=format&fit=crop&w=1200&q=80',
  'united kingdom': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
  'france': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  'australia': 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
  'canada': 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=1200&q=80',
  'egypt': 'https://images.unsplash.com/photo-1503177119275-0aa32b31d468?auto=format&fit=crop&w=1200&q=80',
  'south africa': 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=1200&q=80',
  'united arab emirates': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
  'brazil': 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=1200&q=80',
  'germany': 'https://images.unsplash.com/photo-1599946347371-68eb71b16afc?auto=format&fit=crop&w=1200&q=80',
  'russia': 'https://images.unsplash.com/photo-1513326796272-4ab147ebbe6b?auto=format&fit=crop&w=1200&q=80',
  'china': 'https://images.unsplash.com/photo-1508129053210-7313a8f5680c?auto=format&fit=crop&w=1200&q=80',
  'singapore': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
};

export const WeatherBackground: React.FC<WeatherBackgroundProps> = ({ conditionCode, isDay, countryName }) => {
  const type = getWeatherType(conditionCode, isDay);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [lightningFlash, setLightningFlash] = useState(false);

  // Background gradient map
  const gradients: Record<WeatherBackgroundType, string> = {
    sunny: 'from-[#ff9900] via-[#ff5e62] to-[#0f172a]',
    cloudy: 'from-[#4b5563] via-[#374151] to-[#0f172a]',
    rainy: 'from-[#1e3a8a] via-[#111827] to-[#05070f]',
    snowy: 'from-[#38bdf8] via-[#0284c7] to-[#0f172a]',
    stormy: 'from-[#1e1b4b] via-[#0f172a] to-[#020617]',
    night: 'from-[#050510] via-[#0d0d2b] to-[#020205]'
  };

  // Canvas particle effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Setup particles based on weather type
    interface Particle {
      x: number;
      y: number;
      speed: number;
      length?: number;
      size?: number;
      opacity: number;
      angle?: number;
    }

    const particles: Particle[] = [];
    const maxParticles = type === 'rainy' ? 120 : type === 'snowy' ? 80 : type === 'night' ? 60 : 0;

    for (let i = 0; i < maxParticles; i++) {
      if (type === 'rainy') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 10 + Math.random() * 15,
          length: 10 + Math.random() * 20,
          opacity: 0.15 + Math.random() * 0.4
        });
      } else if (type === 'snowy') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 1 + Math.random() * 3,
          size: 2 + Math.random() * 4,
          opacity: 0.2 + Math.random() * 0.6,
          angle: Math.random() * Math.PI * 2
        });
      } else if (type === 'night') {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: 0.05 + Math.random() * 0.1,
          size: 1 + Math.random() * 2,
          opacity: 0.2 + Math.random() * 0.8
        });
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      if (type === 'rainy') {
        ctx.strokeStyle = 'rgba(174, 219, 255, 0.4)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + 1, p.y + (p.length || 15));
          ctx.stroke();
          
          p.y += p.speed;
          p.x += 0.5; // Slight drift
          
          if (p.y > height) {
            p.y = -20;
            p.x = Math.random() * width;
          }
        }
      } else if (type === 'snowy') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
          ctx.fill();

          p.y += p.speed;
          if (p.angle !== undefined) {
            p.angle += 0.02;
            p.x += Math.sin(p.angle) * 0.5;
          }

          if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
          }
        }
      } else if (type === 'night') {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size || 1.5, 0, Math.PI * 2);
          ctx.fill();

          // Twinkle effect
          p.opacity += (Math.random() - 0.5) * 0.1;
          if (p.opacity < 0.2) p.opacity = 0.2;
          if (p.opacity > 0.9) p.opacity = 0.9;
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [type]);

  // Lightning effect trigger for stormy weather
  useEffect(() => {
    if (type !== 'stormy') return;

    const triggerLightning = () => {
      setLightningFlash(true);
      setTimeout(() => setLightningFlash(false), 80 + Math.random() * 100);
      
      // Randomly double flash
      if (Math.random() > 0.6) {
        setTimeout(() => {
          setLightningFlash(true);
          setTimeout(() => setLightningFlash(false), 50);
        }, 200);
      }

      // Schedule next flash
      const nextFlash = 4000 + Math.random() * 8000;
      lightningTimeout = setTimeout(triggerLightning, nextFlash);
    };

    let lightningTimeout = setTimeout(triggerLightning, 3000);

    return () => clearTimeout(lightningTimeout);
  }, [type]);

  const landmarkUrl = landmarkMap[countryName.toLowerCase()];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-20">
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b transition-colors duration-1000 ${gradients[type]}`} />

      {/* Landmark Image Background overlay */}
      {landmarkUrl && (
        <>
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-1000 opacity-45"
            style={{ backgroundImage: `url(${landmarkUrl})` }}
          />
          <div className="absolute inset-0 bg-[#05070f]/50 pointer-events-none" />
        </>
      )}

      {/* Canvas Particle Overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-80" />

      {/* Storm lightning overlay */}
      {type === 'stormy' && (
        <div 
          className={`absolute inset-0 bg-white/25 pointer-events-none transition-opacity duration-75 ${
            lightningFlash ? 'opacity-100' : 'opacity-0'
          }`} 
        />
      )}

      {/* Floating Cloudy Atmosphere */}
      {type === 'cloudy' && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-10 left-[-10%] w-[50%] h-40 bg-white rounded-full blur-[80px] animate-cloud-slow" />
          <div className="absolute top-40 left-[40%] w-[60%] h-60 bg-white rounded-full blur-[100px] animate-cloud-fast" />
        </div>
      )}

      {/* Sun glow/ray overlay for sunny */}
      {type === 'sunny' && (
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-yellow-400/20 blur-[120px] pointer-events-none" />
      )}
    </div>
  );
};
