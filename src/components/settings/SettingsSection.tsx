
import React, { useState } from 'react';
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Shield, Bell, Lock, Edit, RefreshCw } from 'lucide-react';

const SettingsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

  const saveSettings = () => {
    setLoading(true);
    // Simulate saving settings
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto py-6 space-y-8 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="general" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-4 h-auto gap-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your general account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="theme-preference">Dark theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable dark theme for your dashboard
                  </p>
                </div>
                <Switch id="theme-preference" defaultChecked />
              </div>
              
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="language">Language</Label>
                  <p className="text-sm text-muted-foreground">
                    Set your preferred language
                  </p>
                </div>
                <select id="language" className="border rounded-md p-2">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="timezone">Timezone</Label>
                  <p className="text-sm text-muted-foreground">
                    Set your timezone
                  </p>
                </div>
                <select id="timezone" className="border rounded-md p-2">
                  <option value="utc">UTC</option>
                  <option value="est">Eastern Time (EST)</option>
                  <option value="pst">Pacific Time (PST)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={loading}>
                {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Control when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox id="email-notifications" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your appointment reminders via email
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox id="sms-notifications" defaultChecked />
                  <div className="grid gap-1.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive text message reminders for appointments
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox id="app-notifications" defaultChecked />
                  <div className="grid gap-1.5">
                    <Label htmlFor="app-notifications">In-App Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications while using the application
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={loading}>
                {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Manage how your information is displayed and shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Control who can see your profile
                  </p>
                </div>
                <select id="profile-visibility" className="border rounded-md p-2">
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="doctors-only">Doctors Only</option>
                </select>
              </div>
              
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="data-sharing">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow sharing anonymized health data for research
                  </p>
                </div>
                <Switch id="data-sharing" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={loading}>
                {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>
                Manage your account security and authentication methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label>Password</Label>
                  <p className="text-sm text-muted-foreground">
                    Change your account password
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
              
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">Two-factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch id="two-factor" />
              </div>
              
              <div className="flex flex-wrap md:flex-nowrap items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="session-timeout">Session Timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after a period of inactivity
                  </p>
                </div>
                <select id="session-timeout" className="border rounded-md p-2">
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="never">Never</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={loading}>
                {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsSection;
