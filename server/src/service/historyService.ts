import { promises as fs } from 'fs';
import path from 'path';

// Define the City class directly here
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

  async getHistory(): Promise<City[]> {
    try {
      return await this.getCities();
    } catch (error) {
      console.error('Error retrieving history:', (error as Error).message);
      throw error;
    }
  }

  async deleteSearchById(id: string): Promise<boolean> {
    try {
      const cities = await this.getCities();
      const updatedCities = cities.filter(city => city.id !== id);

      if (cities.length === updatedCities.length) {
        return false; // No city was removed
      }

      await this.write(updatedCities);
      return true;
    } catch (error) {
      console.error('Error deleting search by ID:', (error as Error).message);
      throw error;
    }
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

  async getCities(): Promise<City[]> {
    return await this.read();
  }

  async addCity(cityName: string): Promise<void> {
    try {
      const cities = await this.getCities();
      const newCity = new City(this.generateId(), cityName);
      cities.push(newCity);
      await this.write(cities);
    } catch (error) {
      console.error('Error adding city:', (error as Error).message);
      throw error;
    }
  }

  async removeCity(id: string): Promise<void> {
    try {
      const cities = await this.getCities();
      const updatedCities = cities.filter(city => city.id !== id);
      await this.write(updatedCities);
    } catch (error) {
      console.error('Error removing city:', (error as Error).message);
      throw error;
    }
  }
}

export default new HistoryService();
