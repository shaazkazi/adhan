import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useLocation } from '../contexts/LocationContext';

const Header = () => {
  const { location } = useLocation();
  const today = new Date();
  
  return (
    <header className="app-header">
      <motion.div 
        className="flex items-center" 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent mr-2">
          <path d="M7 21H17M9 7H15M10 17V13.5C10 12.672 10.672 12 11.5 12H12.5C13.328 12 14 12.672 14 13.5V17M12 3L19 5V11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11V5L12 3Z" 
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="text-2xl font-bold text-white">Adhan</h1>
      </motion.div>
      
      <motion.div 
        className="text-right"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p className="text-sm font-medium text-white opacity-80">{format(today, 'EEEE, MMMM d')}</p>
        <p className="text-xs opacity-60 truncate max-w-[150px]">
          {location.city && location.country 
            ? `${location.city}, ${location.country}` 
            : 'Fetching location...'}
        </p>
      </motion.div>
    </header>
  );
};

export default Header;
