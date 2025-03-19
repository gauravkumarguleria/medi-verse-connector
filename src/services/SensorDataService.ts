
import { supabase } from '@/integrations/supabase/client';

export interface SensorReading {
  id: number;
  temperature: number;
  humidity: number;
  mq3_1: number;
  mq3_2: number;
  mq135: number;
  timestamp: string;
}

export interface AverageSensorData {
  temperature: number;
  humidity: number;
  mq3_1: number;
  mq3_2: number;
  mq135: number;
  timestamp: string;
}

export const SensorDataService = {
  // Fetch the latest sensor readings
  getLatestReadings: async (limit: number = 10): Promise<SensorReading[]> => {
    console.log('Fetching latest sensor readings, limit:', limit);
    
    const { data, error } = await supabase
      .from('sensor_data')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
    
    return data || [];
  },
  
  // Calculate average of last N readings
  calculateAverageReadings: (readings: SensorReading[]): AverageSensorData => {
    console.log('Calculating average of', readings.length, 'readings');
    
    if (!readings.length) {
      return {
        temperature: 0,
        humidity: 0,
        mq3_1: 0,
        mq3_2: 0,
        mq135: 0,
        timestamp: new Date().toISOString()
      };
    }
    
    const sum = readings.reduce(
      (acc, reading) => {
        return {
          temperature: acc.temperature + reading.temperature,
          humidity: acc.humidity + reading.humidity,
          mq3_1: acc.mq3_1 + reading.mq3_1,
          mq3_2: acc.mq3_2 + reading.mq3_2,
          mq135: acc.mq135 + reading.mq135,
        };
      },
      { temperature: 0, humidity: 0, mq3_1: 0, mq3_2: 0, mq135: 0 }
    );
    
    const count = readings.length;
    return {
      temperature: Number((sum.temperature / count).toFixed(2)),
      humidity: Number((sum.humidity / count).toFixed(2)),
      mq3_1: Number((sum.mq3_1 / count).toFixed(2)),
      mq3_2: Number((sum.mq3_2 / count).toFixed(2)),
      mq135: Number((sum.mq135 / count).toFixed(2)),
      timestamp: new Date().toISOString()
    };
  },
  
  // Get time series data for charts
  getTimeSeriesData: (readings: SensorReading[]): any[] => {
    console.log('Generating time series data from', readings.length, 'readings');
    
    // Reverse to get chronological order
    const orderedReadings = [...readings].reverse();
    
    return orderedReadings.map(reading => ({
      time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: reading.temperature,
      humidity: reading.humidity,
      mq3_1: reading.mq3_1,
      mq3_2: reading.mq3_2,
      mq135: reading.mq135
    }));
  }
};

export default SensorDataService;
