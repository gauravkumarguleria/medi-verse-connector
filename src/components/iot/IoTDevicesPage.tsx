
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useQuery } from '@tanstack/react-query';
import { SensorDataService, SensorReading } from '@/services/SensorDataService';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Thermometer, Droplets, Activity, FileDown, RefreshCw, Clock, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import GlassCard from '@/components/ui/GlassCard';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { toast } from '@/hooks/use-toast';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

interface IoTDevicesPageProps {
  hideLayout?: boolean;
}

const IoTDevicesPage: React.FC<IoTDevicesPageProps> = ({ hideLayout = false }) => {
  const [timeRange, setTimeRange] = useState('1h');
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds default
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Function to fetch sensor data
  const fetchSensorData = async () => {
    setLastUpdated(new Date());
    try {
      const readings = await SensorDataService.getLatestReadings(100);
      return readings;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      toast({
        title: "Error fetching sensor data",
        description: "Could not retrieve the latest sensor readings",
        variant: "destructive",
      });
      return [];
    }
  };

  // Use React Query to fetch and cache data
  const { data: sensorReadings, isLoading, error, refetch } = useQuery({
    queryKey: ['sensorData'],
    queryFn: fetchSensorData,
    refetchInterval: refreshInterval,
  });

  // Enable realtime for sensor_data table when component mounts
  useEffect(() => {
    // Set up real-time subscription
    const channel = supabase
      .channel('sensor_data_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'sensor_data' }, 
        () => {
          console.log('New sensor data received, refreshing...');
          refetch();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  // Calculate averages and prepare chart data
  const chartData = React.useMemo(() => {
    if (!sensorReadings || sensorReadings.length === 0) return [];
    return SensorDataService.getTimeSeriesData(sensorReadings);
  }, [sensorReadings]);

  // Calculate latest metrics
  const latestMetrics = React.useMemo(() => {
    if (!sensorReadings || sensorReadings.length === 0) {
      return {
        temperature: 0,
        humidity: 0,
        glucose: 0,
        airQuality: 0,
        timestamp: new Date().toISOString(),
      };
    }

    const average = SensorDataService.calculateAverageReadings(sensorReadings.slice(0, 5));
    
    // Calculate glucose (average of mq3_1 and mq3_2)
    const glucose = (average.mq3_1 + average.mq3_2) / 2;
    
    return {
      temperature: average.temperature,
      humidity: average.humidity,
      glucose: Number(glucose.toFixed(2)),
      airQuality: average.mq135,
      timestamp: average.timestamp,
    };
  }, [sensorReadings]);

  const handleManualRefresh = () => {
    refetch();
    toast({
      title: "Refreshing data",
      description: "Fetching the latest sensor readings",
    });
  };
  
  const handleTimeRangeChange = (value: string) => {
    setTimeRange(value);
  };
  
  const handleRefreshRateChange = (value: string) => {
    setRefreshInterval(parseInt(value));
    toast({
      title: "Refresh rate updated",
      description: `Data will now refresh every ${parseInt(value) / 1000} seconds`,
    });
  };
  
  const handleMetricChange = (value: string) => {
    setSelectedMetric(value);
  };

  const handleDataExport = () => {
    if (!sensorReadings || sensorReadings.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no sensor data available for export",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert data to CSV
      const headers = ['Timestamp', 'Temperature', 'Humidity', 'Glucose (MQ3 Avg)', 'Air Quality (MQ135)'];
      const csvRows = [headers];
      
      sensorReadings.forEach((reading) => {
        const glucoseValue = (reading.mq3_1 + reading.mq3_2) / 2;
        const row = [
          new Date(reading.timestamp).toLocaleString(),
          reading.temperature,
          reading.humidity,
          glucoseValue.toFixed(2),
          reading.mq135
        ];
        csvRows.push(row);
      });
      
      // Create CSV content
      const csvContent = csvRows.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const link = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('href', url);
      link.setAttribute('download', `sensor-data-export-${date}.csv`);
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export successful",
        description: "Sensor data has been exported to CSV",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export failed",
        description: "Could not export sensor data",
        variant: "destructive",
      });
    }
  };
  
  // Temperature status calculation
  const getTemperatureStatus = (temp: number) => {
    if (temp < 20) return { label: "Cold", color: "blue" };
    if (temp > 30) return { label: "Hot", color: "red" };
    return { label: "Normal", color: "green" };
  };
  
  // Humidity status calculation
  const getHumidityStatus = (humidity: number) => {
    if (humidity < 30) return { label: "Dry", color: "orange" };
    if (humidity > 70) return { label: "Humid", color: "blue" };
    return { label: "Normal", color: "green" };
  };

  const tempStatus = getTemperatureStatus(latestMetrics.temperature);
  const humidityStatus = getHumidityStatus(latestMetrics.humidity);
  
  const content = (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Database className="h-6 w-6 text-medical-purple" />
            IoT Sensor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Real-time monitoring of environmental and health metrics
          </p>
        </div>
        <div className="flex flex-wrap gap-2 self-end sm:self-auto">
          <Select defaultValue={refreshInterval.toString()} onValueChange={handleRefreshRateChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Refresh Rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5000">Every 5s</SelectItem>
              <SelectItem value="15000">Every 15s</SelectItem>
              <SelectItem value="30000">Every 30s</SelectItem>
              <SelectItem value="60000">Every 1m</SelectItem>
              <SelectItem value="300000">Every 5m</SelectItem>
            </SelectContent>
          </Select>
          
          <AnimatedButton
            variant="outline"
            onClick={handleManualRefresh}
            className="flex items-center gap-2"
            shine
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </AnimatedButton>
          
          <AnimatedButton
            variant="outline"
            onClick={handleDataExport}
            className="flex items-center gap-2"
            shine
          >
            <FileDown className="h-4 w-4" />
            Export Data
          </AnimatedButton>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <GlassCard>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-red-500" />
                <span>Temperature</span>
              </div>
              <Badge style={{backgroundColor: `var(--medical-${tempStatus.color})`}}>
                {tempStatus.label}
              </Badge>
            </CardTitle>
            <CardDescription>Current ambient temperature</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latestMetrics.temperature.toFixed(1)}°C</div>
            <Separator className="my-2" />
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          </CardContent>
        </GlassCard>
        
        <GlassCard>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <span>Humidity</span>
              </div>
              <Badge style={{backgroundColor: `var(--medical-${humidityStatus.color})`}}>
                {humidityStatus.label}
              </Badge>
            </CardTitle>
            <CardDescription>Relative humidity level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latestMetrics.humidity.toFixed(1)}%</div>
            <Separator className="my-2" />
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          </CardContent>
        </GlassCard>
        
        <GlassCard>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-purple-500" />
              <span>Glucose Reading</span>
            </CardTitle>
            <CardDescription>Avg. MQ3 sensor values</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latestMetrics.glucose.toFixed(2)} ppm</div>
            <Separator className="my-2" />
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          </CardContent>
        </GlassCard>
        
        <GlassCard>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-amber-500" />
              <span>Air Quality</span>
            </CardTitle>
            <CardDescription>MQ135 air quality sensor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latestMetrics.airQuality.toFixed(2)} ppm</div>
            <Separator className="my-2" />
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              Updated {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          </CardContent>
        </GlassCard>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Sensor Data Visualization</CardTitle>
            <CardDescription className="flex justify-between items-center">
              <span>Historical sensor data readings</span>
              <div className="flex items-center gap-2">
                <Select defaultValue={selectedMetric} onValueChange={handleMetricChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temperature">Temperature</SelectItem>
                    <SelectItem value="humidity">Humidity</SelectItem>
                    <SelectItem value="glucose">Glucose</SelectItem>
                    <SelectItem value="airQuality">Air Quality</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select defaultValue={timeRange} onValueChange={handleTimeRangeChange}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 Hour</SelectItem>
                    <SelectItem value="4h">4 Hours</SelectItem>
                    <SelectItem value="12h">12 Hours</SelectItem>
                    <SelectItem value="24h">24 Hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] mt-4">
              <ChartContainer
                className="p-4"
                config={{
                  temperature: { theme: { light: "#ef4444", dark: "#ef4444" } },
                  humidity: { theme: { light: "#3b82f6", dark: "#3b82f6" } },
                  glucose: { theme: { light: "#8b5cf6", dark: "#8b5cf6" } },
                  airQuality: { theme: { light: "#f97316", dark: "#f97316" } },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="font-medium">{payload[0].payload.time}</div>
                                <div className="font-medium text-right">{payload[0].value}</div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke={
                        selectedMetric === "temperature" 
                          ? "var(--color-temperature)" 
                          : selectedMetric === "humidity"
                            ? "var(--color-humidity)"
                            : selectedMetric === "glucose"
                              ? "var(--color-glucose)"
                              : "var(--color-airQuality)"
                      }
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Sensor Readings</CardTitle>
            <CardDescription>Latest 10 records from sensor data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Temperature (°C)</TableHead>
                    <TableHead>Humidity (%)</TableHead>
                    <TableHead>Glucose (ppm)</TableHead>
                    <TableHead>Air Quality (ppm)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">Loading data...</TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-red-500">Error loading data</TableCell>
                    </TableRow>
                  ) : !sensorReadings || sensorReadings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">No sensor data available</TableCell>
                    </TableRow>
                  ) : (
                    sensorReadings.slice(0, 10).map((reading) => {
                      const glucose = (reading.mq3_1 + reading.mq3_2) / 2;
                      return (
                        <TableRow key={reading.id}>
                          <TableCell>
                            {new Date(reading.timestamp).toLocaleString()}
                          </TableCell>
                          <TableCell>{reading.temperature.toFixed(1)}</TableCell>
                          <TableCell>{reading.humidity.toFixed(1)}</TableCell>
                          <TableCell>{glucose.toFixed(2)}</TableCell>
                          <TableCell>{reading.mq135.toFixed(2)}</TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
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

export default IoTDevicesPage;
