import { WeatherData, LocationData } from "../types";

// Environment variables for API keys (fallback to demo for development)
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || "demo";
const GEOCODING_API_KEY = import.meta.env.VITE_GEOCODING_API_KEY || "demo";

const OPENWEATHER_BASE = "https://api.openweathermap.org/data/2.5";
const GEOCODING_BASE = "https://api.opencagedata.com/geocode/v1";

export async function getCurrentLocation(): Promise<LocationData> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = "Location access denied";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
}

function mapWeatherConditionToCloudType(
  weatherId: number,
  description: string
): string {
  // OpenWeatherMap weather condition IDs
  if (weatherId >= 200 && weatherId < 300) {
    return "cumulonimbus"; // Thunderstorm
  } else if (weatherId >= 300 && weatherId < 400) {
    return "nimbostratus"; // Drizzle
  } else if (weatherId >= 500 && weatherId < 600) {
    return "nimbostratus"; // Rain
  } else if (weatherId >= 600 && weatherId < 700) {
    return "stratus"; // Snow
  } else if (weatherId >= 700 && weatherId < 800) {
    return "stratus"; // Atmosphere (fog, haze, etc.)
  } else if (weatherId === 800) {
    return "cirrus"; // Clear sky
  } else if (weatherId > 800) {
    // Clouds
    if (description.includes("few") || description.includes("scattered")) {
      return "cumulus";
    } else if (
      description.includes("broken") ||
      description.includes("overcast")
    ) {
      return "stratus";
    }
    return "cumulus";
  }

  return "cumulus"; // default
}

function calculateAerosolFromVisibility(visibility: number): number {
  // Convert visibility (in meters) to aerosol index (0-5 scale)
  // Lower visibility = higher aerosol content
  if (visibility >= 10000) return 0.5; // Very clear
  if (visibility >= 5000) return 1.0; // Clear
  if (visibility >= 2000) return 2.0; // Moderate
  if (visibility >= 1000) return 3.0; // Poor
  if (visibility >= 500) return 4.0; // Very poor
  return 5.0; // Extremely poor
}

function estimateAQIFromVisibility(
  visibility: number,
  humidity: number
): number {
  // Rough estimation of AQI based on visibility and humidity
  // This is not scientifically accurate but provides a reasonable approximation
  let baseAQI = 50; // Good air quality baseline

  if (visibility < 1000) {
    baseAQI += 150; // Very poor visibility suggests high pollution
  } else if (visibility < 2000) {
    baseAQI += 100;
  } else if (visibility < 5000) {
    baseAQI += 50;
  } else if (visibility < 10000) {
    baseAQI += 25;
  }

  // High humidity can reduce visibility without pollution
  if (humidity > 80) {
    baseAQI = Math.max(50, baseAQI - 30);
  }

  return Math.min(300, Math.max(0, baseAQI));
}

export async function fetchWeatherData(
  location: LocationData
): Promise<WeatherData> {
  try {
    // Try to fetch real weather data
    const weatherResponse = await fetch(
      `${OPENWEATHER_BASE}/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (weatherResponse.ok) {
      const weatherData = await weatherResponse.json();

      return {
        cloudCover: weatherData.clouds?.all || 0,
        cloudType: mapWeatherConditionToCloudType(
          weatherData.weather[0].id,
          weatherData.weather[0].description
        ),
        humidity: weatherData.main?.humidity || 50,
        aerosolIndex: calculateAerosolFromVisibility(
          weatherData.visibility || 10000
        ),
        airQualityIndex: estimateAQIFromVisibility(
          weatherData.visibility || 10000,
          weatherData.main?.humidity || 50
        ),
      };
    } else {
      // Fallback to simulated data if API fails
      console.warn("Weather API failed, using simulated data");
      return generateSimulatedWeatherData(location);
    }
  } catch (error) {
    console.warn("Weather API error, using simulated data:", error);
    return generateSimulatedWeatherData(location);
  }
}

function generateSimulatedWeatherData(location: LocationData): WeatherData {
  // Generate realistic weather data based on location and time
  const now = new Date();
  const hour = now.getHours();
  const season = Math.floor((now.getMonth() + 1) / 3); // 0=winter, 1=spring, 2=summer, 3=fall

  // Base values with some location-based variation
  const latitudeFactor = Math.abs(location.latitude) / 90; // 0-1, higher near poles
  const seasonalHumidity = [40, 55, 70, 50][season]; // Winter, Spring, Summer, Fall

  // Add some randomness but keep it realistic
  const cloudCover = Math.max(
    0,
    Math.min(100, Math.round(30 + Math.random() * 40 + latitudeFactor * 20))
  );
  const humidity = Math.max(
    0,
    Math.min(100, Math.round(seasonalHumidity + (Math.random() - 0.5) * 30))
  );
  const aerosolIndex = Math.max(
    0,
    Math.min(5, Number((1 + Math.random() * 2 + latitudeFactor).toFixed(1)))
  );
  const airQualityIndex = Math.max(
    0,
    Math.min(300, Math.round(50 + Math.random() * 100 + latitudeFactor * 50))
  );

  const cloudTypes = ["cirrus", "cumulus", "stratus"];
  const cloudType = cloudTypes[Math.floor(Math.random() * cloudTypes.length)];

  return {
    cloudCover,
    cloudType,
    humidity,
    aerosolIndex,
    airQualityIndex,
  };
}

export async function reverseGeocode(
  location: LocationData
): Promise<{ city: string; country: string }> {
  try {
    // Try OpenCage Geocoding API first
    const response = await fetch(
      `${GEOCODING_BASE}/json?q=${location.latitude}+${location.longitude}&key=${GEOCODING_API_KEY}&limit=1&no_annotations=1`
    );

    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          city:
            result.components.city ||
            result.components.town ||
            result.components.village ||
            "Unknown",
          country: result.components.country || "Unknown",
        };
      }
    }

    // Fallback to Nominatim (OpenStreetMap) - free but rate limited
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.latitude}&lon=${location.longitude}&zoom=10&addressdetails=1`,
      {
        headers: {
          "User-Agent": "SunriseSunsetPredictor/1.0",
        },
      }
    );

    if (nominatimResponse.ok) {
      const nominatimData = await nominatimResponse.json();
      if (nominatimData.address) {
        return {
          city:
            nominatimData.address.city ||
            nominatimData.address.town ||
            nominatimData.address.village ||
            nominatimData.address.hamlet ||
            "Unknown",
          country: nominatimData.address.country || "Unknown",
        };
      }
    }

    // Final fallback - approximate location based on coordinates
    return approximateLocationFromCoordinates(location);
  } catch (error) {
    console.warn("Geocoding failed, using approximate location:", error);
    return approximateLocationFromCoordinates(location);
  }
}

function approximateLocationFromCoordinates(location: LocationData): {
  city: string;
  country: string;
} {
  // Very rough approximation based on well-known coordinate ranges
  const { latitude, longitude } = location;

  // Major cities and their approximate coordinates
  const majorCities = [
    { lat: 40.7, lon: -74.0, city: "New York", country: "USA" },
    { lat: 51.5, lon: -0.1, city: "London", country: "UK" },
    { lat: 35.7, lon: 139.7, city: "Tokyo", country: "Japan" },
    { lat: 48.9, lon: 2.3, city: "Paris", country: "France" },
    { lat: -33.9, lon: 151.2, city: "Sydney", country: "Australia" },
    { lat: 37.8, lon: -122.4, city: "San Francisco", country: "USA" },
    { lat: 52.5, lon: 13.4, city: "Berlin", country: "Germany" },
    { lat: 43.7, lon: -79.4, city: "Toronto", country: "Canada" },
    { lat: 55.8, lon: -4.3, city: "Glasgow", country: "UK" },
    { lat: 41.9, lon: 12.5, city: "Rome", country: "Italy" },
  ];

  // Find the closest major city
  let closestCity = majorCities[0];
  let minDistance =
    Math.abs(latitude - closestCity.lat) +
    Math.abs(longitude - closestCity.lon);

  for (const city of majorCities) {
    const distance =
      Math.abs(latitude - city.lat) + Math.abs(longitude - city.lon);
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  }

  // If we're reasonably close to a major city, use it
  if (minDistance < 5) {
    return { city: closestCity.city, country: closestCity.country };
  }

  // Otherwise, provide a general region
  if (latitude > 60) return { city: "Northern Region", country: "Arctic" };
  if (latitude < -60) return { city: "Southern Region", country: "Antarctic" };
  if (latitude > 23.5)
    return { city: "Northern City", country: "Northern Hemisphere" };
  if (latitude < -23.5)
    return { city: "Southern City", country: "Southern Hemisphere" };
  return { city: "Tropical City", country: "Equatorial Region" };
}
