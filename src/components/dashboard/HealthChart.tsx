
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

// Mock health data with trends over time
const healthTrendsData = [
  { date: 'May 1', bloodPressure: 120, heartRate: 75, bloodGlucose: 95, weight: 70 },
  { date: 'May 7', bloodPressure: 118, heartRate: 72, bloodGlucose: 92, weight: 69.5 },
  { date: 'May 14', bloodPressure: 122, heartRate: 78, bloodGlucose: 97, weight: 69.8 },
  { date: 'May 21', bloodPressure: 119, heartRate: 73, bloodGlucose: 94, weight: 69.2 },
  { date: 'May 28', bloodPressure: 117, heartRate: 70, bloodGlucose: 90, weight: 68.7 },
  { date: 'Jun 4', bloodPressure: 116, heartRate: 68, bloodGlucose: 89, weight: 68.5 },
  { date: 'Jun 11', bloodPressure: 115, heartRate: 69, bloodGlucose: 88, weight: 68.2 },
];

// Chart configuration for different metrics - fixed to match ChartConfig type
const chartConfig = {
  bloodPressure: { 
    label: 'Blood Pressure',
    theme: { light: '#8B5CF6', dark: '#A78BFA' }
  },
  heartRate: { 
    label: 'Heart Rate',
    theme: { light: '#EF4444', dark: '#F87171' }
  },
  bloodGlucose: { 
    label: 'Blood Glucose',
    theme: { light: '#10B981', dark: '#34D399' }
  },
  weight: { 
    label: 'Weight',
    theme: { light: '#0EA5E9', dark: '#38BDF8' }
  }
};

interface HealthChartProps {
  activeMetric: string;
}

const HealthChart: React.FC<HealthChartProps> = ({ activeMetric }) => {
  const getYAxisDomain = (metric: string) => {
    switch (metric) {
      case 'bloodPressure':
        return [90, 150];
      case 'heartRate':
        return [50, 100];
      case 'bloodGlucose':
        return [70, 120];
      case 'weight':
        return [60, 80];
      default:
        return [0, 'auto'];
    }
  };

  // Fixed to always return a string as required by YAxis tickFormatter
  const formatYAxis = (value: number): string => {
    switch (activeMetric) {
      case 'bloodPressure':
        return `${value} mmHg`;
      case 'heartRate':
        return `${value} bpm`;
      case 'bloodGlucose':
        return `${value} mg/dL`;
      case 'weight':
        return `${value} kg`;
      default:
        return value.toString();
    }
  };

  const [min, max] = getYAxisDomain(activeMetric);
  
  // Helper function to get color based on metric
  const getMetricColor = (metric: string): string => {
    const colors = {
      bloodPressure: '#8B5CF6',
      heartRate: '#EF4444',
      bloodGlucose: '#10B981',
      weight: '#0EA5E9'
    };
    return colors[metric as keyof typeof colors] || '#8B5CF6';
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Health Trends</CardTitle>
        <CardDescription>
          Your {chartConfig[activeMetric as keyof typeof chartConfig]?.label} over time
        </CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ChartContainer 
          className="h-full" 
          config={chartConfig}
        >
          <LineChart data={healthTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[min, max]} tickFormatter={formatYAxis} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line
              type="monotone"
              dataKey={activeMetric}
              stroke={getMetricColor(activeMetric)}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default HealthChart;
