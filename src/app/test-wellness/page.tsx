'use client';

import { useState } from 'react';
import WellnessCenter from '@/components/WellnessCenter';

export default function TestWellnessPage() {
  const [showWellnessCenter, setShowWellnessCenter] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-8">Wellness Center Test</h1>
        <button
          onClick={() => setShowWellnessCenter(true)}
          className="px-8 py-4 bg-green-500/80 hover:bg-green-600/80 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
        >
          🧘‍♀️ Open Wellness Center
        </button>
        
        <WellnessCenter 
          isOpen={showWellnessCenter} 
          onClose={() => setShowWellnessCenter(false)} 
        />
      </div>
    </div>
  );
}



