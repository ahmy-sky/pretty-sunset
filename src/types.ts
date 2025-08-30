export interface WeatherData {
  cloudCover: number;
  cloudType: string;
  humidity: number;
  aerosolIndex: number;
  airQualityIndex: number;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export interface WeatherApiResponse {
  current: {
    humidity: number;
    cloud: number;
    condition: {
      text: string;
    };
    air_quality: {
      pm2_5: number;
      pm10: number;
    };
  };
}

export interface PredictionResult {
  probability: number;
  sunTimes?: {
    sunrise: string;
    sunset: string;
    nextEvent: "sunrise" | "sunset";
    nextEventTime: string;
  };
  factors: {
    cloudCover: { score: number; description: string };
    cloudType: { score: number; description: string };
    humidity: { score: number; description: string };
    aerosol: { score: number; description: string };
    airQuality: { score: number; description: string };
  };
}
