import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WeatherStore } from '../types/weather';

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      unit: 'C',
      theme: 'auto',
      favorites: ['London', 'New York', 'Tokyo', 'Paris'],
      recentSearches: [],
      searchHistory: [],
      notificationsEnabled: true,
      activeCity: 'London',
      setActiveCity: (activeCity) => set({ activeCity }),
      setUnit: (unit) => set({ unit }),
      setTheme: (theme) => {
        set({ theme });
        // Handle theme changing side effect
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.classList.remove('light');
        } else if (theme === 'light') {
          document.documentElement.classList.add('light');
          document.documentElement.classList.remove('dark');
        } else {
          // auto theme
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (isDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      addFavorite: (city) =>
        set((state) => {
          if (state.favorites.includes(city)) return state;
          return { favorites: [...state.favorites, city] };
        }),
      removeFavorite: (city) =>
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.toLowerCase() !== city.toLowerCase()),
        })),
      addRecentSearch: (city) =>
        set((state) => {
          const filtered = state.recentSearches.filter((item) => item.toLowerCase() !== city.toLowerCase());
          return {
            recentSearches: [city, ...filtered].slice(0, 5),
            searchHistory: [city, ...state.searchHistory.filter(c => c !== city)].slice(0, 20)
          };
        }),
      clearRecentSearches: () => set({ recentSearches: [], searchHistory: [] }),
      toggleNotifications: () => set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
    }),
    {
      name: 'skycast-weather-settings',
    }
  )
);
