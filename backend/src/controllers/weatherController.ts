import { Request, Response } from 'express';
import { WeatherService } from '../services/weatherService';
import { SemanticMapper } from '../services/semanticMapper';

export class WeatherController {
  static async getWeather(req: Request, res: Response) {
    const city = req.query.city as string;

    if (!city) {
      return res.status(400).json({ error: 'City is required' });
    }

    try {
      const rawData = await WeatherService.getWeatherData(city);
      const semanticContext = SemanticMapper.transform(rawData);

      res.json({
        raw: rawData,
        semanticContext: semanticContext
      });
    } catch (error: any) {
      console.error('Weather fetching error:', error.message);
      res.status(500).json({ error: error.message || 'Failed to fetch weather data' });
    }
  }
}
