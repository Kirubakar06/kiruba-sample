import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';
import type { ForecastHour } from '../../types/weather';
import { useWeatherStore } from '../../store/useWeatherStore';

interface WeatherChartsProps {
  hourlyForecast: ForecastHour[];
}

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ hourlyForecast }) => {
  const [activeTab, setActiveTab] = useState<'temp' | 'rain' | 'wind' | 'humidity'>('temp');
  const unit = useWeatherStore((state) => state.unit);

  // Take next 12 hours for granular chart details
  const hourlyData = hourlyForecast.slice(0, 12).map((h) => {
    const timeStr = h.time.split(' ')[1]; // Get HH:MM
    return {
      time: timeStr,
      temp: unit === 'C' ? h.temp_c : h.temp_f,
      rain: h.chance_of_rain || h.chance_of_snow || 0,
      wind: h.wind_kph,
      humidity: h.humidity,
    };
  });

  const chartTabs = [
    { id: 'temp', label: `Temperature (${unit === 'C' ? '°C' : '°F'})`, color: '#f59e0b' },
    { id: 'rain', label: 'Rain Chance (%)', color: '#3b82f6' },
    { id: 'wind', label: 'Wind Speed (km/h)', color: '#10b981' },
    { id: 'humidity', label: 'Humidity (%)', color: '#8b5cf6' },
  ] as const;

  const getActiveChart = () => {
    switch (activeTab) {
      case 'temp':
        return (
          <AreaChart data={hourlyData}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
            <YAxis hide domain={['auto-2', 'auto+2']} />
            <Tooltip
              contentStyle={{ background: 'rgba(15, 23, 42, 0.85)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
            />
            <Area type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#tempGrad)" />
          </AreaChart>
        );
      case 'rain':
        return (
          <BarChart data={hourlyData}>
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: 'rgba(15, 23, 42, 0.85)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
            />
            <Bar dataKey="rain" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
          </BarChart>
        );
      case 'wind':
        return (
          <LineChart data={hourlyData}>
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip
              contentStyle={{ background: 'rgba(15, 23, 42, 0.85)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
            />
            <Line type="monotone" dataKey="wind" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        );
      case 'humidity':
        return (
          <AreaChart data={hourlyData}>
            <defs>
              <linearGradient id="humidityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: 'rgba(15, 23, 42, 0.85)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
            />
            <Area type="monotone" dataKey="humidity" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#humidityGrad)" />
          </AreaChart>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 flex flex-col h-[320px]">
      <h3 className="text-lg font-medium text-white/90 mb-4">Hourly Forecast Analytics</h3>
      
      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
        {chartTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              borderColor: activeTab === tab.id ? tab.color : 'transparent',
              color: activeTab === tab.id ? '#ffffff' : 'rgba(255,255,255,0.6)',
              backgroundColor: activeTab === tab.id ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)'
            }}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all whitespace-nowrap cursor-pointer hover:bg-white/5"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart Wrapper */}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {getActiveChart()}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
