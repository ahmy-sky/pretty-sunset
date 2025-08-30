import React from 'react';
import { Info, Sun, Cloud, Droplets, Wind, Eye } from 'lucide-react';

export function InfoPanel() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <Info size={24} className="text-blue-400" />
        <h3 className="text-xl font-bold text-white">What Makes Beautiful Sunrises & Sunsets?</h3>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Cloud size={20} className="text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white mb-1">Cloud Coverage (20-50% ideal)</h4>
            <p className="text-sm text-white/70">
              Clouds act as a canvas for colors. Too few and there's nothing to illuminate; too many and they block the light.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Sun size={20} className="text-yellow-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white mb-1">Cloud Types</h4>
            <p className="text-sm text-white/70">
              Cirrus clouds create dramatic wispy patterns, while thick stratus clouds can block the spectacle entirely.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Droplets size={20} className="text-blue-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white mb-1">Humidity (30-70% ideal)</h4>
            <p className="text-sm text-white/70">
              Moderate humidity provides optimal light scattering without obscuring the view.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Wind size={20} className="text-purple-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white mb-1">Aerosols</h4>
            <p className="text-sm text-white/70">
              Small particles in the air scatter light to create vibrant colors, but too many can dim the display.
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Eye size={20} className="text-green-400 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white mb-1">Air Quality</h4>
            <p className="text-sm text-white/70">
              Moderately poor air quality can enhance colors through particle scattering, but very poor quality obscures the view.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}