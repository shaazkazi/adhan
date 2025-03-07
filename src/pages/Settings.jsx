import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCog, FaBell, FaMoon, FaGlobe, FaInfoCircle } from 'react-icons/fa';
import { useSettings } from '../contexts/SettingsContext';
import { calculationMethods } from '../services/adhanService';

const Settings = () => {
  const { settings, updateSettings, updateAdjustment } = useSettings();
  const [activeSection, setActiveSection] = useState(null);

  const handleTimeFormat = (format) => {
    updateSettings({ timeFormat: format });
  };

  const handleCalculationMethodChange = (method) => {
    updateSettings({ calculationMethod: parseInt(method) });
  };

  const handleThemeChange = (theme) => {
    updateSettings({ theme });
  };

  const handleLanguageChange = (language) => {
    updateSettings({ language });
  };

  const handleNotificationToggle = () => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        enabled: !settings.notifications.enabled
      }
    });
  };

  const handleNotificationTimeChange = (minutes) => {
    updateSettings({
      notifications: {
        ...settings.notifications,
        beforePrayer: parseInt(minutes)
      }
    });
  };

  return (
    <motion.div
      className="pb-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-4">
        <h2 className="p-4 font-bold text-lg border-b border-gray-100">Settings</h2>
        
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
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100'
              }`}
            >
              12 Hour
            </button>
            <button
              onClick={() => handleTimeFormat('24h')}
              className={`px-4 py-2 rounded-lg ${
                settings.timeFormat === '24h'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100'
              }`}
            >
              24 Hour
            </button>
          </div>
        </SettingSection>
        
        {/* Notifications */}
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
            
            {settings.notifications.enabled && (
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
            )}
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
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`px-4 py-2 rounded-lg ${
                settings.theme === 'dark'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100'
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
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleLanguageChange('ar')}
              className={`px-4 py-2 rounded-lg ${
                settings.language === 'ar'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100'
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
            <p>Prayer times powered by AlAdhan.com API.</p>
          </div>
        </SettingSection>
      </div>
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

// Need to define FaClock since it was used in the component
const FaClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
      <path d="M256 512C114.6 512 0 397.4 0 256S114.6 0 256 0S512 114.6 512 256s-114.6 256-256 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 239.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" fill="currentColor"/>
    </svg>
  );
  
  export default Settings;
  