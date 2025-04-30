
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Thermometer, Droplets, Activity, BarChart2, History, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import SensorDataService, { SensorReading, AverageSensorData } from '@/services/SensorDataService';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Configuration for the charts
const chartConfig = {
  temperature: { 
    label: 'Temperature',
    theme: { light: '#EF4444', dark: '#F87171' }
  },
  humidity: { 
    label: 'Humidity',
    theme: { light: '#0EA5E9', dark: '#38BDF8' }
  },
  glucose: { 
    label: 'Glucose',
    theme: { light: '#8B5CF6', dark: '#A78BFA' }
  },
  mq135: { 
    label: 'MQ135',
    theme: { light: '#F59E0B', dark: '#FBBF24' }
  }
};

const LiveSensorData: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>('temperature');
  const [timeRange, setTimeRange] = useState<string>('10m');
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [averageData, setAverageData] = useState<AverageSensorData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  
  const fetchData = async () => {
    try {
      const limit = timeRange === '10m' ? 10 : timeRange === '30m' ? 30 : timeRange === '1h' ? 60 : 10;
      const data = await SensorDataService.getLatestReadings(limit);
      setReadings(data);
      
      // Calculate average of the readings
      const average = SensorDataService.calculateAverageReadings(data);
      
      // Add glucose calculation as average of mq3_1 and mq3_2
      if (average) {
        average.glucose = (average.mq3_1 + average.mq3_2) / 2;
      }
      
      setAverageData(average);
      
      // Generate time series data for charts with glucose included
      const timeSeriesData = SensorDataService.getTimeSeriesData(data);
      
      // Add glucose calculation to each data point
      timeSeriesData.forEach(dataPoint => {
        dataPoint.glucose = (dataPoint.mq3_1 + dataPoint.mq3_2) / 2;
      });
      
      setChartData(timeSeriesData);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };
  
  // Set up real-time subscription
  useEffect(() => {
    fetchData();
    
    // Set up polling for updates
    const intervalId = setInterval(fetchData, refreshInterval * 1000);
    
    // Set up real-time subscription
    const channel = supabase
      .channel('sensor_data_changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'sensor_data' }, 
        (payload) => {
          console.log('New sensor data received:', payload);
          fetchData(); // Refresh data when new readings come in
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(channel);
    };
  }, [timeRange, refreshInterval]);
  
  const handleMetricChange = (value: string) => {
    setSelectedMetric(value);
  };
  
  const handleTimeRangeChange = (value: string) => {
    if (value) setTimeRange(value);
  };
  
  const handleRefreshIntervalChange = (value: string) => {
    setRefreshInterval(parseInt(value, 10));
  };
  
  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'temperature':
        return <Thermometer className="h-4 w-4" />;
      case 'humidity':
        return <Droplets className="h-4 w-4" />;
      case 'glucose':
        return <Activity className="h-4 w-4" />;
      case 'mq135':
        return <Activity className="h-4 w-4" />;
      default:
        return <BarChart2 className="h-4 w-4" />;
    }
  };
  
  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'temperature':
        return '°C';
      case 'humidity':
        return '%';
      case 'glucose':
        return 'mg/dL';
      default:
        return 'ppm';
    }
  };
  
  const formatMetricValue = (value: number, metric: string) => {
    if (metric === 'temperature') return `${value.toFixed(1)}°C`;
    if (metric === 'humidity') return `${value.toFixed(1)}%`;
    if (metric === 'glucose') return `${value.toFixed(1)} mg/dL`;
    return `${value.toFixed(2)} ppm`;
  };
  
  const handleDownloadCSV = () => {
    if (readings.length === 0) {
      toast({
        title: "No data available",
        description: "There is no sensor data to download",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsDownloading(true);
      
      // Create CSV header
      const csvHeader = "Timestamp,Temperature,Humidity,Glucose,MQ135\n";
      
      // Create CSV content
      const csvContent = readings.map(reading => {
        const glucose = (reading.mq3_1 + reading.mq3_2) / 2;
        return [
          new Date(reading.timestamp).toLocaleString(),
          reading.temperature.toFixed(2),
          reading.humidity.toFixed(2),
          glucose.toFixed(2),
          reading.mq135.toFixed(2)
        ].join(',');
      }).join('\n');
      
      // Combine header and content
      const csvData = csvHeader + csvContent;
      
      // Create Blob with CSV data
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Set link attributes
      link.setAttribute('href', url);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.setAttribute('download', `sensor-data-${timestamp}.csv`);
      
      // Append to body, trigger click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download complete",
        description: "Sensor data has been downloaded as CSV",
      });
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast({
        title: "Download failed",
        description: "Failed to download sensor data",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Live Sensor Monitoring</h2>
          <p className="text-muted-foreground">Real-time environmental health monitoring</p>
        </div>
        
        <Button 
          variant="outline"
          onClick={handleDownloadCSV}
          disabled={isDownloading || readings.length === 0}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          {isDownloading ? "Downloading..." : "Download CSV"}
        </Button>
      </div>
      
      {/* Controls for data view */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Monitoring Settings</CardTitle>
          <CardDescription>Configure how sensor data is displayed</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <Select value={selectedMetric} onValueChange={handleMetricChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select Metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="humidity">Humidity</SelectItem>
                <SelectItem value="glucose">Glucose</SelectItem>
                <SelectItem value="mq135">MQ135 (Air Quality)</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex gap-2 items-center">
              <History className="h-4 w-4 text-muted-foreground" />
              <ToggleGroup type="single" value={timeRange} onValueChange={handleTimeRangeChange}>
                <ToggleGroupItem value="10m" aria-label="10 Minutes">10m</ToggleGroupItem>
                <ToggleGroupItem value="30m" aria-label="30 Minutes">30m</ToggleGroupItem>
                <ToggleGroupItem value="1h" aria-label="1 Hour">1h</ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <Select value={refreshInterval.toString()} onValueChange={handleRefreshIntervalChange}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Refresh Interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">Refresh every 5s</SelectItem>
                <SelectItem value="10">Refresh every 10s</SelectItem>
                <SelectItem value="30">Refresh every 30s</SelectItem>
                <SelectItem value="60">Refresh every 1m</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Thermometer className="h-4 w-4" />
              Temperature
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageData ? `${averageData.temperature.toFixed(1)}°C` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average of last {readings.length} readings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              Humidity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageData ? `${averageData.humidity.toFixed(1)}%` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average of last {readings.length} readings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Glucose
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageData ? `${((averageData.mq3_1 + averageData.mq3_2) / 2).toFixed(1)} mg/dL` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average of last {readings.length} readings
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4" />
              MQ135 (Air Quality)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageData ? `${averageData.mq135.toFixed(2)}` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Average of last {readings.length} readings
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getMetricIcon(selectedMetric)}
            {chartConfig[selectedMetric as keyof typeof chartConfig]?.label || selectedMetric} Trend
          </CardTitle>
          <CardDescription>
            Historical readings over time ({timeRange})
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {chartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-full">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="time" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60} 
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey={selectedMetric} 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">No data available</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Latest Readings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Readings</CardTitle>
          <CardDescription>Raw sensor data from the most recent measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr className="text-left">
                    <th className="p-2 font-medium">Time</th>
                    <th className="p-2 font-medium">Temperature</th>
                    <th className="p-2 font-medium">Humidity</th>
                    <th className="p-2 font-medium">Glucose</th>
                    <th className="p-2 font-medium">MQ135</th>
                  </tr>
                </thead>
                <tbody>
                  {readings.length > 0 ? (
                    readings.map((reading) => (
                      <tr key={reading.id} className="border-t">
                        <td className="p-2">{new Date(reading.timestamp).toLocaleString()}</td>
                        <td className="p-2">{reading.temperature.toFixed(1)}°C</td>
                        <td className="p-2">{reading.humidity.toFixed(1)}%</td>
                        <td className="p-2">{((reading.mq3_1 + reading.mq3_2) / 2).toFixed(1)} mg/dL</td>
                        <td className="p-2">{reading.mq135.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-muted-foreground">
                        No readings available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LiveSensorData;
