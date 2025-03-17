
export interface IoTReport {
  id: string;
  deviceId: string;
  deviceName: string;
  reportType: 'health' | 'medication' | 'activity' | 'sleep' | 'environment';
  timestamp: string;
  readings: IoTReading[];
  status: 'processed' | 'pending' | 'error';
  syncedToCloud: boolean;
}

export interface IoTReading {
  type: string;
  value: number;
  unit: string;
  timestamp: string;
  normalRange?: {
    min: number;
    max: number;
  };
}

export interface IoTDevice {
  id: string;
  name: string;
  type: string;
  lastSynced: string;
  status: 'online' | 'offline' | 'error';
  batteryLevel: number;
}

export interface SystemAdjustment {
  id: string;
  reportId: string;
  recommendationType: 'medication' | 'activity' | 'diet' | 'environment' | 'appointment';
  recommendation: string;
  severity: 'low' | 'medium' | 'high';
  applied: boolean;
  appliedAt?: string;
}

// Add the missing interfaces
export interface DeviceInfo {
  id: string;
  name: string;
  type: string;
  status: string;
  lastConnected?: string;
  batteryLevel: number;
}

export interface DeviceData {
  timestamp: string;
  heartRate: number;
  temperature: number;
  activityLevel: number;
  batteryLevel: number;
}
