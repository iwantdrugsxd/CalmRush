'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ParticleEffect from './ParticleEffect';
import CircularProgress from './CircularProgress';

interface WellnessCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

type MeditationMode = 'breathing' | 'timer';
type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

export default function WellnessCenter({ isOpen, onClose }: WellnessCenterProps) {
  const [mode, setMode] = useState<MeditationMode>('breathing');
  const [breathingPhase, setBreathingPhase] = useState<BreathingPhase>('inhale');
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingStartTime, setBreathingStartTime] = useState<number | null>(null);
  const [meditationTime, setMeditationTime] = useState(5); // minutes
  const [isMeditating, setIsMeditating] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [alarmAudio, setAlarmAudio] = useState<HTMLAudioElement | null>(null);
  const [showAlarmNotification, setShowAlarmNotification] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const meditationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Breathing exercise phases and durations
  const breathingPhases = {
    inhale: { duration: 4000, instruction: 'Breathe In' },
    hold: { duration: 7000, instruction: 'Hold' },
    exhale: { duration: 8000, instruction: 'Breathe Out' },
    pause: { duration: 2000, instruction: 'Pause' }
  };

  // Breathing exercise functions
  const startBreathing = () => {
    setIsBreathing(true);
    setBreathingPhase('inhale');
    setBreathingStartTime(Date.now());
  };

  const stopBreathing = async () => {
    setIsBreathing(false);
    
    if (breathingStartTime) {
      const duration = (Date.now() - breathingStartTime) / (1000 * 60); // Convert to minutes
      try {
        await fetch('/api/wellness/breathing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ duration: duration })
        });
      } catch (error) {
        console.error('Failed to track breathing session:', error);
      }
    }
    
    setBreathingStartTime(null);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const getBreathingScale = () => {
    switch (breathingPhase) {
      case 'inhale': return 1.3;
      case 'hold': return 1.3;
      case 'exhale': return 1;
      case 'pause': return 1;
      default: return 1;
    }
  };

  const getBreathingInstruction = () => {
    return breathingPhases[breathingPhase].instruction;
  };

  // Breathing cycle effect
  useEffect(() => {
    if (isBreathing) {
      const cycle = () => {
        setBreathingPhase(prev => {
          switch (prev) {
            case 'inhale': return 'hold';
            case 'hold': return 'exhale';
            case 'exhale': return 'pause';
            case 'pause': return 'inhale';
            default: return 'inhale';
          }
        });
      };

      intervalRef.current = setInterval(cycle, breathingPhases[breathingPhase].duration);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isBreathing, breathingPhase]);

  // Meditation timer functions
  const startMeditation = () => {
    setIsMeditating(true);
    setTimeRemaining(meditationTime * 60);
  };

  const stopMeditation = async () => {
    setIsMeditating(false);
    
    if (timeRemaining < meditationTime * 60) {
      const completedDuration = (meditationTime * 60 - timeRemaining) / 60; // Convert to minutes
      try {
        await fetch('/api/wellness/meditation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ duration: completedDuration })
        });
      } catch (error) {
        console.error('Failed to track meditation session:', error);
      }
    }
    
    if (meditationIntervalRef.current) {
      clearInterval(meditationIntervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Meditation timer effect
  useEffect(() => {
    if (isMeditating && timeRemaining > 0) {
      meditationIntervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsMeditating(false);
            // Play alarm when timer completes
            if (alarmAudio) {
              alarmAudio.play().catch(console.error);
              setIsAlarmPlaying(true);
              // Show visual notification
              setShowAlarmNotification(true);
              setTimeout(() => setShowAlarmNotification(false), 3000);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (meditationIntervalRef.current) {
        clearInterval(meditationIntervalRef.current);
      }
    };
  }, [isMeditating, timeRemaining, alarmAudio]);

  // Initialize alarm
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Create alarm using the specific audio file
      const alarm = new Audio('/sounds/ambient/wind-up-clock-alarm-bell-64219.mp3');
      alarm.preload = 'auto';
      alarm.volume = 0.7;
      setAlarmAudio(alarm);
    }
  }, []);


  const stopAlarm = () => {
    if (alarmAudio) {
      alarmAudio.pause();
      alarmAudio.currentTime = 0;
      setIsAlarmPlaying(false);
      setShowAlarmNotification(false);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative max-w-2xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ultra-transparent Glass Container */}
        <div className="relative backdrop-blur-2xl bg-white/5 rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/3 via-transparent to-transparent rounded-2xl"></div>
          
          <div className="relative p-6">
            {/* Header */}
            <div className="relative flex justify-between items-center mb-6 p-4 backdrop-blur-xl bg-white/5 rounded-xl border border-white/5">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Your Space</h2>
                <p className="text-slate-300 text-sm">Find your inner peace and tranquility</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors backdrop-blur-sm border border-white/10 rounded-lg hover:bg-white/5"
                >
                  Back to Playground
                </button>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white text-lg transition-all backdrop-blur-sm border border-white/10 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Mode Selection */}
            <div className="flex space-x-2 mb-6 backdrop-blur-xl bg-white/5 rounded-xl p-1 border border-white/5">
              {(['breathing', 'timer'] as MeditationMode[]).map((modeOption) => (
                <button
                  key={modeOption}
                  onClick={() => setMode(modeOption)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all backdrop-blur-sm ${
                    mode === modeOption
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {modeOption === 'breathing' && 'Breathing'}
                  {modeOption === 'timer' && 'Meditation Timer'}
                </button>
              ))}
            </div>

            {/* Breathing Exercise */}
            {mode === 'breathing' && (
              <div className="relative backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/5">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Guided Breathing Exercise</h3>
                  <p className="text-slate-300 text-sm mb-6">
                    Follow the gentle rhythm to find your inner calm
                  </p>
                  
                  {!isBreathing ? (
                    <div className="space-y-6">
                      {/* Organic Orb Container */}
                      <div className="relative w-48 h-48 mx-auto">
                        {/* Outer Glow Ring */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 backdrop-blur-sm animate-pulse"></div>
                        
                        {/* Glass Container */}
                        <div className="absolute inset-4 backdrop-blur-xl bg-white/5 rounded-full border border-white/10">
                          {/* Inner Orb */}
                          <div className="absolute inset-6 rounded-full breathing-orb flex items-center justify-center">
                            <motion.span 
                              className="text-5xl"
                              animate={{ 
                                scale: [1, 1.1, 1],
                                opacity: [0.8, 1, 0.8]
                              }}
                              transition={{ 
                                duration: 3, 
                                repeat: Infinity, 
                                ease: 'easeInOut' 
                              }}
                            >
                              🌬️
                            </motion.span>
                          </div>
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={startBreathing}
                        className="px-8 py-3 backdrop-blur-xl bg-white/10 text-white font-medium rounded-lg transition-all transform hover:scale-105 border border-white/20 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Start Breathing
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Organic Breathing Orb */}
                      <div className="relative w-64 h-64 mx-auto">
                        {/* Particle Effects */}
                        <ParticleEffect 
                          isActive={breathingPhase === 'inhale'} 
                          intensity="medium"
                          color="rgba(79, 70, 229, 0.6)"
                        />
                        
                        {/* Outer Aurora Ring */}
                        <motion.div
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 backdrop-blur-sm"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.1, 0.4, 0.1],
                            rotate: [0, 180, 360]
                          }}
                          transition={{
                            duration: breathingPhases[breathingPhase].duration / 1000,
                            repeat: Infinity,
                            ease: 'easeInOut'
                          }}
                        />
                        
                        {/* Glass Container */}
                        <motion.div
                          className="absolute inset-6 backdrop-blur-xl bg-white/5 rounded-full border border-white/10"
                          animate={{
                            scale: getBreathingScale(),
                          }}
                          transition={{
                            duration: breathingPhases[breathingPhase].duration / 1000,
                            ease: 'easeInOut',
                          }}
                        >
                          {/* Inner Organic Orb */}
                          <div className="absolute inset-6 rounded-full breathing-orb flex items-center justify-center">
                            <motion.span 
                              className="text-6xl"
                              animate={{
                                scale: getBreathingScale(),
                                opacity: [0.8, 1, 0.8]
                              }}
                              transition={{
                                duration: breathingPhases[breathingPhase].duration / 1000,
                                ease: 'easeInOut'
                              }}
                            >
                              {breathingPhase === 'inhale' && '🌬️'}
                              {breathingPhase === 'hold' && '⏸️'}
                              {breathingPhase === 'exhale' && '💨'}
                              {breathingPhase === 'pause' && '✨'}
                            </motion.span>
                          </div>
                        </motion.div>
                      </div>
                      
                      {/* Instruction Panel */}
                      <motion.div
                        key={breathingPhase}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="text-center backdrop-blur-xl bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <p className="text-2xl font-bold text-white mb-2">
                          {getBreathingInstruction()}
                        </p>
                        <p className="text-cyan-300 text-sm">
                          {breathingPhases[breathingPhase].duration / 1000} seconds
                        </p>
                      </motion.div>
                      
                      {/* Stop Button */}
                      <div className="flex justify-center">
                        <motion.button
                          onClick={stopBreathing}
                          className="px-6 py-3 backdrop-blur-xl bg-white/10 text-white font-medium rounded-lg transition-all border border-red-400/20 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Stop
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Meditation Timer */}
            {mode === 'timer' && (
              <div className="relative backdrop-blur-xl bg-white/5 rounded-xl p-6 border border-white/5">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-2">Meditation Timer</h3>
                  <p className="text-slate-300 text-sm mb-6">
                    Set your intention and begin your mindful journey
                  </p>
                  
                  {!isMeditating ? (
                    <div className="space-y-6">
                      {/* Timer Icon */}
                      <div className="relative w-32 h-32 mx-auto">
                        <div className="absolute inset-0 backdrop-blur-xl bg-white/5 rounded-full border border-white/10">
                          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-blue-400/10 to-purple-400/10 backdrop-blur-sm border border-white/20">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-4xl">⏰</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Duration Selector */}
                      <div className="backdrop-blur-xl bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="flex items-center justify-center space-x-4">
                          <label className="text-white text-sm font-medium">Duration:</label>
                          <select
                            value={meditationTime}
                            onChange={(e) => setMeditationTime(Number(e.target.value))}
                            className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                          >
                            {[1, 2, 3, 5, 10, 15, 20, 30].map(min => (
                              <option key={min} value={min}>{min} minutes</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <motion.button
                        onClick={startMeditation}
                        className="px-8 py-3 backdrop-blur-xl bg-white/10 text-white font-medium rounded-lg transition-all transform hover:scale-105 border border-white/20 text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Start Meditation
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Alarm Notification */}
                      {showAlarmNotification && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                        >
                          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 border border-white/20 text-center">
                            <div className="text-6xl mb-4">🔔</div>
                            <h3 className="text-2xl font-bold text-white mb-2">Meditation Complete!</h3>
                            <p className="text-slate-300 mb-4">Your session has ended. Well done!</p>
                            <motion.button
                              onClick={stopAlarm}
                              className="px-6 py-3 backdrop-blur-xl bg-red-500/20 text-white font-medium rounded-lg transition-all border border-red-400/30 text-sm hover:bg-red-500/30"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              Stop Alarm
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                      
                      {/* Circular Progress Timer */}
                      <div className="flex justify-center">
                        <CircularProgress
                          progress={(meditationTime * 60 - timeRemaining) / (meditationTime * 60)}
                          size={200}
                          strokeWidth={8}
                          color="#4f46e5"
                          glowColor="rgba(79, 70, 229, 0.6)"
                        />
                      </div>
                      
                      {/* Time Display */}
                      <div className="backdrop-blur-xl bg-white/5 rounded-lg p-4 border border-white/10">
                        <div className="text-4xl font-bold text-white mb-2 text-center">
                          {formatTime(timeRemaining)}
                        </div>
                        <div className="text-slate-300 text-sm text-center">
                          {meditationTime} minute session
                        </div>
                      </div>
                      
                      {/* Gentle Stop Button */}
                      <div className="flex justify-center">
                        <motion.button
                          onClick={stopMeditation}
                          className="w-12 h-12 backdrop-blur-xl bg-white/10 rounded-full flex items-center justify-center text-white text-lg border border-red-400/20"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ⏹️
                        </motion.button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}


          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}