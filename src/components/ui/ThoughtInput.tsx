'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ThoughtInputProps {
  onSubmit?: (thought: string) => void;
}

export default function ThoughtInput({ onSubmit }: ThoughtInputProps) {
  const [thought, setThought] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim() && onSubmit) {
      onSubmit(thought.trim());
      setThought('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-lg mx-4 z-20"
    >
      <div className="relative backdrop-blur-2xl bg-slate-800/40 rounded-2xl border border-slate-600/30 shadow-2xl overflow-hidden">
        {/* Glassmorphic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 via-slate-800/30 to-slate-900/40 rounded-2xl"></div>
        
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl"></div>
        
        <form onSubmit={handleSubmit} className="relative p-5">
          {/* Main input area */}
          <div className="mb-4">
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind today?"
              className="w-full bg-transparent text-white placeholder-gray-300 focus:outline-none resize-none text-base font-light min-h-[50px] max-h-[120px] leading-relaxed"
              rows={2}
              style={{ 
                fontFamily: 'Inter, sans-serif',
                lineHeight: '1.5'
              }}
            />
          </div>
          
          {/* Bottom section with drag instruction and submit button */}
          <div className="flex items-center justify-between">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="text-gray-400 text-sm font-light"
            >
              Drag thoughts here to process.
            </motion.p>
            
            <motion.button
              type="submit"
              disabled={!thought.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                thought.trim()
                  ? 'bg-slate-700/60 hover:bg-slate-600/60 text-white shadow-lg border border-slate-500/30'
                  : 'bg-slate-800/40 text-gray-500 cursor-not-allowed border border-slate-700/30'
              }`}
            >
              <motion.span
                animate={isFocused ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-2"
              >
                <span>Submit</span>
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                  />
                </svg>
              </motion.span>
            </motion.button>
          </div>
        </form>
        
        {/* Small circular icon in bottom left */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute -bottom-2 -left-2 w-8 h-8 bg-slate-900/80 border border-slate-600/50 rounded-full flex items-center justify-center"
        >
          <span className="text-white text-sm font-bold">N</span>
        </motion.div>
      </div>
    </motion.div>
  );
}
