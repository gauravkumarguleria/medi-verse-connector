import { IoTReport, IoTDevice, SystemAdjustment } from '../types/iotReports';
import { supabase } from '@/integrations/supabase/client';

// Mock data for IoT reports
const mockIoTReports: IoTReport[] = [
  {
    id: '1',
    deviceId: 'dev-001',
    deviceName: 'Health Monitor',
    reportType: 'health',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    readings: [
      { type: 'heart_rate', value: 78, unit: 'bpm', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { type: 'blood_pressure', value: 124, unit: 'mmHg', timestamp: new Date(Date.now() - 86400000).toISOString() },
      { type: 'oxygen', value: 98, unit: '%', timestamp: new Date(Date.now() - 86400000).toISOString() }
    ],
    status: 'processed',
    syncedToCloud: true
  },
  {
    id: '2',
    deviceId: 'dev-002',
    deviceName: 'Sleep Tracker',
    reportType: 'sleep',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    readings: [
      { type: 'sleep_duration', value: 7.5, unit: 'hours', timestamp: new Date(Date.now() - 172800000).toISOString(), normalRange: { min: 7, max: 9 } },
      { type: 'deep_sleep', value: 2.5, unit: 'hours', timestamp: new Date(Date.now() - 172800000).toISOString() },
      { type: 'rem_sleep', value: 1.8, unit: 'hours', timestamp: new Date(Date.now() - 172800000).toISOString() }
    ],
    status: 'processed',
    syncedToCloud: true
  },
  {
    id: '3',
    deviceId: 'dev-003',
    deviceName: 'Medication Dispenser',
    reportType: 'medication',
    timestamp: new Date().toISOString(),
    readings: [
      { type: 'medication_taken', value: 1, unit: 'pill', timestamp: new Date().toISOString() },
      { type: 'medication_missed', value: 0, unit: 'pill', timestamp: new Date().toISOString() }
    ],
    status: 'processed',
    syncedToCloud: true
  },
  {
    id: '4',
    deviceId: 'dev-004',
    deviceName: 'Activity Tracker',
    reportType: 'activity',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    readings: [
      { type: 'steps', value: 8745, unit: 'steps', timestamp: new Date(Date.now() - 259200000).toISOString(), normalRange: { min: 7000, max: 10000 } },
      { type: 'distance', value: 6.2, unit: 'km', timestamp: new Date(Date.now() - 259200000).toISOString() },
      { type: 'calories', value: 534, unit: 'kcal', timestamp: new Date(Date.now() - 259200000).toISOString() }
    ],
    status: 'processed',
    syncedToCloud: true
  },
  {
    id: '5',
    deviceId: 'dev-005',
    deviceName: 'Environment Monitor',
    reportType: 'environment',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    readings: [
      { type: 'temperature', value: 22.5, unit: '°C', timestamp: new Date(Date.now() - 43200000).toISOString(), normalRange: { min: 18, max: 24 } },
      { type: 'humidity', value: 45, unit: '%', timestamp: new Date(Date.now() - 43200000).toISOString(), normalRange: { min: 30, max: 50 } },
      { type: 'air_quality', value: 87, unit: 'index', timestamp: new Date(Date.now() - 43200000).toISOString(), normalRange: { min: 80, max: 100 } }
    ],
    status: 'processed',
    syncedToCloud: true
  }
];

// Mock data for IoT devices
const mockIoTDevices: IoTDevice[] = [
  { id: 'dev-001', name: 'Health Monitor', type: 'Wearable', lastSynced: new Date(Date.now() - 3600000).toISOString(), status: 'online', batteryLevel: 85 },
  { id: 'dev-002', name: 'Sleep Tracker', type: 'Wearable', lastSynced: new Date(Date.now() - 28800000).toISOString(), status: 'online', batteryLevel: 72 },
  { id: 'dev-003', name: 'Medication Dispenser', type: 'Smart Home', lastSynced: new Date().toISOString(), status: 'online', batteryLevel: 94 },
  { id: 'dev-004', name: 'Activity Tracker', type: 'Wearable', lastSynced: new Date(Date.now() - 7200000).toISOString(), status: 'offline', batteryLevel: 15 },
  { id: 'dev-005', name: 'Environment Monitor', type: 'Smart Home', lastSynced: new Date(Date.now() - 1800000).toISOString(), status: 'online', batteryLevel: 67 }
];

// Mock data for system adjustments
const mockSystemAdjustments: SystemAdjustment[] = [
  { id: '1', reportId: '1', recommendationType: 'medication', recommendation: 'Increase daily medication dosage by 5mg', severity: 'medium', applied: false },
  { id: '2', reportId: '2', recommendationType: 'environment', recommendation: 'Adjust bedroom temperature to 20°C for better sleep', severity: 'low', applied: true, appliedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '3', reportId: '3', recommendationType: 'appointment', recommendation: 'Schedule follow-up appointment within next 2 weeks', severity: 'high', applied: false },
  { id: '4', reportId: '4', recommendationType: 'activity', recommendation: 'Increase daily step goal to 9000 steps', severity: 'low', applied: true, appliedAt: new Date(Date.now() - 172800000).toISOString() },
  { id: '5', reportId: '5', recommendationType: 'diet', recommendation: 'Increase daily water intake to 2L', severity: 'medium', applied: false }
];

// Mock device data for charts
const mockDeviceData = {
  heartRate: [
    { time: '00:00', value: 72 },
    { time: '04:00', value: 68 },
    { time: '08:00', value: 75 },
    { time: '12:00', value: 82 },
    { time: '16:00', value: 78 },
    { time: '20:00', value: 71 }
  ],
  temperature: [
    { time: '00:00', value: 36.5 },
    { time: '04:00', value: 36.3 },
    { time: '08:00', value: 36.7 },
    { time: '12:00', value: 37.0 },
    { time: '16:00', value: 36.8 },
    { time: '20:00', value: 36.6 }
  ],
  activityLevel: [
    { time: '00:00', value: 10 },
    { time: '04:00', value: 5 },
    { time: '08:00', value: 45 },
    { time: '12:00', value: 65 },
    { time: '16:00', value: 80 },
    { time: '20:00', value: 30 }
  ],
  batteryLevel: [
    { time: '00:00', value: 90 },
    { time: '04:00', value: 85 },
    { time: '08:00', value: 78 },
    { time: '12:00', value: 72 },
    { time: '16:00', value: 65 },
    { time: '20:00', value: 60 }
  ],
};

export const IoTService = {
  // Get all reports
  getReports: async (): Promise<IoTReport[]> => {
    // In a real app, this would fetch from an API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockIoTReports);
      }, 800);
    });
  },

  // Get report by id
  getReportById: async (id: string): Promise<IoTReport | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = mockIoTReports.find(r => r.id === id);
        resolve(report);
      }, 500);
    });
  },

  // Get all devices
  getDevices: async (): Promise<IoTDevice[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockIoTDevices);
      }, 800);
    });
  },

  // Get system adjustments
  getSystemAdjustments: async (): Promise<SystemAdjustment[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSystemAdjustments);
      }, 800);
    });
  },

  // Apply a system adjustment
  applySystemAdjustment: async (id: string): Promise<SystemAdjustment> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const adjustment = mockSystemAdjustments.find(a => a.id === id);
        if (adjustment) {
          adjustment.applied = true;
          adjustment.appliedAt = new Date().toISOString();
        }
        resolve(adjustment || mockSystemAdjustments[0]);
      }, 800);
    });
  },

  // Download report
  downloadReport: async (reportId: string): Promise<Blob> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const report = mockIoTReports.find(r => r.id === reportId);
        const reportJson = JSON.stringify(report, null, 2);
        const blob = new Blob([reportJson], { type: 'application/json' });
        resolve(blob);
      }, 800);
    });
  },

  // Fetch device data for charts
  fetchDeviceData: async (deviceId: string, metricType: string, timeRange: string): Promise<any[]> => {
    console.log(`Fetching ${metricType} data for device ${deviceId} over ${timeRange}`);
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Return mock data based on metric type
        resolve(mockDeviceData[metricType as keyof typeof mockDeviceData] || []);
      }, 800);
    });
  },

  // Fetch list of devices
  fetchDeviceList: async (): Promise<any[]> => {
    console.log('Fetching device list');
    // Return the mock devices
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockIoTDevices);
      }, 800);
    });
  },

  // Enable realtime subscriptions for a table
  enableRealtimeForTable: async (tableName: string): Promise<void> => {
    try {
      // Add the table to the realtime publication
      const { error } = await supabase.rpc('enable_realtime_for_table', {
        table_name: tableName
      });

      if (error) {
        console.error('Error enabling realtime for table:', error);
        throw error;
      }

      console.log(`Realtime enabled for table: ${tableName}`);
    } catch (err) {
      console.error('Error in enableRealtimeForTable:', err);
    }
  }
};

export default IoTService;
