
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { format } from 'date-fns';
import { Activity, Download, RefreshCcw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SensorDataService, SensorReading, AverageSensorData } from '@/services/SensorDataService';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface IoTDevicesPageProps {
  hideLayout?: boolean;
}

const IoTDevicesPage: React.FC<IoTDevicesPageProps> = ({ hideLayout }) => {
  const [sensorData, setSensorData] = useState<SensorReading[]>([]);
  const [averageData, setAverageData] = useState<AverageSensorData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');

  const fetchSensorData = async () => {
    setRefreshing(true);
    try {
      // Fetch the latest 20 readings
      const readings = await SensorDataService.getLatestReadings(20);
      setSensorData(readings);
      
      // Calculate average from the readings
      const avgData = SensorDataService.calculateAverageReadings(readings);
      setAverageData(avgData);
      
      // Generate time series data for charts
      const timeData = SensorDataService.getTimeSeriesData(readings);
      setChartData(timeData);
      
      toast.success('Sensor data refreshed successfully');
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      toast.error('Failed to fetch sensor data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    
    // Enable realtime updates for sensor_data table
    SensorDataService.enableRealtimeForTable('sensor_data');
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('sensor-updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sensor_data',
        },
        (payload) => {
          console.log('New sensor data received:', payload);
          // Refresh data when a new reading is inserted
          fetchSensorData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const exportToCSV = () => {
    try {
      // Convert sensor data to CSV format
      const headers = ['Timestamp', 'Temperature', 'Humidity', 'Glucose Reading', 'Air Quality'];
      
      const csvData = sensorData.map(reading => {
        const glucoseReading = ((reading.mq3_1 + reading.mq3_2) / 2).toFixed(2);
        const formattedTime = format(new Date(reading.timestamp), 'yyyy-MM-dd HH:mm:ss');
        return [
          formattedTime,
          reading.temperature,
          reading.humidity,
          glucoseReading,
          reading.mq135
        ];
      });
      
      // Convert each row to string and join with newline
      const csvContent = [
        headers.join(','), 
        ...csvData.map(row => row.map(item => String(item)).join(','))
      ].join('\n');
      
      // Create a Blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `sensor-data-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV file exported successfully');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">IoT Health Monitoring System</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={fetchSensorData} disabled={refreshing}>
            {refreshing ? <Spinner size="sm" className="mr-2" /> : <RefreshCcw size={16} className="mr-2" />}
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <Spinner size="lg" />
          <span className="ml-2">Loading sensor data...</span>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
            <TabsTrigger value="data">Raw Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {averageData && (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{averageData.temperature}°C</div>
                      <p className="text-xs text-muted-foreground mt-1">Average over last 20 readings</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Humidity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{averageData.humidity}%</div>
                      <p className="text-xs text-muted-foreground mt-1">Average over last 20 readings</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Glucose Reading</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{((averageData.mq3_1 + averageData.mq3_2) / 2).toFixed(2)}</div>
                      <p className="text-xs text-muted-foreground mt-1">MQ3 sensors average</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Air Quality</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{averageData.mq135}</div>
                      <p className="text-xs text-muted-foreground mt-1">MQ135 sensor reading</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                      <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="glucose" stroke="#ff7300" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Temperature & Humidity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                      <Line type="monotone" dataKey="humidity" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Glucose Readings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="glucose" 
                        stroke="#ff7300" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Air Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="airQuality" 
                        stroke="#FF4500" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableCaption>Last 20 sensor readings</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Temperature (°C)</TableHead>
                      <TableHead>Humidity (%)</TableHead>
                      <TableHead>Glucose Reading</TableHead>
                      <TableHead>Air Quality</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sensorData.map((reading) => (
                      <TableRow key={reading.id}>
                        <TableCell>{format(new Date(reading.timestamp), 'HH:mm:ss - dd MMM')}</TableCell>
                        <TableCell>{reading.temperature}</TableCell>
                        <TableCell>{reading.humidity}</TableCell>
                        <TableCell>{((reading.mq3_1 + reading.mq3_2) / 2).toFixed(2)}</TableCell>
                        <TableCell>{reading.mq135}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default IoTDevicesPage;
