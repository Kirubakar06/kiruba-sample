import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchWeatherForecast } from '../services/api/weatherApi';
import { useWeatherStore } from '../store/useWeatherStore';
import { generateAISummary } from '../services/aiSummary';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { 
  FiSearch, FiMapPin, FiMic, FiRefreshCw, FiHeart, 
  FiShare2, FiWind, FiDroplet, FiEye, FiSun 
} from 'react-icons/fi';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiNightClear } from 'react-icons/wi';

const getWeatherIcon = (code: number, isDay: number) => {
  if (isDay === 0) return <WiNightClear className="text-indigo-400" size={64} />;
  if (code === 1000) return <WiDaySunny className="text-yellow-400" size={64} />;
  if ([1003, 1006, 1009].includes(code)) return <WiCloudy className="text-slate-300" size={64} />;
  if ([1063, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243].includes(code)) return <WiRain className="text-sky-400" size={64} />;
  if ([1066, 1114, 1210, 1213, 1216, 1219, 1222, 1225, 1255].includes(code)) return <WiSnow className="text-teal-200" size={64} />;
  return <WiThunderstorm className="text-purple-400" size={64} />;
};

export const Home: React.FC = () => {
  const { activeCity, setActiveCity, unit, favorites, addFavorite, removeFavorite, addRecentSearch, recentSearches } = useWeatherStore();
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  // TanStack Query for cache & loading state management
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['weatherForecast', activeCity],
    queryFn: () => fetchWeatherForecast(activeCity),
    staleTime: 300000, // 5 mins cache
  });

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchInput.trim()) {
      setActiveCity(searchInput.trim());
      addRecentSearch(searchInput.trim());
      setShowSuggestions(false);
    }
  };

  const handleGPSLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude},${position.coords.longitude}`;
          setActiveCity(coords);
          addRecentSearch(coords);
        },
        (error) => {
          console.error(error);
          alert('GPS permission denied or unavailable. Using London as fallback.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const { startListening, isListening } = useVoiceSearch((result) => {
    setSearchInput(result);
    setActiveCity(result);
    addRecentSearch(result);
  });

  const toggleFavorite = () => {
    if (!data) return;
    const name = data.location.name;
    if (favorites.some((fav) => fav.toLowerCase() === name.toLowerCase())) {
      removeFavorite(name);
    } else {
      addFavorite(name);
    }
  };

  const handleShare = () => {
    if (!data) return;
    const text = `Current Weather in ${data.location.name}: ${data.current.temp_c}°C, ${data.current.condition.text}. Sent via SkyCast.`;
    if (navigator.share) {
      navigator.share({
        title: 'SkyCast Weather',
        text,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      setShareMessage('Report copied to clipboard!');
      setTimeout(() => setShareMessage(null), 3000);
    }
  };

  const isFav = data ? favorites.some((fav) => fav.toLowerCase() === data.location.name.toLowerCase()) : false;

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium animate-pulse">Syncing satellite telemetry...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="text-rose-500 text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-bold text-white mb-2">Failed to Fetch Weather</h2>
        <p className="text-slate-400 max-w-sm mb-6">Could not connect to meteorological networks. Please check your spelling or internet connection.</p>
        <button 
          onClick={() => refetch()} 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-indigo-600 font-semibold shadow-lg hover:shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const aiSummary = generateAISummary(data);
  const tempVal = unit === 'C' ? data.current.temp_c : data.current.temp_f;
  const feelsLikeVal = unit === 'C' ? data.current.feelslike_c : data.current.feelslike_f;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 flex flex-col gap-6"
    >
      {/* Search Header */}
      <div className="relative">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search cities (e.g. New York, Tokyo)..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full glass-input rounded-full py-3 pl-11 pr-24 text-white placeholder-slate-400 text-sm focus:outline-none"
            />
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            
            {/* Quick utility controls */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={startListening}
                className={`p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all ${isListening ? 'bg-sky-500/20 text-sky-400 animate-pulse' : ''}`}
                title="Voice Search"
              >
                <FiMic size={16} />
              </button>
              <button
                type="button"
                onClick={handleGPSLocation}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                title="Use Current Location"
              >
                <FiMapPin size={16} />
              </button>
            </div>
          </div>
          <button 
            type="submit"
            className="px-5 rounded-full bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Suggestion Dropdown */}
        {showSuggestions && recentSearches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl p-2 z-30 shadow-2xl border border-white/10">
            <div className="flex justify-between items-center px-3 py-1.5">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Recently Viewed</span>
              <button 
                type="button"
                onClick={() => useWeatherStore.getState().clearRecentSearches()}
                className="text-[10px] text-rose-400 hover:underline"
              >
                Clear All
              </button>
            </div>
            {recentSearches.map((city, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveCity(city);
                  setSearchInput('');
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-white/5 rounded-xl transition-all"
              >
                {city.includes(',') ? '📍 Current GPS Coordinates' : city}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Temp Card */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden border border-white/10">
        <div className="flex flex-col gap-1.5 z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-white">{data.location.name}</h2>
            <span className="text-xs text-slate-400 font-medium bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
              {data.location.country}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-semibold tracking-wide uppercase">
            {data.location.localtime}
          </p>

          <div className="flex items-baseline gap-1 mt-4">
            <h1 className="text-6xl md:text-7xl font-extrabold tracking-tighter text-white">
              {tempVal}°
            </h1>
            <span className="text-2xl font-bold text-slate-400">{unit}</span>
          </div>
          <p className="text-sm text-slate-300 font-medium">
            Feels like {feelsLikeVal}°{unit} • <span className="capitalize">{data.current.condition.text}</span>
          </p>
        </div>

        {/* Big Weather Icon */}
        <div className="self-end md:self-center mt-6 md:mt-0 flex flex-col items-center gap-2 z-10">
          {getWeatherIcon(data.current.condition.code, data.current.is_day)}
          {isFetching && (
            <span className="flex items-center gap-1.5 text-[10px] text-sky-400 font-semibold animate-pulse bg-sky-500/10 px-2 py-0.5 rounded-full">
              <FiRefreshCw className="animate-spin" size={10} /> Syncing
            </span>
          )}
        </div>

        {/* Action Tray */}
        <div className="absolute top-4 right-4 flex items-center gap-1">
          <button 
            onClick={toggleFavorite}
            className={`p-2 rounded-full transition-all border ${isFav ? 'bg-rose-500/20 border-rose-500/20 text-rose-400' : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'}`}
            title="Favorite City"
          >
            <FiHeart size={16} fill={isFav ? 'currentColor' : 'none'} />
          </button>
          <button 
            onClick={handleShare}
            className="p-2 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all"
            title="Share Weather"
          >
            <FiShare2 size={16} />
          </button>
          <button 
            onClick={() => refetch()}
            className="p-2 rounded-full bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all"
            title="Refresh weather"
          >
            <FiRefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {shareMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs py-2 px-4 rounded-xl text-center font-medium">
          {shareMessage}
        </div>
      )}

      {/* AI Weather Summary Box */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-500/10 to-transparent blur-xl pointer-events-none" />
        <div className="flex items-center gap-2 mb-3">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400">SkyCast AI Advisor</h3>
        </div>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
          {aiSummary}
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-sky-500/10 rounded-xl text-sky-400">
            <FiWind size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Wind</p>
            <p className="text-sm font-bold text-white">{data.current.wind_kph} km/h</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
            <FiDroplet size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Humidity</p>
            <p className="text-sm font-bold text-white">{data.current.humidity}%</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
            <FiEye size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Visibility</p>
            <p className="text-sm font-bold text-white">{data.current.vis_km} km</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 rounded-xl text-rose-400">
            <FiSun size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">UV Index</p>
            <p className="text-sm font-bold text-white">{data.current.uv} (Mod)</p>
          </div>
        </div>
      </div>

      {/* Explore Popular Cities Section */}
      <div className="flex flex-col gap-3 mt-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Explore Global Cities</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { name: 'Chennai', flag: '🇮🇳 India', code: 'chennai' },
            { name: 'Tokyo', flag: '🇯🇵 Japan', code: 'tokyo' },
            { name: 'New York', flag: '🇺🇸 USA', code: 'new york' },
            { name: 'London', flag: '🇬🇧 UK', code: 'london' },
            { name: 'Paris', flag: '🇫🇷 France', code: 'paris' },
            { name: 'Dubai', flag: '🇦🇪 UAE', code: 'dubai' },
            { name: 'Sydney', flag: '🇦🇺 Australia', code: 'sydney' },
            { name: 'Cape Town', flag: '🇿🇦 South Africa', code: 'cape town' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => setActiveCity(item.name)}
              className="glass-card rounded-xl p-3 text-left border border-white/5 cursor-pointer flex flex-col hover:border-indigo-500/40"
            >
              <span className="text-xs font-bold text-white">{item.name}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">{item.flag}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
