import { motion } from 'framer-motion';
import Header from './Header';
import Navigation from './Navigation';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="app-container">
        <Header />
        
        <motion.main
          className="mb-16" // Space for the navigation bar
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.main>
      </div>
      
      <Navigation />
    </div>
  );
};

export default Layout;
