
import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Shield, 
  KeyRound,
  Bell,
  FileText
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import GlassCard from '@/components/ui/GlassCard';
import { User as UserType } from '@/types';

interface ProfileSectionProps {
  user: UserType;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    appointments: true,
    medications: true,
    messages: true,
    reports: false,
    newsletters: false
  });

  const handleNotificationToggle = (key: keyof typeof notificationsEnabled) => {
    setNotificationsEnabled(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="animate-fade-up space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and settings</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Profile Summary Card */}
        <GlassCard className="md:col-span-1 p-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold mb-1">{user.name}</h3>
            <p className="text-muted-foreground mb-4">{user.email}</p>
            <Badge className="mb-6">{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
            
            <div className="w-full mt-4">
              <Button variant="outline" className="w-full mb-2">Change Avatar</Button>
              <Button variant="secondary" className="w-full">Edit Profile</Button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t">
            <h4 className="font-medium mb-4">Account Information</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Member since Jan 2023</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Last appointment: May 15, 2023</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Premium Plan</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Profile Tabs */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full mb-6">
              <TabsTrigger value="personal" className="flex-1">Personal Info</TabsTrigger>
              <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
              <TabsTrigger value="notifications" className="flex-1">Notifications</TabsTrigger>
              <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue={user.email} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" defaultValue="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input id="dateOfBirth" defaultValue="1990-05-15" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="123 Health Street" />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" defaultValue="San Francisco" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input id="state" defaultValue="California" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input id="zipCode" defaultValue="94105" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Medical Information</CardTitle>
                  <CardDescription>Update your medical details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Input id="bloodType" defaultValue="O+" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input id="height" defaultValue="175" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input id="weight" defaultValue="70" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Input id="allergies" defaultValue="None" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="conditions">Medical Conditions</Label>
                    <Input id="conditions" defaultValue="None" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input id="confirmPassword" type="password" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Cancel</Button>
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Enhance your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch id="2fa" defaultChecked={true} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Setup 2FA</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">Appointment Reminders</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Get notified about upcoming appointments</p>
                    </div>
                    <Switch 
                      checked={notificationsEnabled.appointments}
                      onCheckedChange={() => handleNotificationToggle('appointments')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">Medication Reminders</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Get reminders to take your medications</p>
                    </div>
                    <Switch 
                      checked={notificationsEnabled.medications}
                      onCheckedChange={() => handleNotificationToggle('medications')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">Messages</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Get notified about new messages</p>
                    </div>
                    <Switch 
                      checked={notificationsEnabled.messages}
                      onCheckedChange={() => handleNotificationToggle('messages')}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <p className="font-medium">Health Reports</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Get notified when new reports are available</p>
                    </div>
                    <Switch 
                      checked={notificationsEnabled.reports}
                      onCheckedChange={() => handleNotificationToggle('reports')}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>App Preferences</CardTitle>
                  <CardDescription>Customize your app experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <p className="font-medium">Language</p>
                      <p className="text-sm text-muted-foreground">Choose your preferred language</p>
                    </div>
                    <div className="w-48">
                      <select className="w-full border p-2 rounded-md">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <p className="font-medium">Date Format</p>
                      <p className="text-sm text-muted-foreground">Choose your preferred date format</p>
                    </div>
                    <div className="w-48">
                      <select className="w-full border p-2 rounded-md">
                        <option>MM/DD/YYYY</option>
                        <option>DD/MM/YYYY</option>
                        <option>YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <p className="font-medium">Temperature Unit</p>
                      <p className="text-sm text-muted-foreground">Choose your preferred temperature unit</p>
                    </div>
                    <div className="w-48">
                      <select className="w-full border p-2 rounded-md">
                        <option>Celsius (°C)</option>
                        <option>Fahrenheit (°F)</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <p className="font-medium">Weight Unit</p>
                      <p className="text-sm text-muted-foreground">Choose your preferred weight unit</p>
                    </div>
                    <div className="w-48">
                      <select className="w-full border p-2 rounded-md">
                        <option>Kilograms (kg)</option>
                        <option>Pounds (lb)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Reset to Default</Button>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
