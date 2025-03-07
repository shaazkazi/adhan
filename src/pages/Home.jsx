import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from '../contexts/LocationContext';
import { useSettings } from '../contexts/SettingsContext';
import useAdhanTimes from '../hooks/useAdhanTimes';
import LocationSelector from '../components/LocationSelector';
import NextPrayer from '../components/NextPrayer';
import PrayerCard from '../components/PrayerCard';
import DateDisplay from '../components/DateDisplay';
import SettingsPanel from '../components/SettingsPanel';

const Home = () => {
  const { location } = useLocation();
  const { settings } = useSettings();
  
  // Format date consistently
  const today = new Date();
  const formattedDate = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
  
  const { prayerTimes, loading, error, nextPrayer } = useAdhanTimes(
    location.latitude,
    location.longitude,
    formattedDate,
    settings.calculationMethod
  );

  const prayerOrder = [
    'Fajr',
    'Sunrise',
    'Dhuhr',
    'Asr',
    'Maghrib',
    'Isha'
  ];

  // Check if prayer is current
  const isCurrentPrayer = (prayerName) => {
    if (!nextPrayer || !nextPrayer.name) return false;
   
    const currentIndex = prayerOrder.indexOf(nextPrayer.name);
    if (currentIndex <= 0) return false;
   
    return prayerName === prayerOrder[currentIndex - 1];
  };

  return (
    <div className="pb-4">
      <LocationSelector />
      <DateDisplay />
     
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-500">Loading prayer times...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          <p>Error loading prayer times. Please try again.</p>
        </div>
      ) : (
        <>
          <NextPrayer nextPrayer={nextPrayer} />
          <SettingsPanel />
         
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {prayerTimes && prayerTimes.timings && prayerOrder.map((prayer, index) => (
              <PrayerCard
                key={prayer}
                name={prayer}
                time={prayerTimes.timings[prayer]}
                isNext={nextPrayer.name === prayer}
                isCurrent={isCurrentPrayer(prayer)}
              />
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Home;
