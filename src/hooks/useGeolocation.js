import { useState, useEffect } from 'react';

export default function useGeolocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const successHandler = (position) => {
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
      setLoading(false);
    };

    const errorHandler = (error) => {
      setError(error.message);
      setLoading(false);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      options
    );

    // Cleanup function
    return () => {
      // No cleanup needed for getCurrentPosition
    };
  }, []);

  return { coords, error, loading };
}
