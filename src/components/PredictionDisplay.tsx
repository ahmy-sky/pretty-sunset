import React from "react";
import { PredictionResult } from "../types";
import {
  getProbabilityColor,
  getProbabilityGradient,
  getProbabilityMessage,
} from "../utils/weatherCalculator";
import {
  Sunrise,
  Sunset,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
} from "lucide-react";

interface PredictionDisplayProps {
  result: PredictionResult;
}

export function PredictionDisplay({ result }: PredictionDisplayProps) {
  const percentage = Math.round(result.probability * 100);
  const gradientClass = getProbabilityGradient(result.probability);

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sunrise size={32} className="text-orange-400" />
          <h2 className="text-3xl font-bold text-white">Prediction</h2>
        </div>

        <div
          className={`text-6xl font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent mb-2`}
        >
          {percentage}%
        </div>

        <p className="text-lg text-white/90 mb-4">
          {getProbabilityMessage(result.probability)}
        </p>

        {result.sunTimes && (
          <div className="mb-4 p-4 bg-white/5 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock size={20} className="text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Sun Times</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Sunrise size={16} className="text-orange-400" />
                  <span className="text-sm text-white/80">Sunrise</span>
                </div>
                <div className="text-white font-medium">
                  {result.sunTimes.sunrise}
                </div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Sunset size={16} className="text-pink-400" />
                  <span className="text-sm text-white/80">Sunset</span>
                </div>
                <div className="text-white font-medium">
                  {result.sunTimes.sunset}
                </div>
              </div>
            </div>

            <div className="text-center">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                  result.sunTimes.nextEvent === "sunrise"
                    ? "bg-orange-500/20 text-orange-300"
                    : "bg-pink-500/20 text-pink-300"
                }`}
              >
                {result.sunTimes.nextEvent === "sunrise" ? (
                  <Sunrise size={14} />
                ) : (
                  <Sunset size={14} />
                )}
                <span className="text-sm font-medium">
                  Next {result.sunTimes.nextEvent}:{" "}
                  {result.sunTimes.nextEventTime}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${gradientClass} transition-all duration-1000 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-3">
          Contributing Factors:
        </h3>

        {Object.entries(result.factors).map(([key, factor]) => (
          <div
            key={key}
            className="flex items-start gap-3 p-3 bg-white/5 rounded-lg"
          >
            <div className="flex-shrink-0 mt-1">
              {factor.score > 0 ? (
                <TrendingUp size={16} className="text-green-400" />
              ) : factor.score < 0 ? (
                <TrendingDown size={16} className="text-red-400" />
              ) : (
                <Minus size={16} className="text-gray-400" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-white capitalize">
                  {key === "airQuality" ? "Air Quality" : key}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    factor.score > 0
                      ? "bg-green-500/20 text-green-400"
                      : factor.score < 0
                      ? "bg-red-500/20 text-red-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {factor.score > 0 ? "+" : ""}
                  {Math.round(factor.score * 100)}%
                </span>
              </div>
              <p className="text-xs text-white/70">{factor.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
