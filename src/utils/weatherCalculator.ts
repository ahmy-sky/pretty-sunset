import { WeatherData, PredictionResult } from "../types";
import { getNextSunEvent } from "./sunCalculator";
import { LocationData } from "../types";

export function calculatePrettyProbability(
  data: WeatherData,
  location?: LocationData
): PredictionResult {
  const { cloudCover, cloudType, humidity, aerosolIndex, airQualityIndex } =
    data;

  // Base probability
  let prob = 0.5;

  // Cloud cover influence (ideal 20%-50%)
  let cloudCoverScore = 0;
  let cloudCoverDescription = "";

  if (cloudCover >= 20 && cloudCover <= 50) {
    cloudCoverScore = 0.2;
    cloudCoverDescription = "Perfect cloud coverage for dramatic colors";
    prob += 0.2;
  } else if (cloudCover < 10 || cloudCover > 70) {
    cloudCoverScore = -0.2;
    cloudCoverDescription =
      cloudCover < 10
        ? "Too clear - lacking cloud canvas"
        : "Too cloudy - blocking sunlight";
    prob -= 0.2;
  } else {
    cloudCoverDescription = "Moderate cloud coverage";
  }

  // Cloud type influence
  let cloudTypeScore = 0;
  let cloudTypeDescription = "";

  if (cloudType === "cirrus") {
    cloudTypeScore = 0.15;
    cloudTypeDescription = "Cirrus clouds create beautiful wispy patterns";
    prob += 0.15;
  } else if (cloudType === "stratus" || cloudType === "nimbostratus") {
    cloudTypeScore = -0.15;
    cloudTypeDescription = "Dense clouds may block the spectacle";
    prob -= 0.15;
  } else {
    cloudTypeDescription = "Neutral cloud type for color display";
  }

  // Humidity effect (moderate humidity good, very high or low bad)
  let humidityScore = 0;
  let humidityDescription = "";

  if (humidity >= 30 && humidity <= 70) {
    humidityScore = 0.1;
    humidityDescription = "Optimal humidity for light scattering";
    prob += 0.1;
  } else {
    humidityScore = -0.1;
    humidityDescription =
      humidity < 30
        ? "Too dry - less atmospheric scattering"
        : "Too humid - may obscure colors";
    prob -= 0.1;
  }

  // Aerosol effect (moderate aerosols enhance colors, too high bad)
  let aerosolScore = 0;
  let aerosolDescription = "";

  if (aerosolIndex >= 0.5 && aerosolIndex <= 2.5) {
    aerosolScore = 0.1;
    aerosolDescription = "Perfect aerosol levels enhance color vibrancy";
    prob += 0.1;
  } else if (aerosolIndex > 3.5) {
    aerosolScore = -0.1;
    aerosolDescription = "Too many aerosols may dim the display";
    prob -= 0.1;
  } else {
    aerosolDescription = "Low aerosol levels - clean but less dramatic";
  }

  // Air quality effect (moderate poor air quality adds particles)
  let airQualityScore = 0;
  let airQualityDescription = "";

  if (airQualityIndex >= 50 && airQualityIndex <= 150) {
    airQualityScore = 0.1;
    airQualityDescription = "Moderate air quality enhances color scattering";
    prob += 0.1;
  } else if (airQualityIndex > 200) {
    airQualityScore = -0.1;
    airQualityDescription = "Poor air quality may obscure the view";
    prob -= 0.1;
  } else {
    airQualityDescription = "Very clean air - crisp but less colorful";
  }

  // Clamp probability between 0 and 1
  prob = Math.max(0, Math.min(prob, 1));

  // Calculate sun times if location is provided
  const sunTimes = location ? getNextSunEvent(location) : undefined;

  return {
    probability: prob,
    sunTimes,
    factors: {
      cloudCover: {
        score: cloudCoverScore,
        description: cloudCoverDescription,
      },
      cloudType: { score: cloudTypeScore, description: cloudTypeDescription },
      humidity: { score: humidityScore, description: humidityDescription },
      aerosol: { score: aerosolScore, description: aerosolDescription },
      airQuality: {
        score: airQualityScore,
        description: airQualityDescription,
      },
    },
  };
}

export function getProbabilityColor(probability: number): string {
  if (probability >= 0.8) return "text-orange-500";
  if (probability >= 0.6) return "text-yellow-500";
  if (probability >= 0.4) return "text-blue-500";
  return "text-gray-500";
}

export function getProbabilityGradient(probability: number): string {
  if (probability >= 0.8) return "from-orange-500 to-red-500";
  if (probability >= 0.6) return "from-yellow-500 to-orange-500";
  if (probability >= 0.4) return "from-blue-500 to-purple-500";
  return "from-gray-400 to-gray-600";
}

export function getProbabilityMessage(probability: number): string {
  if (probability >= 0.8) return "Spectacular sunrise/sunset expected!";
  if (probability >= 0.6) return "Great conditions for beautiful colors";
  if (probability >= 0.4) return "Moderate chance of a pretty display";
  return "Basic sunrise/sunset conditions";
}
