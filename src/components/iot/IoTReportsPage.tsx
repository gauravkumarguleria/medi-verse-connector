
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { IoTService } from '@/services/IoTService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Heart, Activity, Thermometer, AreaChart, Battery, Clock, Smartphone, WifiIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { DeviceData, DeviceInfo } from '@/types/iotReports';
import { supabase } from '@/integrations/supabase/client';
import SensorDataService from '@/services/SensorDataService';

interface IoTReportsPageProps {
  hideLayout?: boolean;
}

const IoTReportsPage: React.FC<IoTReportsPageProps> = ({ hideLayout = false }) => {
  const [selectedDeviceId, setSelectedDeviceId] = React.useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = React.useState('heartRate');
  const [timeRange, setTimeRange] = React.useState('1h');
  const [latestData, setLatestData] = React.useState<any>(null);

  // Enable realtime for sensor_data table when component mounts
  useEffect(() => {
    IoTService.enableRealtimeForTable('sensor_data').catch(console.error);
    
    // Initial fetch of sensor data
    fetchSensorData();
    
    // Set up polling for updates
    const intervalId = setInterval(fetchSensorData, 30 * 1000); // Refresh every 30 seconds
    
    // Set up real-time subscription
    const channel = supabase
      .channel('sensor_data_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'sensor_data' }, 
        () => {
          console.log('New sensor data received, refreshing...');
          fetchSensorData();
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchSensorData = async () => {
    try {
      const readings = await SensorDataService.getLatestReadings(10);
      if (readings.length > 0) {
        const average = SensorDataService.calculateAverageReadings(readings);
        setLatestData({
          heartRate: Math.round(average.temperature * 1.2), // Simulating heart rate based on temperature
          temperature: average.temperature,
          activityLevel: Math.round(average.humidity), // Using humidity as proxy for activity
          batteryLevel: 80 // Fixed value for battery
        });
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  const { data: deviceList, isLoading: isDeviceListLoading } = useQuery({
    queryKey: ['deviceList'],
    queryFn: IoTService.fetchDeviceList
  });

  const { data: deviceData, isLoading: isDeviceDataLoading } = useQuery({
    queryKey: ['deviceData', selectedDeviceId, selectedMetric, timeRange],
    queryFn: () => selectedDeviceId 
      ? IoTService.fetchDeviceData(selectedDeviceId, selectedMetric, timeRange) 
      : Promise.resolve([]),
    enabled: !!selectedDeviceId
  });

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
  };

  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
  };

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const chartData = deviceData || [
    { time: '00:00', value: 4000 },
    { time: '03:00', value: 3000 },
    { time: '06:00', value: 2000 },
    { time: '09:00', value: 2780 },
    { time: '12:00', value: 1890 },
    { time: '15:00', value: 2390 },
    { time: '18:00', value: 3490 },
    { time: '21:00', value: 3490 },
    { time: '24:00', value: 3490 },
  ];

  const content = (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">IoT Health Monitoring</h1>
        <p className="text-muted-foreground">Monitor your health metrics from connected devices</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Heart Rate
            </CardTitle>
            <CardDescription>Real-time heart rate data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {latestData ? `${latestData.heartRate} BPM` : 'Loading...'}
            </div>
            <Separator className="my-2" />
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              Updated just now
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Body Temperature
            </CardTitle>
            <CardDescription>Current body temperature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {latestData ? `${latestData.temperature.toFixed(1)}°C` : 'Loading...'}
            </div>
            <Separator className="my-2" />
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              Updated just now
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Activity Level
            </CardTitle>
            <CardDescription>Daily activity summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {latestData ? `${latestData.activityLevel}` : 'Loading...'}
            </div>
            <Separator className="my-2" />
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              Updated just now
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Battery className="h-4 w-4" />
              Battery Level
            </CardTitle>
            <CardDescription>Connected device battery status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {latestData ? `${latestData.batteryLevel}%` : 'Loading...'}
            </div>
            <Separator className="my-2" />
            <Progress value={latestData ? latestData.batteryLevel : 0} />
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" />
              Updated just now
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Health Metrics Over Time</CardTitle>
          <CardDescription>Track changes in your health metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Select onValueChange={handleDeviceChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Device" />
              </SelectTrigger>
              <SelectContent>
                {deviceList && deviceList.map((device: DeviceInfo) => (
                  <SelectItem key={device.id} value={device.id}>
                    <div className="flex items-center gap-2">
                      {device.type === 'smartphone' && <Smartphone className="h-4 w-4" />}
                      {device.type === 'wearable' && <Activity className="h-4 w-4" />}
                      {device.type === 'sensor' && <WifiIcon className="h-4 w-4" />}
                      {device.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={handleMetricChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="heartRate">Heart Rate</SelectItem>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="activityLevel">Activity Level</SelectItem>
                <SelectItem value="batteryLevel">Battery Level</SelectItem>
              </SelectContent>
            </Select>
            <ToggleGroup defaultValue={timeRange} onValueChange={handleTimeRangeChange} type="single">
              <ToggleGroupItem value="1h" aria-label="1 Hour">1H</ToggleGroupItem>
              <ToggleGroupItem value="12h" aria-label="12 Hours">12H</ToggleGroupItem>
              <ToggleGroupItem value="1d" aria-label="1 Day">1D</ToggleGroupItem>
              <ToggleGroupItem value="7d" aria-label="7 Days">7D</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );

  if (hideLayout) {
    return content;
  }

  return (
    <DashboardLayout>
      {content}
    </DashboardLayout>
  );
};

export default IoTReportsPage;
