import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// Define __filename and __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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
    async getCities() {
        return await this.read();
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
}
export default new HistoryService();
