import { useState } from 'react';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLocation } from '../contexts/LocationContext';
import axios from 'axios';

const LocationSelector = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const { location, setManualLocation, useCurrentLocation } = useLocation();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: searchQuery,
          format: 'json',
          addressdetails: 1,
          limit: 5
        }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching for location:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectLocation = (result) => {
    const city = result.address.city || result.address.town || result.address.village || result.address.hamlet || '';
    const country = result.address.country || '';
    
    setManualLocation(
      city,
      country,
      parseFloat(result.lat),
      parseFloat(result.lon)
    );
    
    setShowSearch(false);
    setSearchResults([]);
    setSearchQuery('');
  };

  return (
    <div className="mb-4">
      <motion.div
        className="location-selector"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <FaMapMarkerAlt className="text-primary-500" />
        <div className="flex-1">
          {location.city && location.country ? (
            <p className="text-sm">{`${location.city}, ${location.country}`}</p>
          ) : (
            <p className="text-sm text-gray-400">Finding your location...</p>
          )}
        </div>
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="text-primary-600 text-sm font-medium"
        >
          Change
        </button>
      </motion.div>

      {showSearch && (
        <motion.div
          className="bg-white rounded-xl p-4 shadow-md mt-2"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <form onSubmit={handleSearch} className="flex mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city..."
              className="flex-1 px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="bg-primary-600 text-white px-4 rounded-r-lg"
              disabled={isSearching}
            >
              {isSearching ? '...' : <FaSearch />}
            </button>
          </form>

          {searchResults.length > 0 && (
            <div className="max-h-60 overflow-auto">
              {searchResults.map((result) => {
                const city = result.address.city || result.address.town || result.address.village || result.address.hamlet || '';
                const country = result.address.country || '';
                const displayName = city ? `${city}, ${country}` : result.display_name;
                
                return (
                  <div
                    key={result.place_id}
                    className="py-2 px-3 hover:bg-gray-100 cursor-pointer rounded-lg"
                    onClick={() => selectLocation(result)}
                  >
                    <p className="text-sm font-medium">{displayName}</p>
                    <p className="text-xs text-gray-500">{result.display_name}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-3 flex justify-between">
            <button
              onClick={() => {
                setShowSearch(false);
                setSearchResults([]);
              }}
              className="text-gray-500 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={useCurrentLocation}
              className="text-primary-600 text-sm font-medium"
            >
              Use Current Location
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LocationSelector;
