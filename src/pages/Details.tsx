import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchWeatherForecast } from '../services/api/weatherApi';
import { useWeatherStore } from '../store/useWeatherStore';
import { WeatherMap } from '../components/map/WeatherMap';
import { 
  FiSun, FiSunset, FiDroplet, FiCompass, FiCloud, 
  FiEye, FiTrendingUp, FiMoon, FiAlertCircle 
} from 'react-icons/fi';

export const Details: React.FC = () => {
  const activeCity = useWeatherStore((state) => state.activeCity);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['weatherForecast', activeCity],
    queryFn: () => fetchWeatherForecast(activeCity),
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Extracting atmospheric stats...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-10">
        <p className="text-rose-400">Failed to load weather details.</p>
      </div>
    );
  }

  const current = data.current;
  const location = data.location;
  const astro = data.forecast.forecastday[0].astro;
  const aqi = current.air_quality;

  // AQI Rating helper
  const getAQIDesc = (index: number) => {
    switch (index) {
      case 1: return { text: 'Good', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
      case 2: return { text: 'Moderate', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
      case 3: return { text: 'Unhealthy for Sensitive Groups', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
      case 4: return { text: 'Unhealthy', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' };
      case 5: return { text: 'Very Unhealthy', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' };
      default: return { text: 'Hazardous', color: 'text-red-500 bg-red-500/10 border-red-500/20' };
    }
  };

  const aqiDesc = aqi ? getAQIDesc(aqi['us-epa-index']) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white">Atmospheric Details</h2>
        <p className="text-xs text-slate-400">Granular environmental readouts for {location.name}</p>
      </div>

      {/* Map Integration */}
      <WeatherMap 
        lat={location.lat} 
        lon={location.lon} 
        cityName={location.name} 
        temp={current.temp_c} 
        condition={current.condition.text} 
      />

      {/* AQI Overview */}
      {aqi && aqiDesc && (
        <div className={`glass-card rounded-2xl p-5 border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${aqiDesc.color.split(' ')[2]}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Air Quality Index (EPA)</span>
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${aqiDesc.text === 'Good' ? 'text-emerald-400' : 'text-amber-400'}`}>
                {aqiDesc.text}
              </span>
              <span className="text-xs text-slate-400">• index level {aqi['us-epa-index']}</span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Contains PM2.5: {aqi.pm2_5.toFixed(1)} µg/m³, PM10: {aqi.pm10.toFixed(1)} µg/m³, O3: {aqi.o3.toFixed(1)} µg/m³.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 border border-white/5 px-3 py-1.5 rounded-xl">
            <FiAlertCircle size={16} />
            <span className="text-xs font-semibold">Active Monitoring</span>
          </div>
        </div>
      )}

      {/* Detail Widgets Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Pressure */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28 border border-white/5">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pressure</span>
            <FiTrendingUp size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">{current.pressure_mb} hPa</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Stable atmosphere</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28 border border-white/5">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Humidity</span>
            <FiDroplet size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">{current.humidity}%</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Dew point: {current.dewpoint_c}°C</span>
          </div>
        </div>

        {/* Visibility */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28 border border-white/5">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Visibility</span>
            <FiEye size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">{current.vis_km} km</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Clear atmosphere</span>
          </div>
        </div>

        {/* Wind Dir */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28 border border-white/5">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Wind Flow</span>
            <FiCompass size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">{current.wind_dir}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Bearing angle: {current.wind_degree}°</span>
          </div>
        </div>

        {/* Cloud coverage */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28 border border-white/5">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Clouds</span>
            <FiCloud size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">{current.cloud}%</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Sky coverage</span>
          </div>
        </div>

        {/* Moon Phase */}
        <div className="glass-card rounded-2xl p-4 flex flex-col justify-between h-28 border border-white/5">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Moon Phase</span>
            <FiMoon size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white truncate">{astro.moon_phase}</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Illum: {astro.moon_illumination}%</span>
          </div>
        </div>
      </div>

      {/* Astro Sunrise/Sunset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 rounded-xl text-amber-400">
              <FiSun size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sunrise</p>
              <p className="text-lg font-extrabold text-white">{astro.sunrise}</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold bg-white/5 px-2 py-1 rounded-md">
            First light
          </span>
        </div>

        <div className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">
              <FiSunset size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sunset</p>
              <p className="text-lg font-extrabold text-white">{astro.sunset}</p>
            </div>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold bg-white/5 px-2 py-1 rounded-md">
            Nightfall
          </span>
        </div>
      </div>
    </motion.div>
  );
};
