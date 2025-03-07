import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function PageTransitionManager({ children }) {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  useEffect(() => {
    // Start transition
    setIsTransitioning(true);
    
    // Create overlay during transition
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'var(--color-bg-primary)';
    overlay.style.zIndex = '9999';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    overlay.style.transition = 'opacity 200ms ease';
    document.body.appendChild(overlay);
    
    // Tiny timeout to allow the DOM to update
    setTimeout(() => {
      overlay.style.opacity = '0.5';
      
      // After transition completes
      setTimeout(() => {
        overlay.style.opacity = '0';
        setIsTransitioning(false);
        
        // Remove overlay when done
        setTimeout(() => {
          document.body.removeChild(overlay);
        }, 200);
      }, 200);
    }, 10);
    
    return () => {
      // Clean up if component unmounts during transition
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
    };
  }, [location.pathname]);
  
  return children;
}

export default PageTransitionManager;
