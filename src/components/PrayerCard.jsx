import { motion } from 'framer-motion';
import { formatTime } from '../utils/timeUtils';
import { useSettings } from '../contexts/SettingsContext';

const PrayerCard = ({ name, time, isNext, isCurrent }) => {
  const { settings } = useSettings();
  
  // More elegant prayer icons (using SF Symbols style descriptions)
  const getPrayerIcon = (prayerName) => {
    switch (prayerName) {
      case 'Fajr':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V4M5.5 6.5L6.5 7.5M18.5 6.5L17.5 7.5M19 12H20M4 12H5M12 18.5V21" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 14C17 10.134 14.866 7 11 7C7.13401 7 5 10.134 5 14H17Z" 
                  stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Sunrise':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V6M5.5 6.5L7.5 8.5M18.5 6.5L16.5 8.5M19 12H16M8 12H5M3 18H21M5 15H19" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 15C17 11.134 14.866 8 11 8C7.13401 8 5 11.134 5 15H17Z" 
                  stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Dhuhr':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 3V5M12 19V21M3 12H5M19 12H21M5.5 5.5L7 7M16.5 16.5L18 18M18 7L16.5 5.5M7 16.5L5.5 18" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      case 'Asr':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3V6M19 12H16M8 12H5" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7" 
                  stroke="currentColor" strokeWidth="2"/>
            <path d="M16 12H8M8 12L8 18L12 20L16 18L16 12" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'Maghrib':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 18H21M5 15H19" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 3V6M18.5 6.5L16.5 8.5M5.5 6.5L7.5 8.5M19 12H16M8 12H5" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M17 15C17 11.134 14.866 8 11 8C7.13401 8 5 11.134 5 15H17Z" 
                  stroke="currentColor" strokeWidth="2"/>
          </svg>
        );
      case 'Isha':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z" 
                  stroke="currentColor" strokeWidth="2"/>
            <path d="M15.5 9C15.5 9 13.5 11 12 11C10.5 11 8.5 9 8.5 9" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M8.5 15H15.5" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        );
      default:
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 22H20M12 2V4M19.07 4.93L17.66 6.34M22 12H20M17.66 17.66L19.07 19.07M6.34 6.34L4.93 4.93M4 12H2M6.34 17.66L4.93 19.07M12 6C8.69 6 6 8.69 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6Z" 
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  // Get the appropriate background style for the prayer
  const getCardBackground = (prayerName) => {
    const bgVarName = `--prayer-bg-${prayerName.toLowerCase()}`;
    return { background: `var(${bgVarName})` };
  };

  return (
    <motion.div
      className={`prayer-card ${isNext ? 'next' : ''} ${isCurrent ? 'active' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      // Remove hover scale effect to prevent pop
    >
      <div className="prayer-card-inner" style={getCardBackground(name)}>
        <div className="flex items-center">
          <div className="mr-4 text-white opacity-90">
            {getPrayerIcon(name)}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            {isNext && (
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-medium">Next</span>
            )}
            {isCurrent && (
              <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full font-medium">Current</span>
            )}
          </div>
        </div>
        <div className="text-right">
          <h3 className="font-bold text-xl">{formatTime(time, settings.timeFormat)}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default PrayerCard;
