import { differenceInMilliseconds, addSeconds, format } from 'date-fns';

// Format time based on user preference (12h or 24h)
export function formatTime(timeString, timeFormat = '12h') {
  if (!timeString) return '';
  
  const [hours, minutes] = timeString.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0);
  
  if (timeFormat === '24h') {
    return format(date, 'HH:mm');
  } else {
    return format(date, 'h:mm a');
  }
}

// Get time remaining until next prayer
export function getTimeRemaining(targetDate) {
  if (!targetDate) return { hours: 0, minutes: 0, seconds: 0 };
  
  const now = new Date();
  let diffMs = differenceInMilliseconds(targetDate, now);
  
  if (diffMs < 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }
  
  // Convert to seconds
  let diffSeconds = Math.floor(diffMs / 1000);
  
  const hours = Math.floor(diffSeconds / 3600);
  diffSeconds %= 3600;
  
  const minutes = Math.floor(diffSeconds / 60);
  const seconds = diffSeconds % 60;
  
  return { hours, minutes, seconds };
}

// Format the remaining time as a string
export function formatRemainingTime(timeObj) {
  const { hours, minutes, seconds } = timeObj;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

// Get prayer time color based on prayer name
export function getPrayerColor(prayerName) {
  const colors = {
    Fajr: 'var(--prayer-bg-fajr)',
    Sunrise: 'var(--prayer-bg-sunrise)',
    Dhuhr: 'var(--prayer-bg-dhuhr)',
    Asr: 'var(--prayer-bg-asr)',
    Maghrib: 'var(--prayer-bg-maghrib)',
    Isha: 'var(--prayer-bg-isha)',
  };
  
  return colors[prayerName] || 'linear-gradient(to right, #3a7bd5, #3a6073)';
}

// Check if a prayer time is the current prayer
export function isCurrentPrayer(prayerTime, nextPrayerTime) {
  if (!prayerTime || !nextPrayerTime) return false;
  
  const now = new Date();
  const prayerDate = new Date(prayerTime);
  
  return prayerDate <= now && nextPrayerTime > now;
}
