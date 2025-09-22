'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AuroraBackgroundProps {
  children: React.ReactNode;
  variant?: 'aurora' | 'ocean' | 'forest' | 'cosmic';
  intensity?: 'subtle' | 'medium' | 'strong';
}

export default function AuroraBackground({ 
  children, 
  variant = 'aurora', 
  intensity = 'medium' 
}: AuroraBackgroundProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    // Generate floating particles
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  const getBackgroundStyle = () => {
    switch (variant) {
      case 'aurora':
        return {
          background: 'linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #0f0c29)',
          backgroundSize: '400% 400%'
        };
      case 'ocean':
        return {
          background: 'linear-gradient(-45deg, #0c4a6e, #075985, #0369a1, #0284c7)',
          backgroundSize: '400% 400%'
        };
      case 'forest':
        return {
          background: 'linear-gradient(-45deg, #064e3b, #065f46, #047857, #059669)',
          backgroundSize: '400% 400%'
        };
      case 'cosmic':
        return {
          background: 'linear-gradient(-45deg, #1e1b4b, #312e81, #4c1d95, #581c87)',
          backgroundSize: '400% 400%'
        };
      default:
        return {
          background: 'linear-gradient(-45deg, #0f0c29, #302b63, #24243e, #0f0c29)',
          backgroundSize: '400% 400%'
        };
    }
  };

  const getIntensityClass = () => {
    switch (intensity) {
      case 'subtle':
        return 'opacity-30';
      case 'medium':
        return 'opacity-60';
      case 'strong':
        return 'opacity-90';
      default:
        return 'opacity-60';
    }
  };

  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden">
      {/* Dynamic Background */}
      <motion.div
        className={`absolute inset-0 ${getIntensityClass()}`}
        style={getBackgroundStyle()}
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Aurora Light Streaks */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"
            style={{
              top: `${20 + i * 30}%`,
              transform: 'rotate(-15deg)'
            }}
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}



