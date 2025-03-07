import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import useGeolocation from '../hooks/useGeolocation';

// Create a cache to avoid duplicate API calls
const geocodeCache = {};

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const { coords, error: geoError, loading: geoLoading } = useGeolocation();
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    city: '',
    country: '',
    manualLocation: false,
  });
  const [reverseGeocodingInProgress, setReverseGeocodingInProgress] = useState(false);

  // Function to get city name from coordinates - with caching
  const getCityFromCoords = useCallback(async (latitude, longitude) => {
    // Return default object if we're already making a request for this location
    if (reverseGeocodingInProgress) {
      return { city: '', country: '' }; // Return an object with empty values
    }
    
    // Check cache first
    const cacheKey = `${latitude}-${longitude}`;
    if (geocodeCache[cacheKey]) {
      const { city, country } = geocodeCache[cacheKey];
      return { city, country };
    }
    
    setReverseGeocodingInProgress(true);
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to get location data');
      }
      
      const data = await response.json();
      const city = data.address?.city || data.address?.town || data.address?.village || '';
      const country = data.address?.country || '';
      
      // Cache the result
      geocodeCache[cacheKey] = { city, country };
      
      return { city, country };
    } catch (err) {
      console.error('Error getting location name:', err);
      return { city: '', country: '' }; // Return an object with empty values on error
    } finally {
      setReverseGeocodingInProgress(false);
    }
  }, [reverseGeocodingInProgress]);

  // Update coordinates when geolocation changes and not using manual location
  useEffect(() => {
    if (coords && !location.manualLocation) {
      setLocation(prev => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
    }
  }, [coords, location.manualLocation]);

  // Get city name when coordinates change
  useEffect(() => {
    if (
      location.latitude && 
      location.longitude && 
      !location.manualLocation && 
      (!location.city || !location.country)
    ) {
      // Use an async function inside useEffect
      const fetchLocationName = async () => {
        try {
          const result = await getCityFromCoords(
            location.latitude, 
            location.longitude
          );
          
          // Safely destructure with default values
          const { city = '', country = '' } = result || {};
          
          if (city || country) {
            setLocation(prev => ({
              ...prev,
              city,
              country,
            }));
          }
        } catch (error) {
          console.error("Error in fetchLocationName:", error);
        }
      };
      
      fetchLocationName();
    }
  }, [location.latitude, location.longitude, location.manualLocation, location.city, location.country, getCityFromCoords]);

  const setManualLocation = useCallback((city, country, latitude, longitude) => {
    setLocation({
      city,
      country,
      latitude,
      longitude,
      manualLocation: true,
    });
  }, []);

  const useCurrentLocation = useCallback(() => {
    if (coords) {
      setLocation(prev => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
        manualLocation: false,
      }));
      
      // Fetch the city and country when reverting to current location
      getCityFromCoords(coords.latitude, coords.longitude)
        .then(result => {
          // Safely destructure with default values
          const { city = '', country = '' } = result || {};
          
          setLocation(prev => ({
            ...prev,
            city,
            country,
          }));
        })
        .catch(error => {
          console.error("Error in useCurrentLocation:", error);
        });
    }
  }, [coords, getCityFromCoords]);

  return (
    <LocationContext.Provider
      value={{
        location,
        setManualLocation,
        useCurrentLocation,
        isLoading: geoLoading || reverseGeocodingInProgress,
        error: geoError,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
