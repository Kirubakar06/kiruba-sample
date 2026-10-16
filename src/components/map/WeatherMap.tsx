import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix leaflet icon assets loading in standard bundle environments
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface WeatherMapProps {
  lat: number;
  lon: number;
  cityName: string;
  temp: number;
  condition: string;
}

// Controller component to smoothly pan map view when coordinates change
const MapRecenter: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 9, { animate: true, duration: 1.5 });
  }, [lat, lon, map]);
  return null;
};

export const WeatherMap: React.FC<WeatherMapProps> = ({ lat, lon, cityName, temp, condition }) => {
  return (
    <div className="glass-card rounded-2xl p-4 flex flex-col h-[340px] relative overflow-hidden">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium text-white/90">Interactive Weather Map</h3>
        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Live Radar
        </span>
      </div>

      <div className="flex-1 rounded-xl overflow-hidden z-10">
        <MapContainer
          center={[lat, lon]}
          zoom={9}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[lat, lon]}>
            <Popup>
              <div className="text-slate-900 font-sans p-1">
                <p className="font-bold text-sm">{cityName}</p>
                <p className="text-xs font-semibold">{temp}°C • {condition}</p>
              </div>
            </Popup>
          </Marker>
          <MapRecenter lat={lat} lon={lon} />
        </MapContainer>
      </div>
    </div>
  );
};
