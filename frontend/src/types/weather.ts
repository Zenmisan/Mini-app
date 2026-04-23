export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
}

export interface SemanticContext {
  summary: string;
  current_detailed: {
    temperature_description: string;
    humidity_description: string;
    wind_description: string;
    condition_description: string;
  };
  forecast_summary: string;
}

export interface WeatherResponse {
  raw: WeatherData;
  semanticContext: SemanticContext;
}
