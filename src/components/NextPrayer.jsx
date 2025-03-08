import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getTimeRemaining } from '../utils/timeUtils';

const NextPrayer = ({ nextPrayer }) => {
  const [remaining, setRemaining] = useState({ hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    // Debug log to check what data is being received
    console.log("NextPrayer received:", nextPrayer);
    
    if (!nextPrayer || !nextPrayer.time) return;

    const timer = setInterval(() => {
      const timeLeft = getTimeRemaining(nextPrayer.time);
      setRemaining(timeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [nextPrayer]);

  // Added safer check to prevent errors
  if (!nextPrayer || !nextPrayer.time) {
    return null;
  }

  return (
    <motion.div
      className="next-prayer-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-medium text-white opacity-80">Next Prayer</h2>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1.5"></div>
          <span className="text-xs font-medium text-green-400">Coming up</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">{nextPrayer.name}</h3>
          <p className="text-sm opacity-80 mt-1">Time Remaining</p>
        </div>
        
        <div className="text-right">
          <div className="text-3xl font-medium font-mono tracking-tight">
            {`${remaining.hours.toString().padStart(2, '0')}:${remaining.minutes.toString().padStart(2, '0')}:${remaining.seconds.toString().padStart(2, '0')}`}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NextPrayer;
