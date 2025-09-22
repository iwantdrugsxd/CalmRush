'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface EnterMindButtonProps {
  onClick?: () => void;
}

export default function EnterMindButton({ onClick }: EnterMindButtonProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleAuthClick = () => {
    // Navigate to playground page
    window.location.href = '/playground';
    if (onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      onMouseMove={handleMouseMove}
      onClick={handleAuthClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative py-4 px-10 rounded-full font-bold text-xl text-white overflow-hidden group"
      style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(139, 92, 246, 0.5)',
      }}
    >
      {/* Aurora Gradient Hover Effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(236, 72, 153, 0.5) 0%, 
            rgba(34, 197, 94, 0.5) 50%, 
            transparent 70%)`,
        }}
        animate={{
          background: [
            'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.5) 0%, rgba(34, 197, 94, 0.5) 50%, transparent 70%)',
            'radial-gradient(circle at 30% 70%, rgba(34, 197, 94, 0.5) 0%, rgba(59, 130, 246, 0.5) 50%, transparent 70%)',
            'radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.5) 0%, rgba(236, 72, 153, 0.5) 50%, transparent 70%)',
            'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.5) 0%, rgba(34, 197, 94, 0.5) 50%, transparent 70%)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Radial Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(255, 255, 255, 0.2) 0%, 
            transparent 50%)`,
          transform: 'scale(1.5)',
        }}
      />
      
      {/* Button Text */}
      <motion.span
        className="relative z-10"
        whileHover={{ scale: 1.02 }}
      >
        Enter Mind Playground
      </motion.span>
      
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 2,
          ease: 'easeInOut',
        }}
        style={{
          transform: 'skewX(-15deg)',
        }}
      />
    </motion.button>
  );
}
