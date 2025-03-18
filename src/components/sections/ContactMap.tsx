
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

// Add type declaration for Google Maps API
declare global {
  interface Window {
    google?: {
      maps?: any;
    };
  }
}

const ContactMap = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Function to load the Google Maps script
  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    // Load Google Maps script
    const googleMapScript = document.createElement('script');
    googleMapScript.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places`;
    googleMapScript.async = true;
    googleMapScript.defer = true;
    googleMapScript.id = 'googleMapsScript';
    
    googleMapScript.onload = () => {
      setMapLoaded(true);
    };
    
    document.body.appendChild(googleMapScript);

    return () => {
      // Clean up the script when component unmounts
      const script = document.getElementById('googleMapsScript');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow-md">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217266.97185469233!2d76.96957773351159!3d31.09789681216703!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390578e3e35d6e67%3A0x1f7e7ff6ff9f54b7!2sShimla%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1694889780668!5m2!1sen!2sin" 
        width="100%" 
        height="100%" 
        style={{ border: 0 }} 
        allowFullScreen 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"
        title="Google Map of Shimla, Himachal Pradesh"
        className="w-full h-full min-h-[500px]"
      />
    </div>
  );
};

export default ContactMap;
