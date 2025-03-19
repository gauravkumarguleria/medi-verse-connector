import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { ThemeProvider } from './components/ui/ThemeProvider';
import { Toaster } from './components/ui/toaster';
import Preloader from './components/ui/Preloader';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardLayout from './components/layout/DashboardLayout';
import About from './pages/About';
import Features from './pages/Features';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Router>
      <Preloader />
      <ThemeProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard/*" element={
              <DashboardLayout>
                <Routes>
                  <Route index element={<Dashboard />} />
                </Routes>
              </DashboardLayout>
            } />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </UserProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
