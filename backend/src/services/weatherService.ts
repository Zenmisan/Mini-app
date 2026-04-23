import axios from 'axios';
import { WeatherData, ForecastDay } from '../types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

export const getWeatherCodeDescription = (code: number): string => {
  const codes: Record<number, string> = {
    0: 'Clear sky',
    1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    71: 'Slight snow fall', 73: 'Moderate snow fall', 75: 'Heavy snow fall',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    95: 'Thunderstorm',
  };
  return codes[code] || 'Unknown';
};

export class WeatherService {
  static async getCoordinates(city: string) {
    const response = await axios.get(GEOCODING_API, {
      params: { name: city, count: 1, language: 'en', format: 'json' }
    });
    
    if (!response.data.results || response.data.results.length === 0) {
      throw new Error('City not found');
    }
    
    const { latitude, longitude, name } = response.data.results[0];
    return { latitude, longitude, name };
  }

  static async getWeatherData(city: string): Promise<WeatherData> {
    const { latitude, longitude, name } = await this.getCoordinates(city);
    
    const response = await axios.get(WEATHER_API, {
      params: {
        latitude,
        longitude,
        current_weather: true,
        daily: 'weathercode,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
        hourly: 'relativehumidity_2m'
      }
    });

    const current = response.data.current_weather;
    const daily = response.data.daily;
    const hourly = response.data.hourly;

    const forecast: ForecastDay[] = daily.time.map((date: string, index: number) => ({
      date,
      maxTemp: daily.temperature_2m_max[index],
      minTemp: daily.temperature_2m_min[index],
      condition: getWeatherCodeDescription(daily.weathercode[index])
    }));

    return {
      city: name,
      temperature: current.temperature,
      condition: getWeatherCodeDescription(current.weathercode),
      humidity: hourly.relativehumidity_2m[0], // Simplified
      windSpeed: current.windspeed,
      forecast: forecast.slice(1, 6) // Next 5 days
    };
  }
}
