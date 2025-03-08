import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '../contexts/LocationContext';
import { useSettings } from '../contexts/SettingsContext';
import useAdhanTimes from '../hooks/useAdhanTimes';
import { formatTime } from '../utils/timeUtils';
import { FaMoon, FaSun } from 'react-icons/fa';

const Ramadan = () => {
  const { location } = useLocation();
  const { settings } = useSettings();
  const [progress, setProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isFasting, setIsFasting] = useState(false);
  
  // Format date for API call
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
  
  // Get prayer times
  const { prayerTimes, loading, error } = useAdhanTimes(
    location.latitude,
    location.longitude,
    formattedDate,
    settings.calculationMethod
  );

  // Calculate progress and remaining time
  useEffect(() => {
    if (!prayerTimes || !prayerTimes.timings) return;
    
    const updateProgress = () => {
      const now = new Date();
      const fajrTime = new Date(now.toDateString() + ' ' + prayerTimes.timings.Fajr);
      const maghribTime = new Date(now.toDateString() + ' ' + prayerTimes.timings.Maghrib);
      
      // Handle day wrapping (if current time is before Fajr)
      if (now < fajrTime) {
        fajrTime.setDate(fajrTime.getDate() - 1);
        maghribTime.setDate(maghribTime.getDate() - 1);
      }
      
      // Check if we're in fasting period
      const isFastingNow = now >= fajrTime && now <= maghribTime;
      setIsFasting(isFastingNow);
      
      if (isFastingNow) {
        // Calculate progress percentage
        const totalDuration = maghribTime - fajrTime;
        const elapsed = now - fajrTime;
        const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        setProgress(percentage);
        
        // Calculate remaining time until Maghrib
        const remaining = maghribTime - now;
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        
        setRemainingTime({ hours, minutes, seconds });
      } else {
        // If before Fajr, set 0% progress
        // If after Maghrib, set 100% progress
        setProgress(now < fajrTime ? 0 : 100);
        
        // Calculate time until next Fajr
        if (now > maghribTime) {
          const nextFajr = new Date(now.toDateString() + ' ' + prayerTimes.timings.Fajr);
          nextFajr.setDate(nextFajr.getDate() + 1);
          
          const remaining = nextFajr - now;
          const hours = Math.floor(remaining / (1000 * 60 * 60));
          const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
          
          setRemainingTime({ hours, minutes, seconds });
        }
      }
    };
    
    // Update immediately and then every second
    updateProgress();
    const interval = setInterval(updateProgress, 1000);
    
    return () => clearInterval(interval);
  }, [prayerTimes]);
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-500">Loading prayer times...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
        <p>Error loading prayer times. Please try again.</p>
      </div>
    );
  }
  
  return (
    <div className="pb-6">
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden mb-4 p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="font-bold text-lg mb-4 text-center">Ramadan Fasting Progress</h2>
        
        {prayerTimes && prayerTimes.timings && (
          <>
            {/* Status Message */}
            <div className="text-center mb-4">
              <p className="text-lg font-medium">
                {isFasting ? 
                  "You're fasting! Stay strong 💪" : 
                  progress === 100 ? 
                    "Fasting complete! May Allah accept your fast 🌙" : 
                    "Preparing for next fast 🌙"
                }
              </p>
            </div>
                          {/* Progress Bar */}
<div className="relative h-3 bg-opacity-30 bg-blue-900 rounded-full overflow-hidden mb-6">
  <motion.div 
    className="absolute left-0 top-0 h-full bg-[#ff8f6e] rounded-full"
    initial={{ width: 0 }}
    animate={{ width: `${progress}%` }}
    transition={{ duration: 0.5 }}
    style={{
      boxShadow: isFasting ? '0 0 8px rgba(255, 143, 110, 0.5)' : 'none'
    }}
  />
  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
    {Math.round(progress)}%
  </div>
</div>
            
            {/* Time Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Fajr Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-4 text-white shadow-md">
                <div className="flex items-center mb-2">
                  <FaMoon className="mr-2" />
                  <h3 className="font-bold">Fajr</h3>
                </div>
                <p className="text-xl font-bold">{formatTime(prayerTimes.timings.Fajr, settings.timeFormat)}</p>
                <p className="text-xs mt-1 opacity-80">Beginning of Fast</p>
              </div>
              
              {/* Maghrib Card */}
              <div className="bg-gradient-to-br from-amber-600 to-red-600 rounded-xl p-4 text-white shadow-md">
                <div className="flex items-center mb-2">
                  <FaSun className="mr-2" />
                  <h3 className="font-bold">Maghrib</h3>
                </div>
                <p className="text-xl font-bold">{formatTime(prayerTimes.timings.Maghrib, settings.timeFormat)}</p>
                <p className="text-xs mt-1 opacity-80">End of Fast</p>
              </div>
            </div>
            
            {/* Remaining Time */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 text-white shadow-md">
              <h3 className="text-center font-bold mb-2">
                {isFasting ? "Time Remaining Until Iftar" : "Time Until Next Fast"}
              </h3>
              <div className="text-center text-2xl font-bold font-mono">
                {`${remainingTime.hours.toString().padStart(2, '0')}:${remainingTime.minutes.toString().padStart(2, '0')}:${remainingTime.seconds.toString().padStart(2, '0')}`}
              </div>
            </div>
          </>
        )}
      </motion.div>
      
      {/* Additional Information */}
      <motion.div
        className="bg-white rounded-xl shadow-md overflow-hidden p-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h3 className="font-medium mb-2">Ramadan Tips</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• Drink plenty of water during non-fasting hours</li>
          <li>• Eat suhoor (pre-dawn meal) to sustain energy</li>
          <li>• Break your fast with dates and water</li>
          <li>• Include fruits and vegetables in your iftar</li>
          <li>• Take time for extra worship and Quran reading</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Ramadan;
