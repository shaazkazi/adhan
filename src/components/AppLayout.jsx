import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import BottomNav from './BottomNav';

const AppLayout = () => {
  const location = useLocation();
  const [isChangingPage, setIsChangingPage] = useState(false);
  
  // Prevent flash by controlling transitions
  useEffect(() => {
    setIsChangingPage(true);
    const timer = setTimeout(() => setIsChangingPage(false), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="flex-1"
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
      <BottomNav />
    </div>
  );
};

export default AppLayout;
