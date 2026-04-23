import { WeatherData, SemanticContext } from '../types/weather';

export class SemanticMapper {
  static transform(data: WeatherData): SemanticContext {
    const { city, temperature, condition, humidity, windSpeed, forecast } = data;

    const summary = `Currently in ${city}, the weather is ${condition.toLowerCase()} with a temperature of ${temperature}°C.`;
    
    const current_detailed = {
      temperature_description: `The temperature is ${temperature} degrees Celsius, which feels ${this.getTempFeel(temperature)}.`,
      humidity_description: `Relative humidity is at ${humidity}%, indicating ${this.getHumidityFeel(humidity)} air.`,
      wind_description: `Winds are blowing at ${windSpeed} km/h, which is categorized as ${this.getWindScale(windSpeed)}.`,
      condition_description: `The sky condition is reported as ${condition}.`
    };

    const forecast_summary = forecast.map(day => {
      return `On ${day.date}, expect ${day.condition.toLowerCase()} with highs of ${day.maxTemp}°C and lows of ${day.minTemp}°C.`;
    }).join(' ');

    return {
      summary,
      current_detailed,
      forecast_summary
    };
  }

  private static getTempFeel(temp: number): string {
    if (temp < 0) return 'freezing';
    if (temp < 10) return 'cold';
    if (temp < 20) return 'cool';
    if (temp < 30) return 'warm';
    return 'hot';
  }

  private static getHumidityFeel(humidity: number): string {
    if (humidity < 30) return 'dry';
    if (humidity < 60) return 'comfortable';
    return 'humid';
  }

  private static getWindScale(speed: number): string {
    if (speed < 1) return 'calm';
    if (speed < 11) return 'a light breeze';
    if (speed < 28) return 'a moderate breeze';
    if (speed < 49) return 'strong winds';
    return 'gale force winds';
  }
}
