'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ParticleEffectProps {
  isActive: boolean;
  intensity?: 'low' | 'medium' | 'high';
  color?: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function ParticleEffect({ 
  isActive, 
  intensity = 'medium', 
  color = 'rgba(79, 70, 229, 0.6)' 
}: ParticleEffectProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const particleCount = intensity === 'low' ? 8 : intensity === 'medium' ? 15 : 25;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: 50 + (Math.random() - 0.5) * 20, // Center with some spread
        y: 50 + (Math.random() - 0.5) * 20,
        size: Math.random() * 4 + 2,
        delay: Math.random() * 2,
        duration: Math.random() * 3 + 2
      });
    }

    setParticles(newParticles);

    // Clear particles after animation
    const timer = setTimeout(() => {
      setParticles([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isActive, intensity]);

  if (!isActive || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full opacity-0"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, ${color}, transparent)`,
            boxShadow: `0 0 ${particle.size * 2}px ${color}`
          }}
          initial={{
            scale: 0,
            opacity: 0
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            x: [
              (Math.random() - 0.5) * 100,
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 300
            ],
            y: [
              (Math.random() - 0.5) * 100,
              (Math.random() - 0.5) * 200,
              (Math.random() - 0.5) * 300
            ]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            ease: 'easeOut'
          }}
        />
      ))}
    </div>
  );
}


