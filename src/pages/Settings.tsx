import React, { useState } from 'react';
import { useWeatherStore } from '../store/useWeatherStore';
import { motion } from 'framer-motion';
import { 
  FiToggleLeft, FiToggleRight, FiTrash2, FiInfo, FiSliders, FiBell, FiShield, FiHeart 
} from 'react-icons/fi';

export const Settings: React.FC = () => {
  const { 
    unit, setUnit, theme, setTheme, favorites, removeFavorite, 
    notificationsEnabled, toggleNotifications, clearRecentSearches 
  } = useWeatherStore();

  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    // Clear response caches
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('skycast_cache_')) {
        localStorage.removeItem(key);
      }
    });
    clearRecentSearches();
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white">System Settings</h2>
        <p className="text-xs text-slate-400">Configure SkyCast preferences and cached databases</p>
      </div>

      {/* Preferences Section */}
      <div className="glass-card rounded-2xl p-5 flex flex-col gap-5 border border-white/5">
        <div className="flex items-center gap-2 text-indigo-400 border-b border-white/5 pb-3">
          <FiSliders size={18} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Preferences</h3>
        </div>

        {/* Temperature Unit */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-white">Temperature Metric</p>
            <p className="text-[11px] text-slate-400">Select active measurement units</p>
          </div>
          <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setUnit('C')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${unit === 'C' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Celsius (°C)
            </button>
            <button
              onClick={() => setUnit('F')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${unit === 'F' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              Fahrenheit (°F)
            </button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-white">Display Atmosphere</p>
            <p className="text-[11px] text-slate-400">Dark/Light interface adjustment</p>
          </div>
          <div className="flex gap-1 bg-white/5 p-1 rounded-xl border border-white/5">
            {(['light', 'dark', 'auto'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${theme === t ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-white">Weather Alerts</p>
            <p className="text-[11px] text-slate-400">Enable system notification alerts</p>
          </div>
          <button
            onClick={toggleNotifications}
            className="text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            {notificationsEnabled ? (
              <FiToggleRight size={32} className="text-indigo-400" />
            ) : (
              <FiToggleLeft size={32} className="text-slate-500" />
            )}
          </button>
        </div>
      </div>

      {/* Favorite Cities */}
      <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 border border-white/5">
        <div className="flex items-center gap-2 text-rose-400 border-b border-white/5 pb-3">
          <FiHeart size={18} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Favorite Locations</h3>
        </div>
        {favorites.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No saved locations yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {favorites.map((city, idx) => (
              <div 
                key={idx}
                className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-xl border border-white/5"
              >
                <span className="text-sm font-bold text-white">{city}</span>
                <button
                  onClick={() => removeFavorite(city)}
                  className="text-rose-400 hover:text-rose-300 transition-all p-1"
                  title="Remove location"
                >
                  <FiTrash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="glass-card rounded-2xl p-5 flex flex-col gap-4 border border-white/5">
        <div className="flex items-center gap-2 text-amber-400 border-b border-white/5 pb-3">
          <FiBell size={18} />
          <h3 className="text-xs font-bold uppercase tracking-wider">Cache & Telemetry</h3>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-white">Reset Local Database</p>
            <p className="text-[11px] text-slate-400">Clears search histories and response caches</p>
          </div>
          <button
            onClick={handleClearCache}
            className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/20 transition-all cursor-pointer active:scale-95"
          >
            Clear Database
          </button>
        </div>
        {cacheCleared && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs py-2 px-4 rounded-xl text-center">
            Database caches purged successfully!
          </div>
        )}
      </div>

      {/* About Application */}
      <div className="glass-card rounded-2xl p-5 flex flex-col gap-3 border border-white/5 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-300 border-b border-white/5 pb-3 mb-1">
          <FiInfo size={16} />
          <h3 className="text-xs font-bold uppercase tracking-wider">About SkyCast</h3>
        </div>
        <p>
          <strong>SkyCast</strong> is a next-generation meteorological telemetry engine powered by WeatherAPI.com. Built with advanced offline cache layer to guarantee operation under poor signal.
        </p>
        <div className="flex items-center gap-1 mt-2 text-[10px] text-indigo-400 hover:underline">
          <FiShield size={12} />
          <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy & Data Security</a>
        </div>
        <p className="text-[10px] text-slate-500 mt-2">Version 1.2.0 (Stable Production Build)</p>
      </div>
    </motion.div>
  );
};
