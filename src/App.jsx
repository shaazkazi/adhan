import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Pages
import Home from './pages/Home';
import Qibla from './pages/Qibla';
import Settings from './pages/Settings';

// Components
import Header from './components/Header';
import { FaMosque, FaCompass, FaCog } from 'react-icons/fa';

// Contexts
import { LocationProvider } from './contexts/LocationContext';
import { SettingsProvider } from './contexts/SettingsContext';

// Main app component
function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <LocationProvider>
          <AppRoot />
        </LocationProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}

// Page transition backdrop to prevent white flash
function PageTransitionBackdrop() {
  const location = useLocation();
  
  useEffect(() => {
    // Add a class to body during transitions to prevent white flash
    document.body.classList.add('page-transitioning');
    
    // Remove class after transition completes
    const timer = setTimeout(() => {
      document.body.classList.remove('page-transitioning');
    }, 300);
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('page-transitioning');
    };
  }, [location.pathname]);
  
  return null;
}

// App root with access to router hooks
function AppRoot() {
  const location = useLocation();
  
  // Determine active tab based on current path
  const getActiveTab = (path) => {
    if (path.startsWith('/qibla')) return 'qibla';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
  };
  
  const activeTab = getActiveTab(location.pathname);
  
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <PageTransitionBackdrop />
      <div className="app-container">
        <Header />
        
        <main className="flex-1 overflow-hidden pb-20">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.2,
                ease: "easeInOut" 
              }}
              className="page-content"
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/qibla" element={<Qibla />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
        
        <nav className="nav-bar">
          <NavButton
            icon={<FaMosque className="text-xl" />}
            label="Home"
            isActive={activeTab === 'home'}
            to="/"
          />
          <NavButton
            icon={<FaCompass className="text-xl" />}
            label="Qibla"
            isActive={activeTab === 'qibla'}
            to="/qibla"
          />
          <NavButton
            icon={<FaCog className="text-xl" />}
            label="Settings"
            isActive={activeTab === 'settings'}
            to="/settings"
          />
        </nav>
      </div>
    </div>
  );
}

// NavButton component - using Link component from react-router
function NavButton({ icon, label, isActive, to }) {
  return (
    <Link
      to={to}
      className={`nav-item ${isActive ? 'active' : ''}`}
      preventScrollReset={true}
    >
      <motion.div 
        whileTap={{ scale: 0.9 }}
        className="flex flex-col items-center"
      >
        <span className="text-xl mb-1">{icon}</span>
        <span className="nav-item-text">{label}</span>
        
        {isActive && (
          <motion.div
            className="h-1 w-4 bg-accent rounded-full mt-1"
            layoutId="navIndicator"
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    </Link>
  );
}

export default App;
