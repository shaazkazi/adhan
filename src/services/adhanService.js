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
  { id: 0, name: "Muslim World League", description: "Standard method used by many global organizations" },
  { id: 1, name: "Islamic Society of North America (ISNA)", description: "Used in most of North America" },
  { id: 2, name: "Egyptian General Authority of Survey", description: "Used in Egypt and many African countries" },
  { id: 3, name: "Umm al-Qura University, Makkah", description: "Used in Saudi Arabia" },
  { id: 4, name: "University of Islamic Sciences, Karachi", description: "Used in Pakistan and South Asia" },
  { id: 5, name: "Institute of Geophysics, University of Tehran", description: "Used in Iran and some Shia communities" },
  { id: 7, name: "Union des organisations islamiques de France", description: "Used in France" },
  { id: 8, name: "Majlis Ugama Islam Singapore", description: "Used in Singapore" },
  { id: 9, name: "Gulf Region", description: "Used in Gulf countries" },
  { id: 10, name: "Kuwait", description: "Kuwait's official calculation method" },
  { id: 11, name: "Qatar", description: "Qatar's official calculation method" },
];

