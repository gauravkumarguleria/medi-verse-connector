import React, { useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { IoTService } from '@/services/IoTService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Heart, Activity, Thermometer, Wind, Battery, Clock, Smartphone, WifiIcon, Download, FileDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { DeviceData, DeviceInfo } from '@/types/iotReports';
import { supabase } from '@/integrations/supabase/client';
import SensorDataService from '@/services/SensorDataService';
import { Button } from '@/components/ui/button';
import { generateIoTReport } from '@/services/PDFService';
import { toast } from '@/hooks/use-toast';

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
        // Get the air quality percentage based on MQ135
        const airQualityPercentage = average.airQualityPercentage;
        
        setLatestData({
          heartRate: Math.round(average.temperature * 1.2), // Simulating heart rate based on temperature
          temperature: average.temperature,
          activityLevel: Math.round(average.humidity), // Using humidity as proxy for activity
          batteryLevel: 80, // Fixed value for battery
          glucoseLevel: Math.round(average.glucose * 10), // Scaling for display
          airQualityPercentage: airQualityPercentage // Add air quality percentage
        });
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  // Get air quality status based on percentage
  const getAirQualityStatus = (percentage: number): { label: string, color: string } => {
    if (percentage >= 80) {
      return { label: 'Excellent', color: 'bg-green-500' };
    } else if (percentage >= 60) {
      return { label: 'Good', color: 'bg-lime-500' };
    } else if (percentage >= 40) {
      return { label: 'Moderate', color: 'bg-yellow-500' };
    } else if (percentage >= 20) {
      return { label: 'Poor', color: 'bg-orange-500' };
    } else {
      return { label: 'Hazardous', color: 'bg-red-500' };
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

  const handleDownloadReport = async () => {
    if (!latestData) {
      toast({
        title: "No data available",
        description: "There is no data to generate a report",
        variant: "destructive"
      });
      return;
    }

    try {
      const dateStr = new Date().toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const filename = `health-metrics-report-${dateStr}.pdf`;
      const pdf = generateIoTReport(latestData, deviceData || [], selectedMetric, timeRange);
      
      pdf.save(filename);
      
      toast({
        title: "Report downloaded",
        description: `${filename} has been downloaded successfully`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download failed",
        description: "Failed to generate the PDF report",
        variant: "destructive"
      });
    }
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">IoT Health Monitoring</h1>
          <p className="text-muted-foreground">Monitor your health metrics from connected devices</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleDownloadReport}
          className="flex items-center gap-2"
        >
          <FileDown className="h-4 w-4" />
          Download Report
        </Button>
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
              Glucose Level
            </CardTitle>
            <CardDescription>Blood glucose monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {latestData ? `${latestData.glucoseLevel} mg/dL` : 'Loading...'}
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
              <Wind className="h-4 w-4" />
              Air Quality
            </CardTitle>
            <CardDescription>Environmental air quality</CardDescription>
          </CardHeader>
          <CardContent>
            {latestData ? (
              <>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-semibold">
                    {latestData.airQualityPercentage.toFixed(1)}%
                  </div>
                  <Badge className={`${getAirQualityStatus(latestData.airQualityPercentage).color} text-white`}>
                    {getAirQualityStatus(latestData.airQualityPercentage).label}
                  </Badge>
                </div>
                <Progress 
                  value={latestData.airQualityPercentage} 
                  className="mt-2"
                />
              </>
            ) : (
              <div className="text-2xl font-semibold">Loading...</div>
            )}
            <Separator className="my-2" />
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
                <SelectItem value="glucose">Glucose</SelectItem>
                <SelectItem value="airQuality">Air Quality</SelectItem>
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
