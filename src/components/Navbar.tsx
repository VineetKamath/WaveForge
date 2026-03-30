import React from 'react';
import { Layers } from 'lucide-react';

interface Props {
  onExport: () => void;
  onNavigate: (section: string) => void;
}

export function Navbar({ onExport, onNavigate }: Props) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => onNavigate('overview')}
          >
            <Layers className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-xl font-bold text-gray-900 tracking-tight">WaveForge</span>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:space-x-8 items-center">
            <button onClick={() => onNavigate('overview')} className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Overview</button>
            <button onClick={() => onNavigate('analyze')} className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Analyze</button>
            <button onClick={() => onNavigate('simulate')} className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Simulate</button>
            <button 
              onClick={onExport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Export Plan
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
