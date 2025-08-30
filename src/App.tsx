import React, { useState, useEffect } from "react";
import { WeatherData, LocationData } from "./types";
import { calculatePrettyProbability } from "./utils/weatherCalculator";
import {
  getCurrentLocation,
  fetchWeatherData,
  reverseGeocode,
} from "./utils/weatherService";
import { WeatherForm } from "./components/WeatherForm";
import { PredictionDisplay } from "./components/PredictionDisplay";
import { InfoPanel } from "./components/InfoPanel";
import { Sunrise, Sunset } from "lucide-react";

function App() {
  const [weatherData, setWeatherData] = useState<WeatherData>({
    cloudCover: 35,
    cloudType: "cirrus",
    humidity: 50,
    aerosolIndex: 1.5,
    airQualityIndex: 100,
  });

  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(
    null
  );
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationName, setLocationName] = useState<string>();

  const [prediction, setPrediction] = useState(() =>
    calculatePrettyProbability(weatherData, null)
  );

  useEffect(() => {
    setPrediction(calculatePrettyProbability(weatherData, currentLocation));
  }, [weatherData, currentLocation]);

  const handleLocationFetch = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      // Get user's location
      const location: LocationData = await getCurrentLocation();
      setCurrentLocation(location);

      // Fetch weather data for the location
      const weather = await fetchWeatherData(location);

      // Get location name
      const { city, country } = await reverseGeocode(location);
      setLocationName(`${city}, ${country}`);

      // Update weather data
      setWeatherData(weather);
    } catch (error) {
      setLocationError(
        error instanceof Error ? error.message : "Failed to get location data"
      );
    } finally {
      setIsLoadingLocation(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-500 rounded-full filter blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Sunrise size={48} className="text-orange-400" />
            <h1 className="text-5xl font-bold text-white">Sunrise & Sunset</h1>
            <Sunset size={48} className="text-pink-400" />
          </div>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Predict the beauty of your next golden hour with advanced weather
            analysis
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Weather Form */}
          <div className="space-y-6">
            <WeatherForm
              data={weatherData}
              onChange={setWeatherData}
              onLocationFetch={handleLocationFetch}
              isLoadingLocation={isLoadingLocation}
              locationError={locationError}
              locationName={locationName}
            />
            <div className="xl:hidden">
              <PredictionDisplay result={prediction} />
            </div>
          </div>

          {/* Prediction Display - Desktop */}
          <div className="hidden xl:block">
            <PredictionDisplay result={prediction} />
          </div>
        </div>

        {/* Info Panel */}
        <InfoPanel />
      </div>
    </div>
  );
}

export default App;
