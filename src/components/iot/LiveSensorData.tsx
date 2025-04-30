import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';

const LiveSensorData = () => {
  const [airQuality, setAirQuality] = useState<number>(0);

  useEffect(() => {
    const fetchAirQuality = async () => {
      const { data } = await supabase
        .from('sensor_data')
        .select('air_quality')
        .order('timestamp', { ascending: false })
        .limit(1);
      
      if (data && data.length > 0) {
        setAirQuality(data[0].air_quality);
      }
    };

    fetchAirQuality();
    const interval = setInterval(fetchAirQuality, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const calculateAirQuality = (value: number) => {
    return Math.min(Math.max(value, 0), 100);
  };

  return (
    <div>
      <h2 className="text-lg font-semibold">Live Air Quality Data</h2>
      <Progress 
        value={calculateAirQuality(airQuality)} 
        className="h-2"
      />
    </div>
  );
};

export default LiveSensorData;
