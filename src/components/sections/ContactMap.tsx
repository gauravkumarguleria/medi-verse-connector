
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';

const ContactMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState('');

  // Himachal Pradesh coordinates (approximate center)
  const himachalCenter = [77.1734, 31.1048]; // Long, Lat

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Check if we have a token
    if (!mapToken) return;

    // Initialize map
    mapboxgl.accessToken = mapToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: himachalCenter,
      zoom: 7,
      projection: 'mercator',
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Add marker for Shimla
    const shimlaCoordinates = [77.1734, 31.1048]; // Shimla coordinates
    new mapboxgl.Marker({ color: '#3b82f6' })
      .setLngLat(shimlaCoordinates)
      .setPopup(new mapboxgl.Popup().setHTML("<h3>MediVerse HQ</h3><p>Shimla, Himachal Pradesh</p>"))
      .addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [mapToken]);

  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('mapboxToken') as HTMLInputElement;
    if (input && input.value) {
      setMapToken(input.value);
      localStorage.setItem('mapbox_token', input.value);
    }
  };

  useEffect(() => {
    // Check for token in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapToken(savedToken);
    }
  }, []);

  return (
    <>
      {!mapToken ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/20 p-8 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Enter your Mapbox Token</h3>
          <p className="mb-6 text-center text-muted-foreground">
            Please enter your Mapbox public token to display the map. You can get one by signing up at <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary">Mapbox.com</a>
          </p>
          <form onSubmit={handleTokenSubmit} className="w-full max-w-md">
            <div className="flex gap-2">
              <input 
                name="mapboxToken"
                type="text" 
                placeholder="Enter your Mapbox public token" 
                className="flex-1 h-10 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      ) : (
        <div ref={mapContainer} className="w-full h-full" />
      )}
    </>
  );
};

export default ContactMap;
