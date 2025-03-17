
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Server,
  Smartphone,
  Search,
  Filter,
  Plus,
  Settings,
  RefreshCw,
  Battery,
  ArrowDownToLine,
  PackageCheck,
  AlarmCheck,
  Clock,
  Activity,
  LineChart,
  ThermometerSnowflake,
  Upload
} from 'lucide-react';
import { IoTReport, IoTDevice, SystemAdjustment } from '../../types/iotReports';
import { IoTService } from '../../services/IoTService';

const IoTReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [reports, setReports] = useState<IoTReport[]>([]);
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [adjustments, setAdjustments] = useState<SystemAdjustment[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const reportsData = await IoTService.getReports();
        const devicesData = await IoTService.getDevices();
        const adjustmentsData = await IoTService.getSystemAdjustments();
        
        setReports(reportsData);
        setDevices(devicesData);
        setAdjustments(adjustmentsData);
      } catch (error) {
        console.error('Error fetching IoT data:', error);
        toast({
          title: "Failed to load data",
          description: "There was an error loading IoT data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleDownloadReport = async (reportId: string) => {
    try {
      const blob = await IoTService.downloadReport(reportId);
      const report = reports.find(r => r.id === reportId);
      const fileName = `${report?.reportType}_report_${report?.deviceName}_${new Date().toISOString().split('T')[0]}.json`;
      
      // Create a download link and trigger click
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Report downloaded",
        description: `${fileName} has been downloaded successfully.`,
      });
    } catch (error) {
      console.error('Error downloading report:', error);
      toast({
        title: "Download failed",
        description: "There was an error downloading the report. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleApplyAdjustment = async (adjustmentId: string) => {
    try {
      const updatedAdjustment = await IoTService.applySystemAdjustment(adjustmentId);
      setAdjustments(prev => prev.map(adj => adj.id === adjustmentId ? updatedAdjustment : adj));
      
      toast({
        title: "Adjustment applied",
        description: "System adjustment has been applied successfully.",
      });
    } catch (error) {
      console.error('Error applying adjustment:', error);
      toast({
        title: "Failed to apply adjustment",
        description: "There was an error applying the system adjustment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getReportIcon = (reportType: string) => {
    switch (reportType) {
      case 'health': 
        return <Activity className="h-5 w-5 text-medical-blue" />;
      case 'medication': 
        return <PackageCheck className="h-5 w-5 text-medical-orange" />;
      case 'activity': 
        return <LineChart className="h-5 w-5 text-medical-green" />;
      case 'sleep': 
        return <AlarmCheck className="h-5 w-5 text-medical-purple" />;
      case 'environment': 
        return <ThermometerSnowflake className="h-5 w-5 text-blue-500" />;
      default: 
        return <Server className="h-5 w-5" />;
    }
  };

  const getAdjustmentBadgeColor = (severity: string) => {
    switch (severity) {
      case 'low': return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case 'medium': return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case 'high': return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const filteredReports = reports.filter(report => 
    report.deviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredAdjustments = adjustments.filter(adjustment => 
    adjustment.recommendation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    adjustment.recommendationType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">IoT Cloud Reports</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast({ title: "Syncing data", description: "Syncing with cloud..." })}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync
          </Button>
          <Button onClick={() => toast({ title: "Upload data", description: "Select data to upload to cloud..." })}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-medical-blue/10 p-2 rounded-full">
                <Download className="h-5 w-5 text-medical-blue" />
              </div>
              <CardTitle className="text-lg">Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reports.length}</div>
            <p className="text-sm text-muted-foreground">Available from cloud</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-medical-green/10 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-medical-green" />
              </div>
              <CardTitle className="text-lg">IoT Devices</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{devices.length}</div>
            <p className="text-sm text-muted-foreground">{devices.filter(d => d.status === 'online').length} online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-medical-orange/10 p-2 rounded-full">
                <Settings className="h-5 w-5 text-medical-orange" />
              </div>
              <CardTitle className="text-lg">Adjustments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{adjustments.length}</div>
            <p className="text-sm text-muted-foreground">{adjustments.filter(a => !a.applied).length} pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="bg-medical-purple/10 p-2 rounded-full">
                <Server className="h-5 w-5 text-medical-purple" />
              </div>
              <CardTitle className="text-lg">Cloud Sync</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">100%</div>
            <p className="text-sm text-muted-foreground">Last synced: {new Date().toLocaleTimeString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search reports, devices or adjustments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefixIcon={<Search className="h-4 w-4" />}
            className="w-full"
          />
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
          <TabsList className="h-10 w-full md:w-auto">
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="devices">IoT Devices</TabsTrigger>
            <TabsTrigger value="adjustments">System Adjustments</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tabs Content */}
      <TabsContent value="reports" className="mt-0">
        <Card>
          <Table>
            <TableCaption>A list of your IoT device reports.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Report Type</TableHead>
                <TableHead>Device</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Loading reports data...</TableCell>
                </TableRow>
              ) : filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      {getReportIcon(report.reportType)}
                      <span className="capitalize">{report.reportType} Report</span>
                    </TableCell>
                    <TableCell>{report.deviceName}</TableCell>
                    <TableCell>
                      {new Date(report.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant={report.status === 'processed' ? 'default' : report.status === 'pending' ? 'outline' : 'destructive'}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDownloadReport(report.id)}
                        title="Download Report"
                      >
                        <ArrowDownToLine className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Server className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No reports found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchTerm ? "Try a different search term" : "No reports available from the cloud"}
                      </p>
                      <Button onClick={() => setSearchTerm('')}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      <TabsContent value="devices" className="mt-0">
        <Card>
          <Table>
            <TableCaption>A list of your connected IoT devices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Synced</TableHead>
                <TableHead>Battery</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Loading devices data...</TableCell>
                </TableRow>
              ) : filteredDevices.length > 0 ? (
                filteredDevices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell className="font-medium">{device.name}</TableCell>
                    <TableCell>{device.type}</TableCell>
                    <TableCell>
                      <Badge variant={device.status === 'online' ? 'default' : device.status === 'offline' ? 'outline' : 'destructive'}>
                        {device.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(device.lastSynced).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {' '}
                      ({new Date(device.lastSynced).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })})
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Battery className={`h-4 w-4 ${
                        device.batteryLevel > 70 ? 'text-green-500' : 
                        device.batteryLevel > 30 ? 'text-yellow-500' : 
                        'text-red-500'
                      }`} />
                      <span>{device.batteryLevel}%</span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Smartphone className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No devices found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchTerm ? "Try a different search term" : "No IoT devices connected"}
                      </p>
                      <Button onClick={() => setSearchTerm('')}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      <TabsContent value="adjustments" className="mt-0">
        <Card>
          <Table>
            <TableCaption>System adjustments based on IoT data.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Loading adjustments data...</TableCell>
                </TableRow>
              ) : filteredAdjustments.length > 0 ? (
                filteredAdjustments.map((adjustment) => (
                  <TableRow key={adjustment.id}>
                    <TableCell className="font-medium capitalize">{adjustment.recommendationType}</TableCell>
                    <TableCell>{adjustment.recommendation}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAdjustmentBadgeColor(adjustment.severity)}`}>
                        {adjustment.severity}
                      </span>
                    </TableCell>
                    <TableCell>
                      {adjustment.applied ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300">Applied</Badge>
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {adjustment.appliedAt ? new Date(adjustment.appliedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            }) : ''}
                          </span>
                        </div>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {!adjustment.applied && (
                        <Button
                          size="sm"
                          onClick={() => handleApplyAdjustment(adjustment.id)}
                        >
                          Apply
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Settings className="h-10 w-10 text-muted-foreground mb-2" />
                      <h3 className="text-lg font-medium">No adjustments found</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {searchTerm ? "Try a different search term" : "No system adjustments needed"}
                      </p>
                      <Button onClick={() => setSearchTerm('')}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </TabsContent>

      {/* System Settings Adjustment Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>System Settings Dashboard</CardTitle>
          <CardDescription>
            Adjust system settings based on IoT data and reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Health Monitoring</CardTitle>
                  <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Optimized</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Threshold Alerts</span>
                    <Badge>Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monitoring Frequency</span>
                    <span className="text-sm font-medium">15 mins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Health Variables</span>
                    <span className="text-sm font-medium">5 Tracked</span>
                  </div>
                  <Button className="w-full mt-2" variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" /> Configure
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Medication System</CardTitle>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Needs Adjustment</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reminder Alerts</span>
                    <Badge>Enabled</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Dispenser Status</span>
                    <span className="text-sm font-medium">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Next Dispense</span>
                    <span className="text-sm font-medium">Today, 8:00 PM</span>
                  </div>
                  <Button className="w-full mt-2" size="sm">
                    <Settings className="h-4 w-4 mr-2" /> Adjust Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Environment Control</CardTitle>
                  <Badge variant="outline">Default</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Room Temperature</span>
                    <span className="text-sm font-medium">22.5°C</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Humidity</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Air Quality</span>
                    <span className="text-sm font-medium">Good (87)</span>
                  </div>
                  <Button className="w-full mt-2" variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" /> Control Panel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IoTReportsPage;
