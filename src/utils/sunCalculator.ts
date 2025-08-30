import { LocationData } from "../types";

// Calculate sunrise and sunset times using astronomical formulas
export function calculateSunTimes(
  location: LocationData,
  date: Date = new Date()
) {
  const { latitude, longitude } = location;

  // Convert to radians
  const lat = (latitude * Math.PI) / 180;
  const lon = (longitude * Math.PI) / 180;

  // Day of year
  const dayOfYear = Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000
  );

  // Solar declination
  const declination = 0.4095 * Math.sin(0.016906 * (dayOfYear - 80.086));

  // Hour angle
  const hourAngle = Math.acos(-Math.tan(lat) * Math.tan(declination));

  // Time correction for longitude
  const timeCorrection = (longitude / 15) * 60; // minutes

  // Equation of time (approximation)
  const equationOfTime = 4 * (longitude - 15 * Math.round(longitude / 15));

  // Calculate sunrise and sunset in minutes from midnight UTC
  const sunriseMinutes =
    720 - 4 * (longitude + (hourAngle * 180) / Math.PI) - equationOfTime;
  const sunsetMinutes =
    720 - 4 * (longitude - (hourAngle * 180) / Math.PI) - equationOfTime;

  // Convert to local time
  const timezoneOffset = date.getTimezoneOffset();

  const sunrise = new Date(date);
  sunrise.setHours(0, sunriseMinutes - timezoneOffset, 0, 0);

  const sunset = new Date(date);
  sunset.setHours(0, sunsetMinutes - timezoneOffset, 0, 0);

  return { sunrise, sunset };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function getNextSunEvent(location: LocationData) {
  const now = new Date();
  const { sunrise, sunset } = calculateSunTimes(location, now);

  // Determine which event is next
  if (now < sunrise) {
    return {
      sunrise: formatTime(sunrise),
      sunset: formatTime(sunset),
      nextEvent: "sunrise" as const,
      nextEventTime: formatTime(sunrise),
    };
  } else if (now < sunset) {
    return {
      sunrise: formatTime(sunrise),
      sunset: formatTime(sunset),
      nextEvent: "sunset" as const,
      nextEventTime: formatTime(sunset),
    };
  } else {
    // After sunset, show tomorrow's sunrise
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const { sunrise: tomorrowSunrise } = calculateSunTimes(location, tomorrow);

    return {
      sunrise: formatTime(sunrise),
      sunset: formatTime(sunset),
      nextEvent: "sunrise" as const,
      nextEventTime: formatTime(tomorrowSunrise),
    };
  }
}
