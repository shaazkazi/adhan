import axios from 'axios';

const API_BASE_URL = 'https://api.aladhan.com/v1';

export async function fetchPrayerTimes(latitude, longitude, date, method = 2) {
  try {
    const response = await axios.get(`${API_BASE_URL}/timings/${date}`, {
      params: {
        latitude,
        longitude,
        method,
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}

export async function fetchCalendarByCity(city, country, month, year, method = 2) {
  try {
    const response = await axios.get(`${API_BASE_URL}/calendarByCity`, {
      params: {
        city,
        country,
        method,
        month,
        year,
      },
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error fetching calendar:', error);
    throw error;
  }
}

export async function fetchQiblaDirection(latitude, longitude) {
  try {
    const response = await axios.get(`${API_BASE_URL}/qibla/${latitude}/${longitude}`);
    return response.data.data.direction;
  } catch (error) {
    console.error('Error fetching qibla direction:', error);
    throw error;
  }
}

export const calculationMethods = [
  { id: 1, name: 'Muslim World League' },
  { id: 2, name: 'Islamic Society of North America (ISNA)' },
  { id: 3, name: 'Egyptian General Authority of Survey' },
  { id: 4, name: 'Umm al-Qura University, Makkah' },
  { id: 5, name: 'University of Islamic Sciences, Karachi' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran' },
  { id: 12, name: 'Union des organisations islamiques de France' },
  { id: 13, name: 'Majlis Ugama Islam Singapura' },
  { id: 14, name: 'Gulf Region' },
  { id: 15, name: 'Kuwait' },
  { id: 16, name: 'Qatar' },
];
