import React from 'react';
import { WeatherData } from '../types';
import { Cloud, Droplets, Wind, Eye } from 'lucide-react';
import { LocationButton } from './LocationButton';

interface WeatherFormProps {
  data: WeatherData;
  onChange: (data: WeatherData) => void;
  onLocationFetch: () => Promise<void>;
  isLoadingLocation: boolean;
  locationError: string | null;
  locationName?: string;
}

const cloudTypes = [
  { value: 'cirrus', label: 'Cirrus (Wispy, High)' },
  { value: 'cumulus', label: 'Cumulus (Puffy, White)' },
  { value: 'stratus', label: 'Stratus (Layered, Gray)' },
  { value: 'nimbostratus', label: 'Nimbostratus (Dark, Rain)' },
  { value: 'cumulonimbus', label: 'Cumulonimbus (Storm)' }
];

export function WeatherForm({ 
  data, 
  onChange, 
  onLocationFetch, 
  isLoadingLocation, 
  locationError, 
  locationName 
}: WeatherFormProps) {
  const handleChange = (field: keyof WeatherData, value: string | number) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <Cloud className="text-orange-400" />
        Weather Conditions
      </h2>
      
      <div className="mb-6">
        <LocationButton
          onLocationFetch={onLocationFetch}
          isLoading={isLoadingLocation}
          error={locationError}
          locationName={locationName}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cloud Cover */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90 flex items-center gap-2">
            <Cloud size={16} className="text-blue-400" />
            Cloud Cover: {data.cloudCover}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={data.cloudCover}
            onChange={(e) => handleChange('cloudCover', Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-white/60">
            <span>Clear</span>
            <span>Overcast</span>
          </div>
        </div>

        {/* Cloud Type */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90 flex items-center gap-2">
            <Cloud size={16} className="text-purple-400" />
            Cloud Type
          </label>
          <select
            value={data.cloudType}
            onChange={(e) => handleChange('cloudType', e.target.value)}
            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {cloudTypes.map(type => (
              <option key={type.value} value={type.value} className="bg-gray-800">
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Humidity */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90 flex items-center gap-2">
            <Droplets size={16} className="text-blue-400" />
            Humidity: {data.humidity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={data.humidity}
            onChange={(e) => handleChange('humidity', Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-white/60">
            <span>Dry</span>
            <span>Humid</span>
          </div>
        </div>

        {/* Aerosol Index */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white/90 flex items-center gap-2">
            <Wind size={16} className="text-yellow-400" />
            Aerosol Index: {data.aerosolIndex}
          </label>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={data.aerosolIndex}
            onChange={(e) => handleChange('aerosolIndex', Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-white/60">
            <span>Clean</span>
            <span>Hazy</span>
          </div>
        </div>

        {/* Air Quality Index */}
        <div className="space-y-2 md:col-span-2">
          <label className="block text-sm font-medium text-white/90 flex items-center gap-2">
            <Eye size={16} className="text-green-400" />
            Air Quality Index: {data.airQualityIndex}
          </label>
          <input
            type="range"
            min="0"
            max="300"
            step="10"
            value={data.airQualityIndex}
            onChange={(e) => handleChange('airQualityIndex', Number(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-white/60">
            <span>Excellent (0-50)</span>
            <span>Good (51-100)</span>
            <span>Moderate (101-150)</span>
            <span>Poor (151-200)</span>
            <span>Very Poor (201+)</span>
          </div>
        </div>
      </div>
    </div>
  );
}