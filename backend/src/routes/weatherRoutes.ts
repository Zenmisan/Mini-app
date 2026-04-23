import { Router } from 'express';
import { WeatherController } from '../controllers/weatherController';

const router = Router();

router.get('/weather', WeatherController.getWeather);

export default router;
