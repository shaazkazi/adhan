import { useState } from 'react';
import { FaCog, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';
import { calculationMethods } from '../services/adhanService';

const SettingsPanel = () => {
  const { settings, updateSettings } = useSettings();
  const [expanded, setExpanded] = useState(false);

  const handleTimeFormatChange = (format) => {
    updateSettings({ timeFormat: format });
  };

  const handleCalculationMethodChange = (e) => {
    updateSettings({ calculationMethod: parseInt(e.target.value) });
  };

  return (
    <motion.div
      className="settings-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <FaCog className="text-accent mr-3" />
          <h3 className="font-medium">Quick Settings</h3>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronRight className="text-text-tertiary" />
        </motion.div>
      </div>

      {expanded && (
        <motion.div
          className="p-4 pt-0 border-t border-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="mb-4">
            <p className="text-sm text-text-secondary mb-2">Time Format</p>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded-lg text-sm ${
                  settings.timeFormat === '12h'
                    ? 'bg-accent bg-opacity-20 text-accent'
                    : 'bg-bg-elevated text-text-secondary'
                }`}
                onClick={() => handleTimeFormatChange('12h')}
              >
                12 Hour
              </button>
              <button
                className={`px-3 py-1 rounded-lg text-sm ${
                  settings.timeFormat === '24h'
                    ? 'bg-accent bg-opacity-20 text-accent'
                    : 'bg-bg-elevated text-text-secondary'
                }`}
                onClick={() => handleTimeFormatChange('24h')}
              >
                24 Hour
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-text-secondary mb-2">Calculation Method</p>
            <select
              value={settings.calculationMethod}
              onChange={handleCalculationMethodChange}
              className="w-full p-2 border border-border rounded-lg text-sm bg-bg-elevated text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              {calculationMethods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SettingsPanel;

