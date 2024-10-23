import { Router } from 'express';
const router = Router();
// Import services
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
    try {
        const { city } = req.body;
        if (!city || typeof city !== 'string') {
            return res.status(400).json({ message: 'City name is required and must be a string' });
        }
        const weatherData = await WeatherService.getWeatherByCity(city);
        if (!weatherData) {
            return res.status(404).json({ message: 'Weather data not found for the city' });
        }
        const cityObj = new HistoryService.City(HistoryService.generateId(), city);
        await HistoryService.saveSearch(cityObj);
        return res.status(200).json(weatherData);
    }
    catch (error) {
        console.error('Error fetching weather data:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
// GET search history
router.get('/history', async (_req, res) => {
    try {
        const history = await HistoryService.getHistory();
        return res.status(200).json(history);
    }
    catch (error) {
        console.error('Error retrieving search history:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
// DELETE city from search history
router.delete('/history/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await HistoryService.deleteSearchById(id);
        if (!deleted) {
            return res.status(404).json({ message: 'City not found in history' });
        }
        return res.status(200).json({ message: 'City deleted from history' });
    }
    catch (error) {
        console.error('Error deleting city from history:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
export default router; // Export the router as the default export
