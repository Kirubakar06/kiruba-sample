import React, { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { SplashScreen } from './components/common/SplashScreen';
import { WeatherBackground } from './components/weather/Background/WeatherBackground';
import { Home } from './pages/Home';
import { Forecast } from './pages/Forecast';
import { Details } from './pages/Details';
import { Settings } from './pages/Settings';
import { useWeatherStore } from './store/useWeatherStore';
import { fetchWeatherForecast } from './services/api/weatherApi';
import { FiHome, FiCloudRain, FiMap, FiSettings, FiHeart } from 'react-icons/fi';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const AppContent: React.FC = () => {
  const [splashComplete, setSplashComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'forecast' | 'details' | 'settings'>('home');
  const { activeCity, setActiveCity, favorites } = useWeatherStore();

  // Fetch forecast simply to drive background state based on conditions
  const { data } = useQuery({
    queryKey: ['weatherForecast', activeCity],
    queryFn: () => fetchWeatherForecast(activeCity),
  });

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'forecast':
        return <Forecast />;
      case 'details':
        return <Details />;
      case 'settings':
        return <Settings />;
    }
  };

  const conditionCode = data?.current?.condition?.code || 1000;
  const isDay = data?.current?.is_day ?? 1;

  return (
    <div className="relative min-h-screen flex flex-col z-0">
      {/* Dynamic Background matching weather conditions */}
      {splashComplete && (
        <WeatherBackground conditionCode={conditionCode} isDay={isDay} countryName={data?.location?.country || ''} />
      )}

      {/* Splash screen */}
      {!splashComplete && (
        <SplashScreen onComplete={() => setSplashComplete(true)} />
      )}

      {splashComplete && (
        <div className="flex-1 flex flex-col md:flex-row w-full max-w-5xl mx-auto px-4 md:px-6 py-6 md:py-10 gap-6">
          {/* Left Desktop Sidebar / Mobile Top Header */}
          <aside className="w-full md:w-64 flex-shrink-0 flex flex-col gap-5">
            {/* Logo area */}
            <div className="glass-panel rounded-2xl p-4 flex items-center justify-between border border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center shadow-md shadow-sky-500/20">
                  <span className="text-white font-bold text-base">S</span>
                </div>
                <div>
                  <h1 className="text-md font-bold text-white tracking-tight leading-none">SkyCast</h1>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Weather telemetry</span>
                </div>
              </div>
            </div>

            {/* Favorite cities sidebar navigation */}
            <div className="hidden md:flex flex-col gap-2.5 glass-panel rounded-2xl p-4 border border-white/10">
              <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                <FiHeart className="text-rose-400" /> Favorites
              </h3>
              {favorites.length === 0 ? (
                <span className="text-[11px] text-slate-400">No favorite cities saved</span>
              ) : (
                <div className="flex flex-col gap-1">
                  {favorites.slice(0, 5).map((city, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveCity(city)}
                      className={`text-left text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all ${
                        activeCity.toLowerCase() === city.toLowerCase()
                          ? 'bg-white/10 text-white'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation links - Desktop */}
            <nav className="hidden md:flex flex-col gap-1 glass-panel rounded-2xl p-2.5 border border-white/10">
              <button
                onClick={() => setActiveTab('home')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'home' 
                    ? 'bg-white/10 text-white border-l-2 border-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <FiHome size={16} /> Home
              </button>
              <button
                onClick={() => setActiveTab('forecast')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'forecast' 
                    ? 'bg-white/10 text-white border-l-2 border-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <FiCloudRain size={16} /> Forecast
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'details' 
                    ? 'bg-white/10 text-white border-l-2 border-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <FiMap size={16} /> Details & Map
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'settings' 
                    ? 'bg-white/10 text-white border-l-2 border-indigo-400 shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white border-l-2 border-transparent'
                }`}
              >
                <FiSettings size={16} /> Settings
              </button>
            </nav>
          </aside>

          {/* Main View Area */}
          <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
            {renderActivePage()}
          </main>

          {/* Mobile Bottom Navigation Bar */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/80 backdrop-blur-lg border-t border-white/5 py-2 px-6 flex justify-between items-center">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                activeTab === 'home' ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              <FiHome size={20} />
              <span className="text-[10px] font-semibold">Home</span>
            </button>
            <button
              onClick={() => setActiveTab('forecast')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                activeTab === 'forecast' ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              <FiCloudRain size={20} />
              <span className="text-[10px] font-semibold">Forecast</span>
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                activeTab === 'details' ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              <FiMap size={20} />
              <span className="text-[10px] font-semibold">Radar</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                activeTab === 'settings' ? 'text-indigo-400' : 'text-slate-400'
              }`}
            >
              <FiSettings size={20} />
              <span className="text-[10px] font-semibold">Settings</span>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
