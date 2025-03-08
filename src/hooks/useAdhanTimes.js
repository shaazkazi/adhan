import { useState, useEffect, useRef } from 'react';
import { fetchPrayerTimes } from '../services/adhanService';

// Cache for prayer times
const prayerTimesCache = {};

const useAdhanTimes = (latitude, longitude, date, method = 2) => {
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nextPrayer, setNextPrayer] = useState({ name: '', time: null });
  
  // Use a ref to track if this is the initial mount
  const initialMount = useRef(true);
  // Use a ref to track the previous values
  const prevValues = useRef({ latitude, longitude, date, method });
  
  // Format date for caching
  const formattedDate = date instanceof Date 
    ? `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`
    : date;
  
  // Create a cache key
  const cacheKey = `${latitude}-${longitude}-${formattedDate}-${method}`;

  useEffect(() => {
    // Skip if we don't have valid coordinates
    if (!latitude || !longitude) {
      setLoading(false);
      return;
    }
    
    // Skip if nothing has changed since last fetch
    const prevVals = prevValues.current;
    if (
      !initialMount.current && 
      prevVals.latitude === latitude && 
      prevVals.longitude === longitude && 
      prevVals.method === method &&
      prevVals.date === formattedDate
    ) {
      return;
    }
    
    // Update previous values
    prevValues.current = { latitude, longitude, date: formattedDate, method };
    
    // Check cache first
    if (prayerTimesCache[cacheKey]) {
      setPrayerTimes(prayerTimesCache[cacheKey]);
      calculateNextPrayer(prayerTimesCache[cacheKey]);
      setLoading(false);
      initialMount.current = false;
      return;
    }

    // Fetch new data
    const getPrayerTimes = async () => {
      try {
        setLoading(true);
        const data = await fetchPrayerTimes(latitude, longitude, formattedDate, method);
        
        // Cache the result
        prayerTimesCache[cacheKey] = data;
        
        setPrayerTimes(data);
        calculateNextPrayer(data);
        setError(null);
      } catch (err) {
        console.error('Error in useAdhanTimes:', err);
        setError('Failed to fetch prayer times');
      } finally {
        setLoading(false);
        initialMount.current = false;
      }
    };

    getPrayerTimes();
  }, [latitude, longitude, formattedDate, method, cacheKey]);

  // Modify the calculateNextPrayer function
const calculateNextPrayer = (data) => {
  if (!data || !data.timings) return;

  const prayerOrder = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const now = new Date();
  let nextPrayerName = '';
  let nextPrayerTime = null;

  for (const prayer of prayerOrder) {
    const prayerTime = convertToDate(data.timings[prayer]);
    if (prayerTime > now) {
      nextPrayerName = prayer;
      nextPrayerTime = prayerTime;
      break;
    }
  }

  // If no next prayer found, it means all prayers for today have passed
  // Set the next prayer as tomorrow's Fajr
  if (!nextPrayerName) {
    nextPrayerName = 'Fajr';
    
    // Create a time for tomorrow's Fajr based on today's Fajr time
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Use today's Fajr time but for tomorrow's date
    const [hours, minutes] = data.timings.Fajr.split(':').map(Number);
    tomorrow.setHours(hours, minutes, 0, 0);
    
    nextPrayerTime = tomorrow;
  }

  setNextPrayer({
    name: nextPrayerName,
    time: nextPrayerTime
  });
};

  // Helper to convert time string to Date object
  const convertToDate = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  return { prayerTimes, loading, error, nextPrayer };
};

export default useAdhanTimes;
