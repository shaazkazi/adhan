import { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const DateDisplay = () => {
  const [hijriDate, setHijriDate] = useState(null);
  const today = new Date();

  useEffect(() => {
    const fetchHijriDate = async () => {
      try {
        const gregorianDate = format(today, 'dd-MM-yyyy');
        const response = await axios.get(`https://api.aladhan.com/v1/gToH/${gregorianDate}`);
        setHijriDate(response.data.data.hijri);
      } catch (error) {
        console.error('Error fetching Hijri date:', error);
      }
    };

    fetchHijriDate();
  }, []);

  return (
    <motion.div 
      className="hijri-date text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {hijriDate ? (
        <p>{`${hijriDate.day} ${hijriDate.month.en} ${hijriDate.year} AH`}</p>
      ) : (
        <p className="text-gray-400">Loading Islamic date...</p>
      )}
    </motion.div>
  );
};

export default DateDisplay;
