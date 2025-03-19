import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useUser } from '@/contexts/UserContext';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSection = () => {
  const { user, isLoading, refreshUserProfile } = useUser();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        await refreshUserProfile();
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };
    
    loadProfile();
  }, [refreshUserProfile]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col space-y-4">
          <Skeleton className="h-12 w-1/4 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                </div>
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile Not Available</CardTitle>
            <CardDescription>Your profile information could not be loaded. Please try again later.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => refreshUserProfile()}
              disabled={isRefreshing}
            >
              Retry
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <div className="p-2 border rounded-md">{user.email}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                <div className="p-2 border rounded-md">{user.phone || 'Not provided'}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Date of Birth</label>
                <div className="p-2 border rounded-md">{user.dateOfBirth || 'Not provided'}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Address</label>
                <div className="p-2 border rounded-md">{user.address || 'Not provided'}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">City</label>
                  <div className="p-2 border rounded-md">{user.city || 'Not provided'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">State</label>
                  <div className="p-2 border rounded-md">{user.state || 'Not provided'}</div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">ZIP Code</label>
                <div className="p-2 border rounded-md">{user.zipCode || 'Not provided'}</div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => refreshUserProfile()}>Refresh</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Medical Information</CardTitle>
            <CardDescription>Your health data and medical records</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Blood Type</label>
              <div className="p-2 border rounded-md">{user.bloodType || 'Not provided'}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Height</label>
                <div className="p-2 border rounded-md">{user.height || 'Not provided'}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Weight</label>
                <div className="p-2 border rounded-md">{user.weight || 'Not provided'}</div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Allergies</label>
              <div className="p-2 border rounded-md min-h-20">{user.allergies || 'None reported'}</div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Medical Conditions</label>
              <div className="p-2 border rounded-md min-h-20">{user.conditions || 'None reported'}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Update Medical Info</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSection;
