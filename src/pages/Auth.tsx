
import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleSelector from '@/components/ui/RoleSelector';
import CircleBackground from '@/components/ui/CircleBackground';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { UserRole } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { ChevronLeft } from 'lucide-react';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'login';
  const preselectedRole = searchParams.get('role') as UserRole | null;
  
  const [authType, setAuthType] = useState<'login' | 'register'>(
    type === 'register' ? 'register' : 'login'
  );
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(preselectedRole);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    // Update auth type if URL parameter changes
    setAuthType(type === 'register' ? 'register' : 'login');
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (authType === 'register' && !selectedRole) {
        toast({
          title: "Please select a role",
          description: "You need to select a role to register",
          variant: "destructive",
        });
        return;
      }
      
      // Simulate successful authentication
      toast({
        title: authType === 'login' ? "Login Successful" : "Registration Successful",
        description: authType === 'login' 
          ? "Welcome back to MediVerse!" 
          : `Your ${selectedRole} account has been created successfully.`,
      });
      
      setIsAuthenticated(true);
    } catch (error) {
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to dashboard if authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-secondary/30 relative">
      <CircleBackground />
      
      <a 
        href="/"
        className="absolute top-8 left-8 flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </a>
      
      <div className="w-full max-w-md animate-fade-up">
        <Card className="w-full bg-card/80 backdrop-blur-sm shadow-md border-border/50">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-bold text-center">
              {authType === 'login' ? 'Welcome Back' : 'Create Your Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {authType === 'login' 
                ? 'Login to access your MediVerse account' 
                : 'Join MediVerse and revolutionize your healthcare experience'}
            </CardDescription>
          </CardHeader>
          
          <Tabs 
            defaultValue={authType} 
            className="w-full" 
            onValueChange={(value) => setAuthType(value as 'login' | 'register')}
          >
            <TabsList className="grid grid-cols-2 w-full mb-4 mx-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <a 
                        href="#" 
                        className="text-xs text-primary hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <AnimatedButton 
                    className="w-full" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </AnimatedButton>
                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <a 
                      href="#" 
                      className="text-primary hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        setAuthType('register');
                      }}
                    >
                      Register
                    </a>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label>Select Your Role</Label>
                    <RoleSelector 
                      onRoleSelect={setSelectedRole} 
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <AnimatedButton 
                    className="w-full" 
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </AnimatedButton>
                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <a 
                      href="#" 
                      className="text-primary hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        setAuthType('login');
                      }}
                    >
                      Login
                    </a>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
