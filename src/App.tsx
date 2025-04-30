
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Features from "./pages/Features";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Preloader from "./components/ui/Preloader";
import { ThemeProvider } from "./components/ui/ThemeProvider";
import { UserProvider } from "./contexts/UserContext";
import { useState, useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  const [appReady, setAppReady] = useState(false);

  // Ensure app is ready after preloader with a shorter delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 600); // Reduced from 1500ms to 600ms
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="mediverse-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UserProvider>
            <Preloader />
            <Toaster />
            <Sonner />
            <div style={{ opacity: appReady ? 1 : 0, transition: 'opacity 0.3s ease' }}>
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/dashboard/*" element={<Dashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </div>
          </UserProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
