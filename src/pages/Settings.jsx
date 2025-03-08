import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaCog, FaBell, FaMoon, FaGlobe, FaInfoCircle } from 'react-icons/fa';
import { useSettings } from '../contexts/SettingsContext';
import { calculationMethods } from '../services/adhanService';

const Settings = () => {
  const { settings, updateSettings, updateAdjustment } = useSettings();
  const [activeSection, setActiveSection] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isIOS, setIsIOS] = useState(false);

  // Check device type and notification permission on load
  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
    
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const handleTimeFormat = (format) => {
    updateSettings({ timeFormat: format });
  };

  const handleCalculationMethodChange = (method) => {
    updateSettings({ calculationMethod: parseInt(method) });
  };

  const handleThemeChange = (theme) => {
    updateSettings({ theme });
    showToast(`${theme.charAt(0).toUpperCase() + theme.slice(1)} theme applied`);
  };

  const handleLanguageChange = (language) => {
    updateSettings({ language });
    showToast(`Language changed to ${language === 'en' ? 'English' : 'Arabic'}`);
  };

  const handleNotificationToggle = () => {
    if (!settings.notifications.enabled) {
      // Enabling notifications - check permission
      requestNotificationPermission();
    } else {
      // Disabling notifications
      updateSettings({
        notifications: {
          ...settings.notifications,
          enabled: false
        }
      });
      showToast('Notifications disabled');
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      showToast('Notifications not supported in this browser');
      return;
    }

    try {
      // For iOS PWA, we can't request permission directly
      if (isIOS && window.navigator.standalone) {
        updateSettings({
          notifications: {
            ...settings.notifications,
            enabled: true
          }
        });
        showToast('Notification settings updated for iOS');
        return;
      }

      if (Notification.permission === 'granted') {
        // Already have permission
        updateSettings({
          notifications: {
            ...settings.notifications,
            enabled: true
          }
        });
        registerServiceWorker();
        showToast('Notifications enabled');
        return;
      }

      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        
        if (permission === 'granted') {
          updateSettings({
            notifications: {
              ...settings.notifications,
              enabled: true
            }
          });
          registerServiceWorker();
          showToast('Notifications enabled');
        } else {
          showToast('Notification permission denied');
        }
      } else {
        // Permission already denied
        showToast('Please enable notifications in browser settings');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
      showToast('Error enabling notifications');
    }
  };

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        console.log('Service Worker registered with scope:', registration.scope);
        
        // Schedule notification for testing if needed
        /*
        if (registration.active) {
          registration.active.postMessage({
            type: 'SCHEDULE_NOTIFICATION',
            payload: {
              title: 'Prayer Reminder',
              body: 'This is a test prayer notification',
              time: new Date(Date.now() + 10000).getTime() // 10 seconds from now
            }
          });
        }
        */
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  };

  const handleNotificationTimeChange = (minutes) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        beforePrayer: parseInt(minutes)
      }
    });
    showToast(`Notifications will be sent ${minutes} minutes before prayer`);
  };

  // With this:
const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const sendTestNotification = () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      showToast('Notification permission not granted');
      return;
    }

    try {
      new Notification('Adhaan - Prayer Reminder', {
        body: 'This is a test notification from Adhaan app',
        icon: '/adhaan.png'
      });
      showToast('Test notification sent');
    } catch (error) {
      console.error('Error sending test notification:', error);
      showToast('Error sending test notification');
    }
  };

  return (
    <motion.div
      className="pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toast notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            className="fixed bottom-20 left-0 right-0 mx-auto w-4/5 max-w-sm bg-bg-card text-text-primary p-3 rounded-lg shadow-md border border-border z-50 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
        <h2 className="p-4 font-bold text-lg border-b border-gray-100">Settings</h2>
        
        {/* Notifications - Moved to top for importance */}
        <SettingSection
          icon={<FaBell />}
          title="Notifications"
          isActive={activeSection === 'notifications'}
          onClick={() => setActiveSection(activeSection === 'notifications' ? null : 'notifications')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Enable Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.enabled}
                  onChange={handleNotificationToggle}
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
            
            {permissionStatus === 'denied' && (
              <div className="bg-red-50 p-3 rounded-lg text-sm text-red-600">
                Notification permission denied. Please enable notifications in your browser settings.
                {isIOS && (
                  <div className="mt-2">
                    For iOS: Go to Settings → Notifications → Safari → Allow Notifications
                  </div>
                )}
              </div>
            )}
            
            {settings.notifications.enabled && (
              <>
                <div>
                  <p className="mb-2 text-sm">Notify before prayer:</p>
                  <select
                    value={settings.notifications.beforePrayer}
                    onChange={(e) => handleNotificationTimeChange(e.target.value)}
                    className="w-full p-2 border rounded-lg"
                  >
                    <option value="5">5 minutes</option>
                    <option value="10">10 minutes</option>
                    <option value="15">15 minutes</option>
                    <option value="20">20 minutes</option>
                    <option value="30">30 minutes</option>
                  </select>
                </div>

                {!isIOS && Notification.permission === 'granted' && (
                  <button
                    onClick={sendTestNotification}
                    className="w-full p-2 bg-primary-100 text-primary-700 rounded-lg"
                  >
                    Send Test Notification
                  </button>
                )}
                
                {isIOS && (
                  <div className="mt-2 text-xs text-gray-500">
                    For the best experience on iOS, please add this app to your home screen 
                    by tapping the share button and selecting "Add to Home Screen".
                  </div>
                )}
              </>
            )}
          </div>
        </SettingSection>
        
        {/* Calculation Method */}
        <SettingSection
          icon={<FaCog />}
          title="Calculation Method"
          isActive={activeSection === 'calculation'}
          onClick={() => setActiveSection(activeSection === 'calculation' ? null : 'calculation')}
        >
          <div className="space-y-2">
            {calculationMethods.map((method) => (
              <label key={method.id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="calculationMethod"
                  value={method.id}
                  checked={settings.calculationMethod === method.id}
                  onChange={(e) => handleCalculationMethodChange(e.target.value)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <span>{method.name}</span>
              </label>
            ))}
          </div>
        </SettingSection>
        
        {/* Prayer Time Adjustments */}
        <SettingSection
          icon={<FaCog />}
          title="Prayer Time Adjustments"
          isActive={activeSection === 'adjustments'}
          onClick={() => setActiveSection(activeSection === 'adjustments' ? null : 'adjustments')}
        >
          <div className="space-y-3">
            {Object.keys(settings.adjustments).map((prayer) => (
              <div key={prayer} className="flex justify-between items-center">
                <span className="capitalize">{prayer}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateAdjustment(prayer, settings.adjustments[prayer] - 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{settings.adjustments[prayer]}</span>
                  <button
                    onClick={() => updateAdjustment(prayer, settings.adjustments[prayer] + 1)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-2">
              Adjust prayer times in minutes (positive or negative).
            </p>
          </div>
        </SettingSection>
        
        {/* Time Format */}
        <SettingSection
          icon={<FaClock />}
          title="Time Format"
          isActive={activeSection === 'timeFormat'}
          onClick={() => setActiveSection(activeSection === 'timeFormat' ? null : 'timeFormat')}
        >
          <div className="flex space-x-4">
            <button
              onClick={() => handleTimeFormat('12h')}
              className={`px-4 py-2 rounded-lg ${
                settings.timeFormat === '12h'
                  ? 'active'
                  : 'inactive'
              }`}
            >
              12 Hour
            </button>
            <button
              onClick={() => handleTimeFormat('24h')}
              className={`px-4 py-2 rounded-lg ${
                settings.timeFormat === '24h'
                  ? 'active'
                  : 'inactive'
              }`}
            >
              24 Hour
            </button>
          </div>
        </SettingSection>
        
        {/* Theme */}
        <SettingSection
          icon={<FaMoon />}
          title="Theme"
          isActive={activeSection === 'theme'}
          onClick={() => setActiveSection(activeSection === 'theme' ? null : 'theme')}
        >
          <div className="flex space-x-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`px-4 py-2 rounded-lg ${
                settings.theme === 'light'
                  ? 'active'
                  : 'inactive'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`px-4 py-2 rounded-lg ${
                settings.theme === 'dark'
                  ? 'active'
                  : 'inactive'
              }`}
            >
              Dark
            </button>
          </div>
        </SettingSection>
        
        {/* Language */}
        <SettingSection
          icon={<FaGlobe />}
          title="Language"
          isActive={activeSection === 'language'}
          onClick={() => setActiveSection(activeSection === 'language' ? null : 'language')}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleLanguageChange('en')}
              className={`px-4 py-2 rounded-lg ${
                settings.language === 'en'
                  ? 'active'
                  : 'inactive'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('ar')}
              className={`px-4 py-2 rounded-lg ${
                settings.language === 'ar'
                  ? 'active'
                  : 'inactive'
              }`}
            >
              Arabic
            </button>
          </div>
        </SettingSection>
        
        {/* About */}
        <SettingSection
          icon={<FaInfoCircle />}
          title="About"
          isActive={activeSection === 'about'}
          onClick={() => setActiveSection(activeSection === 'about' ? null : 'about')}
        >
          <div className="text-sm text-gray-600">
            <p className="mb-2">Adhan - Prayer Times App</p>
            <p className="mb-2">Version 1.0.0</p>
            <p className="mb-2">Prayer times powered by AlAdhan.com API.</p>
            <a 
              href="https://github.com/yourusername/adhaan-app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:underline"
            >
              GitHub Repository
            </a>
          </div>
        </SettingSection>
      </div>
      
      {/* If you need to create a service worker file, inform the user */}
      {settings.notifications.enabled && 'serviceWorker' in navigator && !navigator.serviceWorker.controller && (
        <div className="text-center mt-4 text-sm text-gray-500">
          Initializing notifications system...
        </div>
      )}
    </motion.div>
  );
};

const SettingSection = ({ icon, title, children, isActive, onClick }) => {
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <div
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center">
          <span className="text-primary-500 mr-3">{icon}</span>
          <span>{title}</span>
        </div>
        <motion.div
          animate={{ rotate: isActive ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaArrowLeft className="transform rotate-180 text-gray-400" />
        </motion.div>
      </div>
      
      {isActive && (
        <motion.div
          className="px-4 pb-4"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
};

// Define FaClock since it was used in the component
const FaClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
    <path d="M256 512C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 239.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" fill="currentColor"/>
  </svg>
);

export default Settings;
