import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function PreloadLinks() {
  const location = useLocation();
  
  useEffect(() => {
    // Preload potential next pages
    const routes = ['/', '/qibla', '/settings'];
    
    routes.forEach(route => {
      if (route !== location.pathname) {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      }
    });
  }, []);
  
  return null;
}

export default PreloadLinks;
