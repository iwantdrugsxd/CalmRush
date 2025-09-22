'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ThoughtType {
  id: string;
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  position: [number, number, number];
  isResolved: boolean;
  solution: string | null;
}

interface SolutionInterfaceProps {
  thought: ThoughtType;
  onResolve: (thoughtId: string, solution: string) => void;
  onClose: () => void;
}

export default function SolutionInterface({ thought, onResolve, onClose }: SolutionInterfaceProps) {
  const [solution, setSolution] = useState(thought.solution || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResolve = async () => {
    if (!solution.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onResolve(thought.id, solution.trim());
    setIsSubmitting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleResolve();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 50 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Main Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="relative w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Process Your Thought
              </h2>
              <p className="text-gray-300 text-sm">
                Take a moment to reflect and find your solution
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Thought Display */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start space-x-3">
            <div className={`w-3 h-3 rounded-full mt-2 ${
              thought.sentiment === 'positive' ? 'bg-green-400' :
              thought.sentiment === 'negative' ? 'bg-red-400' : 'bg-gray-400'
            }`} />
            <div className="flex-1">
              <p className="text-white text-lg leading-relaxed">
                &ldquo;{thought.text}&rdquo;
              </p>
              <p className="text-gray-400 text-sm mt-2 capitalize">
                {thought.sentiment} sentiment
              </p>
            </div>
          </div>
        </div>

        {/* Solution Input */}
        <div className="p-6">
          <label className="block text-white font-medium mb-3">
            What&apos;s your solution or resolution?
          </label>
          <textarea
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Write your thoughts, insights, or action plan here..."
            className="w-full h-32 p-4 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none"
          />
          <p className="text-gray-400 text-xs mt-2">
            Press Cmd+Enter (or Ctrl+Enter) to resolve
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 bg-white/5 flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClose}
            className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleResolve}
            disabled={!solution.trim() || isSubmitting}
            className={`px-8 py-3 rounded-xl font-medium transition-all ${
              solution.trim() && !isSubmitting
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Resolving...</span>
              </div>
            ) : (
              'Resolve Thought'
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
