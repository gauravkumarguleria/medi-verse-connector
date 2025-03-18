import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Shield, 
  KeyRound,
  Bell,
  FileText,
  Save,
  X
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
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

const ProfileSection: React.FC = () => {
  const { user, updateUser } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Health Street',
    city: 'San Francisco',
    state: 'California',
    zipCode: '94105',
    bloodType: 'O+',
    height: '175',
    weight: '70',
    allergies: 'None',
    conditions: 'None'
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState({
    appointments: true,
    medications: true,
    messages: true,
    reports: false,
    newsletters: false
  });

  useEffect(() => {
    // Update form data when user data changes
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email
    }));
  }, [user]);

  const handleNotificationToggle = (key: keyof typeof notificationsEnabled) => {
    setNotificationsEnabled(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaveChanges = () => {
    // Save the user details
    updateUser({
      name: formData.name,
      email: formData.email
    });
    
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
      variant: "default",
    });
  };

  const handleCancel = () => {
    // Reset form to current user data
    setFormData(prev => ({
      ...prev,
      name: user.name,
      email: user.email
    }));
    setIsEditing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="animate-fade-up space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and settings</p>
        </div>
        <div className="flex gap-4">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={toggleEdit}>Edit Profile</Button>
          )}
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
              <Button 
                variant="secondary" 
                className="w-full"
                onClick={toggleEdit}
              >
                {isEditing ? 'Cancel Editing' : 'Edit Profile'}
              </Button>
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
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={formData.name} 
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input 
                        id="dateOfBirth" 
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input 
                      id="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input 
                        id="city" 
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input 
                        id="state" 
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Zip Code</Label>
                      <Input 
                        id="zipCode" 
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {isEditing && (
                    <>
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      <Button onClick={handleSaveChanges}>Save Changes</Button>
                    </>
                  )}
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
                      <Input 
                        id="bloodType" 
                        value={formData.bloodType}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input 
                        id="height" 
                        value={formData.height}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input 
                        id="weight" 
                        value={formData.weight}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies</Label>
                      <Input 
                        id="allergies" 
                        value={formData.allergies}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="conditions">Medical Conditions</Label>
                    <Input 
                      id="conditions" 
                      value={formData.conditions}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  {isEditing && (
                    <>
                      <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                      <Button onClick={handleSaveChanges}>Save Changes</Button>
                    </>
                  )}
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
