import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();
// Define a class for the Weather object
class Weather {
    constructor(temperature, description, humidity, windSpeed) {
        this.temperature = temperature;
        this.description = description;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
    }
}
// Complete the WeatherService class
class WeatherService {
    // Constructor to check if API key is available
    constructor() {
        this.baseURL = 'https://api.openweathermap.org/data/2.5';
        this.apiKey = process.env.WEATHER_API_KEY;
        if (!this.apiKey) {
            throw new Error('API key is not defined in the environment variables.');
        }
    }
    async getWeatherByCity(city) {
        try {
            this.cityName = city;
            const coordinates = await this.fetchAndDestructureLocationData();
            const weatherData = await this.fetchWeatherData(coordinates);
            return this.parseCurrentWeather(weatherData);
        }
        catch (error) {
            console.error('Error fetching weather data:', error);
            return null;
        }
    }
    async fetchLocationData(query) {
        const geocodeQuery = this.buildGeocodeQuery(query);
        const response = await fetch(geocodeQuery);
        if (!response.ok)
            throw new Error('Error fetching location data');
        return await response.json();
    }
    destructureLocationData(locationData) {
        const { lat, lon } = locationData[0];
        return { lat, lon };
    }
    buildGeocodeQuery(query) {
        return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    }
    buildWeatherQuery(coordinates) {
        return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
    }
    async fetchAndDestructureLocationData() {
        if (!this.cityName)
            throw new Error('City name is not defined');
        const locationData = await this.fetchLocationData(this.cityName);
        if (!locationData || locationData.length === 0)
            throw new Error('Location data not found');
        return this.destructureLocationData(locationData);
    }
    async fetchWeatherData(coordinates) {
        const weatherQuery = this.buildWeatherQuery(coordinates);
        const response = await fetch(weatherQuery);
        if (!response.ok)
            throw new Error('Error fetching weather data');
        return await response.json();
    }
    parseCurrentWeather(response) {
        const temperature = response.main.temp;
        const description = response.weather[0].description;
        const humidity = response.main.humidity;
        const windSpeed = response.wind.speed;
        return new Weather(temperature, description, humidity, windSpeed);
    }
}
export default new WeatherService();
