import { promises as fs } from 'fs';
import path from 'path';
// Define the City class directly here
class City {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
class HistoryService {
    constructor() {
        this.filePath = path.join(__dirname, 'searchHistory.json');
    }
    generateId() {
        return (Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15));
    }
    async saveSearch(city) {
        try {
            const cities = await this.getCities();
            cities.push(city);
            await this.write(cities);
        }
        catch (error) {
            console.error('Error saving search:', error.message);
            throw error;
        }
    }
    async getHistory() {
        try {
            return await this.getCities();
        }
        catch (error) {
            console.error('Error retrieving history:', error.message);
            throw error;
        }
    }
    async deleteSearchById(id) {
        try {
            const cities = await this.getCities();
            const updatedCities = cities.filter(city => city.id !== id);
            if (cities.length === updatedCities.length) {
                return false; // No city was removed
            }
            await this.write(updatedCities);
            return true;
        }
        catch (error) {
            console.error('Error deleting search by ID:', error.message);
            throw error;
        }
    }
    async read() {
        try {
            const data = await fs.readFile(this.filePath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            if (error instanceof Error && error.code === 'ENOENT') {
                return [];
            }
            else if (error instanceof Error) {
                console.error('Error reading the file:', error.message);
                throw error;
            }
            else {
                console.error('An unknown error occurred:', error);
                throw new Error('An unknown error occurred while reading the file.');
            }
        }
    }
    async write(cities) {
        try {
            await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
        }
        catch (error) {
            console.error('Error writing to file:', error.message);
            throw error;
        }
    }
    async getCities() {
        return await this.read();
    }
    async addCity(cityName) {
        try {
            const cities = await this.getCities();
            const newCity = new City(this.generateId(), cityName);
            cities.push(newCity);
            await this.write(cities);
        }
        catch (error) {
            console.error('Error adding city:', error.message);
            throw error;
        }
    }
    async removeCity(id) {
        try {
            const cities = await this.getCities();
            const updatedCities = cities.filter(city => city.id !== id);
            await this.write(updatedCities);
        }
        catch (error) {
            console.error('Error removing city:', error.message);
            throw error;
        }
    }
}
export default new HistoryService();
