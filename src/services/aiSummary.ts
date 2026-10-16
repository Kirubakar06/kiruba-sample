import type { ForecastData } from '../types/weather';

export const generateAISummary = (data: ForecastData): string => {
  const current = data.current;
  const temp = current.temp_c;
  const desc = current.condition.text.toLowerCase();
  const humidity = current.humidity;
  const wind = current.wind_kph;
  const uv = current.uv;
  const isRainy = desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower');
  const isSnowy = desc.includes('snow') || desc.includes('sleet') || desc.includes('ice');
  const isStormy = desc.includes('thunder') || desc.includes('storm');

  let intro = `Today in ${data.location.name}, the weather is ${desc} with a temperature of ${temp}°C.`;
  let windAdvice = wind > 25 ? ' Expect gusty winds, so secure loose items outdoors.' : ' Winds are light, making it feel very pleasant.';
  let uvAdvice = uv >= 6 ? ' The UV index is high today, so wearing sun protection is strongly recommended.' : ' The UV index is low, requiring minimal sun precautions.';
  let humidityAdvice = humidity > 80 ? ' Humidity is high, which may cause a slightly sticky or heavy air feel.' : ' Humidity is at a comfortable level.';

  let recommendation = '';
  if (isStormy) {
    recommendation = ' Due to active lightning and thunderstorms, it is best to remain indoors and keep sensitive electronic devices unplugged.';
  } else if (isRainy) {
    recommendation = ' Make sure to take an umbrella or rain jacket with you. Excellent day for visiting museums, reading, or cozy indoor activities.';
  } else if (isSnowy) {
    recommendation = ' Snowy conditions are present. Roads might be slippery, so travel with caution. Perfect day for hot cocoa or winter sports!';
  } else if (temp > 28) {
    recommendation = ' The weather is hot! Perfect for heading to the beach, swimming, or staying hydrated in air-conditioned spaces.';
  } else if (temp > 16 && temp <= 28 && !isRainy) {
    recommendation = ' Outstanding conditions for outdoor activities like walking, jogging, cycling, or having a picnic in the park.';
  } else {
    recommendation = ' It is on the cooler side. We recommend layering up if you plan to head outside.';
  }

  return `${intro}${windAdvice}${humidityAdvice}${uvAdvice}${recommendation}`;
};
