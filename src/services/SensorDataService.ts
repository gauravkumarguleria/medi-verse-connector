
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
  airQualityPercentage: number; // Added air quality percentage
  glucose: number;
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
  
  // Calculate air quality percentage based on MQ135 reading
  // MQ135 normally ranges from 0-5000ppm, with lower values indicating better air quality
  calculateAirQualityPercentage: (mq135Value: number): number => {
    // Define thresholds based on MQ135 standards
    // These thresholds can be adjusted based on specific requirements
    const excellentQuality = 500;   // Excellent air quality threshold (ppm)
    const poorQuality = 3500;       // Poor air quality threshold (ppm)
    
    // Invert the scale since lower MQ135 values mean better air quality
    // Calculate percentage where 100% = excellent air quality, 0% = poor air quality
    let percentage = 100 - (((mq135Value - excellentQuality) / (poorQuality - excellentQuality)) * 100);
    
    // Clamp the percentage between 0 and 100
    percentage = Math.max(0, Math.min(100, percentage));
    
    return Number(percentage.toFixed(1));
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
        airQualityPercentage: 0, // Initialize air quality percentage with 0
        glucose: 0,
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
    
    // Calculate average glucose as the average of mq3_1 and mq3_2
    const avgMq3_1 = Number((sum.mq3_1 / count).toFixed(2));
    const avgMq3_2 = Number((sum.mq3_2 / count).toFixed(2));
    const glucose = Number(((avgMq3_1 + avgMq3_2) / 2).toFixed(2));
    const avgMq135 = Number((sum.mq135 / count).toFixed(2));
    
    // Calculate air quality percentage based on average MQ135 value
    const airQualityPercentage = SensorDataService.calculateAirQualityPercentage(avgMq135);
    
    return {
      temperature: Number((sum.temperature / count).toFixed(2)),
      humidity: Number((sum.humidity / count).toFixed(2)),
      mq3_1: avgMq3_1,
      mq3_2: avgMq3_2,
      mq135: avgMq135,
      airQualityPercentage: airQualityPercentage, // Add air quality percentage
      glucose: glucose,
      timestamp: new Date().toISOString()
    };
  },
  
  // Get time series data for charts
  getTimeSeriesData: (readings: SensorReading[]): any[] => {
    console.log('Generating time series data from', readings.length, 'readings');
    
    // Reverse to get chronological order
    const orderedReadings = [...readings].reverse();
    
    return orderedReadings.map(reading => {
      // Calculate glucose as average of mq3_1 and mq3_2
      const glucose = (reading.mq3_1 + reading.mq3_2) / 2;
      // Calculate air quality percentage for this reading
      const airQualityPercentage = SensorDataService.calculateAirQualityPercentage(reading.mq135);
      
      return {
        time: new Date(reading.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: reading.temperature,
        humidity: reading.humidity,
        mq3_1: reading.mq3_1,
        mq3_2: reading.mq3_2,
        glucose: glucose,
        mq135: reading.mq135,
        airQualityPercentage: airQualityPercentage // Add air quality percentage to time series data
      };
    });
  }
};

export default SensorDataService;
