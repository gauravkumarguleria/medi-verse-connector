
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
import { ChevronLeft, Loader2 } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get('type') || 'login';
  const preselectedRole = searchParams.get('role') as UserRole | null;
  
  const [authType, setAuthType] = useState<'login' | 'register'>(
    type === 'register' ? 'register' : 'login'
  );
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(preselectedRole);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [loginProgress, setLoginProgress] = useState(0);
  const { refreshUserProfile } = useUser();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  
  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking if user is already authenticated...');
        const { data } = await supabase.auth.getSession();
        if (data && data.session) {
          console.log('User is already authenticated, redirecting to dashboard');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error checking authentication status:', error);
      }
    };
    
    checkAuth();
    
    // Clear form on component mount
    setEmail('');
    setPassword('');
    setName('');
    setLoginProgress(0);
  }, [navigate]);

  // Update auth type when URL parameter changes
  useEffect(() => {
    setAuthType(type === 'register' ? 'register' : 'login');
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (authType === 'register') {
        if (!selectedRole) {
          toast({
            title: "Please select a role",
            description: "You need to select a role to register",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        console.log('Registering with:', { email, password, name, role: selectedRole });
        
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              role: selectedRole,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
            }
          }
        });
        
        if (signUpError) {
          console.error('Registration error:', signUpError);
          toast({
            title: "Registration Failed",
            description: signUpError.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        toast({
          title: "Registration Successful",
          description: `Your ${selectedRole} account has been created successfully.`,
        });
        
        setRegistrationSuccess(true);
        setAuthType('login');
        setIsLoading(false);
      } else {
        console.log("Attempting login with:", { email, password });
        setLoginProgress(25);
        
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.error("Login error:", signInError);
          toast({
            title: "Login Failed",
            description: signInError.message,
            variant: "destructive",
          });
          setIsLoading(false);
          setLoginProgress(0);
          return;
        }
        
        setLoginProgress(75);
        
        if (signInData && signInData.user) {
          console.log('Login successful, user:', signInData.user.id);
          
          // Refresh the user profile to ensure we have the latest data
          await refreshUserProfile();
          
          setLoginProgress(100);
          
          toast({
            title: "Login Successful",
            description: "Welcome back to MediVerse!",
          });
          
          // Use a timeout to ensure the progress bar completes
          setTimeout(() => {
            navigate('/dashboard');
          }, 500);
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication Failed",
        description: "Please check your credentials and try again",
        variant: "destructive",
      });
      setLoginProgress(0);
      setIsLoading(false);
    }
  };

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
          
          {isLoading && authType === 'login' && loginProgress > 0 && (
            <div className="px-6 pb-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Logging in...</span>
                  <span>{loginProgress}%</span>
                </div>
                <Progress value={loginProgress} className="h-2" />
              </div>
            </div>
          )}
          
          {registrationSuccess && authType === 'login' && (
            <div className="px-6 pb-2">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Registration Successful!</AlertTitle>
                <AlertDescription className="text-green-700">
                  Your account has been created. Please login to continue.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <Tabs 
            value={authType}
            className="w-full" 
            onValueChange={(value) => {
              setAuthType(value as 'login' | 'register');
              if (value === 'register') {
                setRegistrationSuccess(false);
              }
            }}
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
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Logging in...
                      </span>
                    ) : "Login"}
                  </AnimatedButton>
                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <a 
                      href="#" 
                      className="text-primary hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        setAuthType('register');
                        setRegistrationSuccess(false);
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
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Creating Account...
                      </span>
                    ) : "Create Account"}
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
