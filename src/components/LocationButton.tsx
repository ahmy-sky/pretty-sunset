import React, { useState } from 'react';
import { MapPin, Loader2, AlertCircle } from 'lucide-react';

interface LocationButtonProps {
  onLocationFetch: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  locationName?: string;
}

export function LocationButton({ onLocationFetch, isLoading, error, locationName }: LocationButtonProps) {
  return (
    <div className="space-y-3">
      <button
        onClick={onLocationFetch}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {isLoading ? (
          <>
            <Loader2 size={20} className="animate-spin" />
            Fetching Weather...
          </>
        ) : (
          <>
            <MapPin size={20} />
            Use My Location
          </>
        )}
      </button>
      
      {locationName && (
        <div className="text-center">
          <p className="text-sm text-white/80 flex items-center justify-center gap-1">
            <MapPin size={14} />
            {locationName}
          </p>
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
          <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}