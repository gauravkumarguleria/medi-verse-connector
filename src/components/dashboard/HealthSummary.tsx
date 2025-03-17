
import React from 'react';
import { TrendingUp, TrendingDown, Minus, Shield, ShieldOff, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Mock health insights data
const healthInsights = [
  {
    id: '1',
    title: 'Overall Health Score',
    value: 85,
    unit: '/100',
    trend: 'up',
    description: 'Your health score has improved by 3 points in the last month.'
  },
  {
    id: '2',
    title: 'Sleep Quality',
    value: 72,
    unit: '%',
    trend: 'down',
    description: 'Your sleep quality has decreased by 5% from last week.'
  },
  {
    id: '3',
    title: 'Activity Level',
    value: 'Moderate',
    trend: 'stable',
    description: 'Your activity level has remained consistent this month.'
  },
  {
    id: '4',
    title: 'Risk Factors',
    value: 'Low',
    riskLevel: 'low',
    description: 'Based on your metrics, you have a low risk for chronic conditions.'
  }
];

const HealthSummary = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Health Insights</CardTitle>
        <CardDescription>Summary of your health status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthInsights.map((insight) => (
            <div key={insight.id} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center">
                  {insight.title}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-3 w-3 ml-1 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{insight.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </span>
                {insight.trend && (
                  <span className={`flex items-center text-xs ${
                    insight.trend === 'up' ? 'text-green-500 dark:text-green-400' : 
                    insight.trend === 'down' ? 'text-red-500 dark:text-red-400' : 
                    'text-muted-foreground'
                  }`}>
                    {insight.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                     insight.trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : 
                     <Minus className="h-3 w-3 mr-1" />}
                  </span>
                )}
                {insight.riskLevel && (
                  <span className={`flex items-center text-xs ${
                    insight.riskLevel === 'low' ? 'text-green-500 dark:text-green-400' : 
                    insight.riskLevel === 'moderate' ? 'text-yellow-500 dark:text-yellow-400' : 
                    'text-red-500 dark:text-red-400'
                  }`}>
                    {insight.riskLevel === 'low' ? <Shield className="h-3 w-3 mr-1" /> : 
                     <ShieldOff className="h-3 w-3 mr-1" />}
                  </span>
                )}
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-semibold">{insight.value}</span>
                {insight.unit && (
                  <span className="text-sm text-muted-foreground ml-1">{insight.unit}</span>
                )}
              </div>
              {insight.trend && (
                <div className={`h-1 rounded-full w-full ${
                  insight.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' : 
                  insight.trend === 'down' ? 'bg-red-100 dark:bg-red-900/30' : 
                  'bg-gray-100 dark:bg-gray-800'
                }`}>
                  <div 
                    className={`h-1 rounded-full ${
                      insight.trend === 'up' ? 'bg-green-500' : 
                      insight.trend === 'down' ? 'bg-red-500' : 
                      'bg-gray-400'
                    }`} 
                    style={{ width: typeof insight.value === 'number' ? `${insight.value}%` : '70%' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthSummary;
