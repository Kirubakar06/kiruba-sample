import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { fetchWeatherForecast } from '../services/api/weatherApi';
import { useWeatherStore } from '../store/useWeatherStore';
import { WeatherCharts } from '../components/charts/WeatherCharts';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';

const getWeatherIcon = (code: number) => {
  if (code === 1000) return <WiDaySunny className="text-yellow-400" size={32} />;
  if ([1003, 1006, 1009].includes(code)) return <WiCloudy className="text-slate-300" size={32} />;
  if ([1063, 1180, 1183, 1186, 1189, 1192, 1195].includes(code)) return <WiRain className="text-sky-400" size={32} />;
  if ([1066, 1114, 1210, 1213, 1216, 1219, 1222].includes(code)) return <WiSnow className="text-teal-200" size={32} />;
  return <WiThunderstorm className="text-purple-400" size={32} />;
};

export const Forecast: React.FC = () => {
  const activeCity = useWeatherStore((state) => state.activeCity);
  const unit = useWeatherStore((state) => state.unit);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['weatherForecast', activeCity],
    queryFn: () => fetchWeatherForecast(activeCity),
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-10">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-400 font-medium">Loading meteorological charts...</p>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="text-center py-10">
        <p className="text-rose-400">Failed to load forecast data.</p>
      </div>
    );
  }

  const hourlyForecast = data.forecast.forecastday[0].hour;
  const dailyForecast = data.forecast.forecastday;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="flex-1 flex flex-col gap-6"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-white">Meteorological Forecast</h2>
        <p className="text-xs text-slate-400">Deep telemetry and forecast trends for {data.location.name}</p>
      </div>

      {/* Hourly Card Strip */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Hourly Forecast (Next 24 Hours)</h3>
        <div className="flex gap-3.5 overflow-x-auto pb-3.5 scrollbar-thin">
          {hourlyForecast.slice(0, 24).map((hour, idx) => {
            const time = hour.time.split(' ')[1];
            const tempVal = unit === 'C' ? hour.temp_c : hour.temp_f;
            return (
              <div 
                key={idx}
                className="glass-card flex-shrink-0 w-24 py-4 rounded-2xl flex flex-col items-center gap-2 border border-white/5"
              >
                <span className="text-[10px] text-slate-400 font-bold">{time}</span>
                {getWeatherIcon(hour.condition.code)}
                <span className="text-sm font-bold text-white">{tempVal}°</span>
                <span className="text-[9px] text-sky-400 font-medium">{hour.chance_of_rain}% Rain</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <WeatherCharts hourlyForecast={hourlyForecast} />

      {/* 7-Day Forecast */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">7-Day Outlook</h3>
        <div className="flex flex-col gap-2.5">
          {dailyForecast.map((day, idx) => {
            const dateObj = new Date(day.date);
            const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
            const isToday = idx === 0;

            const maxT = unit === 'C' ? day.day.maxtemp_c : day.day.maxtemp_f;
            const minT = unit === 'C' ? day.day.mintemp_c : day.day.mintemp_f;

            return (
              <div 
                key={idx}
                className="glass-card rounded-2xl p-4 flex items-center justify-between border border-white/5"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">
                    {isToday ? 'Today' : weekday}
                  </span>
                  <span className="text-[10px] text-slate-400">{day.date}</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getWeatherIcon(day.day.condition.code)}
                    <span className="text-xs text-slate-300 capitalize hidden sm:inline">{day.day.condition.text}</span>
                  </div>

                  <div className="flex items-baseline gap-2 min-w-[70px] justify-end">
                    <span className="text-sm font-bold text-white">{maxT}°</span>
                    <span className="text-xs text-slate-400">{minT}°</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
