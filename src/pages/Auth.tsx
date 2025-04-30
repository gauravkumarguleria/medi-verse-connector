
import React, { useState, useEffect } from 'react';
import { useSearchParams, Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RoleSelector from '@/components/ui/RoleSelector';
import CircleBackground from '@/components/ui/CircleBackground';
import AnimatedButton from '@/components/ui/AnimatedButton';
import { UserRole } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'login';
  const preselectedRole = searchParams.get('role') as UserRole | null;
  
  const [authType, setAuthType] = useState<'login' | 'register'>(
    type === 'register' ? 'register' : 'login'
  );
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(preselectedRole);
  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { refreshUserProfile, isAuthenticated } = useUser();
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    // Update auth type if URL parameter changes
    setAuthType(type === 'register' ? 'register' : 'login');
  }, [type]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const clearError = () => {
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearError();
    
    try {
      if (authType === 'register' && !selectedRole) {
        setErrorMessage("Please select a role to register");
        toast({
          title: "Please select a role",
          description: "You need to select a role to register",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      if (authType === 'register' && selectedRole) {
        // Register the user with Supabase
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
          setErrorMessage(signUpError.message);
          toast({
            title: "Registration Failed",
            description: signUpError.message,
            variant: "destructive",
          });
          return;
        }
        
        // Display success toast
        toast({
          title: "Registration Successful",
          description: `Your ${selectedRole} account has been created successfully.`,
        });
        
        // Show registration success message
        setRegistrationSuccess(true);
        // Switch to login tab
        setAuthType('login');
      } else {
        // For login, sign in with Supabase
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (signInError) {
          console.error("Login error:", signInError);
          setErrorMessage(signInError.message);
          toast({
            title: "Login Failed",
            description: signInError.message,
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        if (signInData && signInData.user) {
          console.log("Login successful, user:", signInData.user);
          
          // Refresh the user profile to get the latest data
          await refreshUserProfile();
          
          // Display success toast
          toast({
            title: "Login Successful",
            description: "Welcome back to MediVerse!",
          });
          
          // Force navigation to dashboard
          navigate('/dashboard');
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      let message = "Please check your credentials and try again";
      if (error instanceof Error) {
        message = error.message;
      }
      setErrorMessage(message);
      toast({
        title: "Authentication Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect to dashboard if already authenticated
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
          
          {errorMessage && (
            <div className="px-6 pb-2">
              <Alert variant="destructive">
                <AlertTitle>Authentication Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            </div>
          )}
          
          <Tabs 
            value={authType}
            className="w-full" 
            onValueChange={(value) => {
              setAuthType(value as 'login' | 'register');
              clearError();
              // Reset success state when switching to register tab
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
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
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
                        clearError();
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
                    <div className="relative">
                      <Input 
                        id="password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button 
                        type="button" 
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
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
                        clearError();
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
