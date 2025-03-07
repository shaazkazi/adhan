import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCompass, FaMapMarkerAlt } from 'react-icons/fa';
import { useLocation } from '../contexts/LocationContext';
import { fetchQiblaDirection } from '../services/adhanService';

const Qibla = () => {
  const { location } = useLocation();
  const [qiblaDirection, setQiblaDirection] = useState(null);
  const [compassHeading, setCompassHeading] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasCompass, setHasCompass] = useState(false);

  useEffect(() => {
    // Check if device has compass (DeviceOrientationEvent)
    if (window.DeviceOrientationEvent) {
      setHasCompass(true);
      
      // Request permission for iOS devices
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        document.getElementById('compass-permission').style.display = 'block';
      } else {
        // Start listening to device orientation for Android and other devices
        window.addEventListener('deviceorientation', handleOrientation);
      }
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  // Function to request iOS permission
  const requestCompassPermission = async () => {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      if (permission === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation);
        document.getElementById('compass-permission').style.display = 'none';
      } else {
        setError('Permission to access compass was denied');
      }
    } catch (err) {
      setError('Error accessing compass: ' + err.message);
    }
  };

  // Handle device orientation change
  const handleOrientation = (event) => {
    // For iOS devices
    let heading = event.webkitCompassHeading || 
    // For Android devices
    (event.alpha ? 360 - event.alpha : 0);
    
    setCompassHeading(heading);
  };

  useEffect(() => {
    const getQiblaDirection = async () => {
      if (!location.latitude || !location.longitude) return;

      setLoading(true);
      try {
        const direction = await fetchQiblaDirection(location.latitude, location.longitude);
        setQiblaDirection(direction);
        setError(null);
      } catch (err) {
        setError('Failed to fetch Qibla direction');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getQiblaDirection();
  }, [location.latitude, location.longitude]);

  // Calculate the rotation for the Qibla pointer
  const calculateQiblaRotation = () => {
    if (qiblaDirection === null) return 0;
    return qiblaDirection - compassHeading;
  };

  return (
    <div className="pb-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4 p-4">
        <h2 className="font-bold text-lg mb-4 text-center">Qibla Direction</h2>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-500">Finding Qibla direction...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
            <p>{error}</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="location-info flex items-center justify-center mb-4">
              <FaMapMarkerAlt className="text-primary-500 mr-2" />
              <span className="text-sm">
                {location.city && location.country 
                  ? `${location.city}, ${location.country}` 
                  : 'Current Location'}
              </span>
            </div>
            
            <div className="compass-container relative w-64 h-64 mx-auto mb-8">
  {/* Direction Labels */}
  <div className="compass-direction north">N</div>
  <div className="compass-direction east">E</div>
  <div className="compass-direction south">S</div>
  <div className="compass-direction west">W</div>
  
  {/* Compass */}
  <motion.div
    className="absolute inset-0"
    style={{ transform: `rotate(${-compassHeading}deg)` }}
  >
    <img
      src="/src/assets/compass.svg"
      alt="Compass"
      className="w-full h-full"
    />
  </motion.div>
  
  {/* Qibla Pointer */}
  <motion.div
    className="qibla-pointer"
    style={{ transform: `rotate(${calculateQiblaRotation()}deg)` }}
  >
    <div className="qibla-pointer-inner">
      <div className="qibla-pointer-dot"></div>
      <div className="qibla-pointer-line"></div>
      <div className="qibla-pointer-line bottom"></div>
      <div className="qibla-pointer-dot"></div>
    </div>
  </motion.div>
</div>

            
            <div className="text-center mb-4">
              <p className="text-2xl font-bold">{qiblaDirection ? Math.round(qiblaDirection) : 0}°</p>
              <p className="text-gray-500">from North</p>
            </div>
            
            {hasCompass ? (
              <div className="text-center text-sm text-gray-600">
                <p>Rotate your device to find the Qibla direction.</p>
                <p>Current heading: {Math.round(compassHeading)}°</p>
              </div>
            ) : (
              <div className="text-center text-sm text-gray-600 p-4 bg-yellow-50 rounded-lg">
                <p>Compass not available on your device. The Qibla direction is shown relative to North.</p>
              </div>
            )}
            
            {/* iOS Compass Permission Button (hidden by default) */}
            <div id="compass-permission" style={{ display: 'none' }} className="mt-4">
              <button 
                onClick={requestCompassPermission}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg"
              >
                Enable Compass
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-4">
        <h3 className="font-medium mb-2">About Qibla Direction</h3>
        <p className="text-sm text-gray-600 mb-2">
          The Qibla is the direction that Muslims face during prayer, pointing toward the Kaaba in Mecca, Saudi Arabia.
        </p>
        <p className="text-sm text-gray-600">
          This compass shows the direction of the Qibla from your current location. The pointer indicates the direction you should face for prayer.
        </p>
      </div>
    </div>
  );
};

export default Qibla;
