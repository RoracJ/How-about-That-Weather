import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import HistoryService from '../../service/historyService';

// Define __filename and __dirname for ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
  private filePath = path.join(__dirname, 'searchHistory.json');

  public generateId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  async saveSearch(city: City): Promise<void> {
    try {
      const cities = await this.getCities();
      cities.push(city);
      await this.write(cities);
    } catch (error) {
      console.error('Error saving search:', (error as Error).message);
      throw error;
    }
  }

  async getCities(): Promise<City[]> {
    return await this.read();
  }

  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(this.filePath, 'utf-8');
      return JSON.parse(data) as City[];
    } catch (error: unknown) {
      if (error instanceof Error && (error as any).code === 'ENOENT') {
        return [];
      } else if (error instanceof Error) {
        console.error('Error reading the file:', error.message);
        throw error;
      } else {
        console.error('An unknown error occurred:', error);
        throw new Error('An unknown error occurred while reading the file.');
      }
    }
  }

  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(this.filePath, JSON.stringify(cities, null, 2));
    } catch (error) {
      console.error('Error writing to file:', (error as Error).message);
      throw error;
    }
  }
}

export default new HistoryService();
