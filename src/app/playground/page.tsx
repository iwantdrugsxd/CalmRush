'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { thoughtService, Thought } from '@/lib/thoughtService';
import { Canvas, useFrame } from '@react-three/fiber';
import { Edges, OrbitControls, Environment, Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import WellnessCenter from '@/components/WellnessCenter';
import AuroraBackground from '@/components/AuroraBackground';
import CloudinaryVideo from '@/components/CloudinaryVideo';

interface FloatingThought extends Thought {
  isDragging: boolean;
  solution?: string;
}

// Process Crystal Component
function ProcessCrystal({ onHoverChange }: { onHoverChange: (hovered: boolean) => void }) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Animation frame - slow, majestic rotation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001; // Slow main rotation
      meshRef.current.rotation.x += 0.0008; // Slightly slower secondary rotation
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      scale={0.6}
      onPointerOver={() => onHoverChange(true)}
      onPointerOut={() => onHoverChange(false)}
    >
      <icosahedronGeometry args={[1, 1]} />
      {/* Faces - invisible with slight opacity for light reflection */}
      <meshStandardMaterial
        color="#FFFFFF"
        transparent
        opacity={0.15}
        roughness={0.2}
        metalness={0.9}
      />
      {/* Edges - glowing wireframe */}
      <Edges
        scale={1}
        threshold={15}
        color="#00FFFF"
      />
    </mesh>
  );
}

// 3D Scene Component
function Scene3D() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Ambient Light - subtle dark blue */}
      <ambientLight intensity={0.2} color="#4a00e0" />
      
      {/* Directional Light - positioned from top-right */}
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      {/* Internal Point Light - key to core glow */}
      <pointLight 
        position={[0, 0, 0]} 
        intensity={isHovered ? 5.0 : 2.0} 
        color="#FF00FF" 
        distance={5}
      />
      
      {/* Process Crystal */}
      <ProcessCrystal onHoverChange={setIsHovered} />
    </>
  );
}

export default function PlaygroundPage() {
  const { user, loading, logout, login } = useAuth();
  const router = useRouter();
  const [thought, setThought] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [floatingThoughts, setFloatingThoughts] = useState<FloatingThought[]>([]);
  const [draggedThought, setDraggedThought] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Drag and drop states for floating thoughts
  const [isDraggingThought, setIsDraggingThought] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [problemText, setProblemText] = useState('');
  const [isOver3DModel, setIsOver3DModel] = useState(false);
  const [draggedThoughtId, setDraggedThoughtId] = useState<string | null>(null);
  const [selectedThoughtText, setSelectedThoughtText] = useState('');
  const [showWellnessCenter, setShowWellnessCenter] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [completedSolutions, setCompletedSolutions] = useState<Array<{problem: string, solution: string}>>([]);
  const [hasShownResetModal, setHasShownResetModal] = useState(false);
  
  // Background music
  const [backgroundMusic, setBackgroundMusic] = useState<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Initialize background music
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const music = new Audio('/sounds/ambient/alarm.mp3');
      music.loop = true;
      music.volume = 0.3; // Low volume for background
      music.preload = 'auto';
      
      // Add event listeners for debugging
      music.addEventListener('play', () => {
        console.log('Music started playing');
        setIsMusicPlaying(true);
      });
      
      music.addEventListener('pause', () => {
        console.log('Music paused');
        setIsMusicPlaying(false);
      });
      
      music.addEventListener('ended', () => {
        console.log('Music ended');
        setIsMusicPlaying(false);
      });
      
      music.addEventListener('error', (e) => {
        console.error('Music error:', e);
      });
      
      setBackgroundMusic(music);
    }
  }, []);

  // Auto-play background music when user enters playground
  useEffect(() => {
    if (backgroundMusic && user && !isMusicPlaying) {
      const playMusic = async () => {
        try {
          await backgroundMusic.play();
          setIsMusicPlaying(true);
        } catch (error) {
          console.log('Background music autoplay prevented:', error);
        }
      };
      playMusic();
    }
  }, [backgroundMusic, user]);

  // Music control function
  const toggleMusic = async () => {
    if (!backgroundMusic) {
      console.log('No background music available');
      return;
    }
    
    try {
      if (isMusicPlaying) {
        backgroundMusic.pause();
        console.log('Music paused');
      } else {
        await backgroundMusic.play();
        console.log('Music playing');
      }
    } catch (error) {
      console.error('Music control error:', error);
      // If the audio file fails, try to reload it
      if (error instanceof Error && (error.name === 'NotSupportedError' || error.name === 'NotAllowedError')) {
        console.log('Audio file not supported, trying to reload...');
        try {
          backgroundMusic.load();
          await backgroundMusic.play();
        } catch (reloadError) {
          console.error('Failed to reload audio:', reloadError);
        }
      }
    }
  };

  // Cleanup music on unmount
  useEffect(() => {
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
      }
    };
  }, [backgroundMusic]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleResetPlayground = async () => {
    try {
      // Save completed solutions to profile/history
      if (completedSolutions.length > 0) {
        await fetch('/api/thoughts/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            solutions: completedSolutions
          })
        });
      }

      // Clear all thoughts from the playground
      setFloatingThoughts([]);
      setShowResetModal(false);
      setCompletedSolutions([]);
      setHasShownResetModal(false); // Reset so modal can appear again in future sessions
      
      // Show success message
      console.log('✅ Playground reset successfully! Solutions saved to profile.');
    } catch (error) {
      console.error('Error resetting playground:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const result = await login(loginData.email, loginData.password);
      
      if (result.success) {
        setShowLoginModal(false);
        setLoginData({ email: '', password: '' });
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (thought.trim() && !isLoading) {
      setIsLoading(true);
      try {
        console.log('Submitting thought:', thought.trim());
        const newThought = await thoughtService.createThought({
          text: thought.trim(),
        });
        
        console.log('Thought created successfully:', newThought);
        setFloatingThoughts(prev => [...prev, { ...newThought, isDragging: false }]);
        setThought('');
        // Reset modal state when new thoughts are added
        setHasShownResetModal(false);
      } catch (error) {
        console.error('Failed to create thought:', error);
        // Show user-friendly error message
        alert(`Failed to create thought: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Fallback to local creation if API fails
        const fallbackThought: FloatingThought = {
          id: Math.random().toString(36).substr(2, 9),
          text: thought.trim(),
          ...thoughtService.getRandomPosition(),
          color: 'blue',
          sentiment: 'neutral',
          createdAt: new Date(),
          isProcessed: false,
          isDragging: false,
        };
        setFloatingThoughts(prev => [...prev, fallbackThought]);
        setThought('');
        // Reset modal state when new thoughts are added
        setHasShownResetModal(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleMouseDown = (thoughtId: string) => {
    setDraggedThought(thoughtId);
    setFloatingThoughts(prev => 
      prev.map(thought => 
        thought.id === thoughtId 
          ? { ...thought, isDragging: true }
          : thought
      )
    );
  };

  const handleMouseUp = async () => {
    if (draggedThought) {
      const thought = floatingThoughts.find(t => t.id === draggedThought);
      if (thought) {
        try {
          await thoughtService.updateThought({
            id: thought.id,
            x: thought.x,
            y: thought.y,
          });
        } catch (error) {
          console.error('Failed to update thought position:', error);
        }
      }
    }
    
    setDraggedThought(null);
    setFloatingThoughts(prev => 
      prev.map(thought => ({ ...thought, isDragging: false }))
    );
  };

  const handleMouseMove = (e: React.MouseEvent, thoughtId: string) => {
    if (draggedThought === thoughtId) {
      setFloatingThoughts(prev => 
      prev.map(thought => 
        thought.id === thoughtId 
            ? { ...thought, x: e.clientX - 100, y: e.clientY - 50 }
          : thought
      )
    );
    }
  };

  // Floating thought drag handlers
  const handleThoughtMouseDown = (e: React.MouseEvent, thoughtId: string, thoughtText: string) => {
    console.log('Thought mouse down - starting drag for thought:', thoughtId);
    setIsDraggingThought(true);
    setDraggedThoughtId(thoughtId);
    setSelectedThoughtText(thoughtText);
    setDragPosition({ x: e.clientX, y: e.clientY });
    e.preventDefault();
    e.stopPropagation();
  };

  const handleThoughtMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDraggingThought) {
      console.log('Thought mouse up - isOver3DModel:', isOver3DModel, 'draggedThoughtId:', draggedThoughtId);
      setIsDraggingThought(false);
      if (isOver3DModel && draggedThoughtId) {
        console.log('Opening problem form for thought:', draggedThoughtId);
        setShowProblemForm(true);
        // Don't reset draggedThoughtId here - keep it for the form
      } else {
        setDraggedThoughtId(null);
      }
      setIsOver3DModel(false);
    }
  };

  const handleProblemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted!', { problemText, draggedThoughtId });
    
    if (problemText.trim() && draggedThoughtId) {
      console.log('Updating thought with solution:', problemText.trim());
      
      try {
        // First, update the thought in the database
        const updateResponse = await fetch('/api/thoughts', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: draggedThoughtId,
            isProcessed: true,
            solution: problemText.trim()
          })
        });

        if (!updateResponse.ok) {
          throw new Error('Failed to update thought in database');
        }

        // Then save to thought history
        await fetch('/api/thoughts/history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            problem: selectedThoughtText,
            solution: problemText.trim()
          })
        });
        
        // Update local state to reflect the changes
        setFloatingThoughts(prev => 
          prev.map(thought => 
            thought.id === draggedThoughtId 
              ? { 
                  ...thought, 
                  isProcessed: true,
                  solution: problemText.trim(),
                  color: 'green',
                  sentiment: 'positive'
                }
              : thought
          )
        );
        
        console.log('Thought updated and saved to history');
        
        // Reset form
        setProblemText('');
        setShowProblemForm(false);
        setSelectedThoughtText('');
        setDraggedThoughtId(null);
      } catch (error) {
        console.error('Failed to submit problem:', error);
        // Fallback to local update if API fails
        setFloatingThoughts(prev => 
          prev.map(thought => 
            thought.id === draggedThoughtId 
              ? { 
                  ...thought, 
                  isProcessed: true,
                  solution: problemText.trim(),
                  color: 'green',
                  sentiment: 'positive'
                }
              : thought
          )
        );
        
        setProblemText('');
        setShowProblemForm(false);
        setSelectedThoughtText('');
        setDraggedThoughtId(null);
      }
    } else {
      console.log('Missing required data:', { problemText: problemText.trim(), draggedThoughtId });
    }
  };

  // Check authentication
  useEffect(() => {
    console.log('Auth check - loading:', loading, 'user:', user);
    if (!loading && !user) {
      console.log('No user found, showing login modal...');
      setShowLoginModal(true);
    }
  }, [loading, user]);

  // Handle URL parameters for login redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('login') === 'required') {
      setShowLoginModal(true);
    }
  }, []);

  // Load thoughts from backend on component mount
  useEffect(() => {
    const loadThoughts = async () => {
      try {
        const thoughts = await thoughtService.getAllThoughts();
        // Ensure processed thoughts are always green
        const processedThoughts = thoughts.map(thought => ({
          ...thought, 
          isDragging: false,
          // Force green color for processed thoughts
          color: thought.isProcessed ? 'green' : thought.color,
          sentiment: thought.isProcessed ? 'positive' : thought.sentiment
        }));
        setFloatingThoughts(processedThoughts);
      } catch (error) {
        console.error('Failed to load thoughts:', error);
        // Fallback to demo thoughts
        const demoThoughts: FloatingThought[] = [
          { 
            id: '1', 
            text: 'Excited for vacation', 
            x: 150, 
            y: 150, 
            color: 'green', 
            sentiment: 'positive',
            createdAt: new Date(),
            isProcessed: false,
            isDragging: false 
          },
          { 
            id: '2', 
            text: 'What if...', 
            x: window.innerWidth - 200, 
            y: 200, 
            color: 'blue', 
            sentiment: 'neutral',
            createdAt: new Date(),
            isProcessed: false,
            isDragging: false 
          },
          { 
            id: '3', 
            text: 'Deadline pressure', 
            x: 100, 
            y: window.innerHeight - 300, 
            color: 'red', 
            sentiment: 'negative',
            createdAt: new Date(),
            isProcessed: false,
            isDragging: false 
          },
          { 
            id: '4', 
            text: 'Forgot birthday', 
            x: window.innerWidth - 250, 
            y: window.innerHeight - 200, 
            color: 'red', 
            sentiment: 'negative',
            createdAt: new Date(),
            isProcessed: false,
            isDragging: false 
          },
        ];
        setFloatingThoughts(demoThoughts);
      }
    };

    loadThoughts();
  }, []);

  // Add floating animation to thoughts
  useEffect(() => {
    const interval = setInterval(() => {
      setFloatingThoughts(prev => 
        prev.map(thought => {
          // Only move if not being dragged and not being dragged to 3D model
          if (thought.isDragging || isDraggingThought) return thought;
          
          // Get screen dimensions
          const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
          const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
          
          // Create more natural floating movement using sine waves
          const time = Date.now() * 0.001; // Convert to seconds
          const thoughtId = parseInt(thought.id.slice(-2), 36) || 1; // Use last 2 chars of ID as seed
          
          // Different movement patterns for each thought
          const moveX = Math.sin(time * 0.5 + thoughtId) * 0.8 + (Math.random() - 0.5) * 0.5;
          const moveY = Math.cos(time * 0.3 + thoughtId) * 0.6 + (Math.random() - 0.5) * 0.5;
          
          let newX = thought.x + moveX;
          let newY = thought.y + moveY;
          
          // Keep thoughts within screen bounds with some padding
          const padding = 100;
          if (newX < padding) newX = padding;
          if (newX > screenWidth - padding) newX = screenWidth - padding;
          if (newY < padding) newY = padding;
          if (newY > screenHeight - padding) newY = screenHeight - padding;
          
          return {
            ...thought,
            x: newX,
            y: newY,
            // Ensure processed thoughts stay green
            color: thought.isProcessed ? 'green' : thought.color,
            sentiment: thought.isProcessed ? 'positive' : thought.sentiment
          };
        })
      );
    }, 50); // Faster update for smoother movement

    return () => clearInterval(interval);
  }, []);

  // Check if all thoughts are processed and show reset modal (only once per session)
  useEffect(() => {
    if (floatingThoughts.length > 0 && !hasShownResetModal) {
      const allProcessed = floatingThoughts.every(thought => thought.isProcessed);
      if (allProcessed && !showResetModal) {
        // Collect all completed solutions
        const solutions = floatingThoughts
          .filter(thought => thought.isProcessed && thought.solution)
          .map(thought => ({
            problem: thought.text,
            solution: thought.solution!
          }));
        
        setCompletedSolutions(solutions);
        setShowResetModal(true);
        setHasShownResetModal(true); // Mark that we've shown the modal
      }
    }
  }, [floatingThoughts, showResetModal, hasShownResetModal]);

  // Global mouse event listeners for smooth thought dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDraggingThought && draggedThoughtId) {
        e.preventDefault();
        setDragPosition({ x: e.clientX, y: e.clientY });
        
        // Update the dragged thought position
        setFloatingThoughts(prev => 
          prev.map(thought => 
            thought.id === draggedThoughtId 
              ? { ...thought, x: e.clientX, y: e.clientY, isDragging: true }
              : thought
          )
        );
        
        // Check if over 3D model area (center of screen)
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
        );
        
        const isOver = distance < 200;
        if (isOver !== isOver3DModel) {
          console.log('Over 3D model:', isOver, 'Distance:', distance);
          setIsOver3DModel(isOver);
        }
      }
    };

    const handleGlobalMouseUp = (e: MouseEvent) => {
      if (isDraggingThought) {
        e.preventDefault();
        console.log('Global mouse up - isOver3DModel:', isOver3DModel, 'draggedThoughtId:', draggedThoughtId);
        
        // Reset the dragged thought's dragging state
        if (draggedThoughtId) {
          setFloatingThoughts(prev => 
            prev.map(thought => 
              thought.id === draggedThoughtId 
                ? { ...thought, isDragging: false }
                : thought
            )
          );
        }
        
        setIsDraggingThought(false);
        if (isOver3DModel && draggedThoughtId) {
          console.log('Opening problem form for thought:', draggedThoughtId);
          setShowProblemForm(true);
          // Keep draggedThoughtId for the form
        } else {
          setDraggedThoughtId(null);
        }
        setIsOver3DModel(false);
      }
    };

    if (isDraggingThought) {
      document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
      document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDraggingThought, isOver3DModel, draggedThoughtId]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  console.log('User authenticated:', user);

  return (
    <div 
      className="relative w-full h-screen min-h-screen overflow-hidden"
      onMouseUp={handleMouseUp}
    >
      {/* Only show playground content if user is authenticated */}
      {user && (
        <>
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full min-h-screen">
        <CloudinaryVideo
          publicId="Untitled_3_hqjwbt"
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
          style={{
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            objectPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 0
          }}
        />
        {/* Subtle overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
      </div>

      {/* Floating Navigation */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-6 left-6 right-6 z-20 flex justify-between items-center"
      >
        {/* Logo */}
        <motion.h1 
          className="text-2xl md:text-3xl font-bold text-white cursor-pointer"
          whileHover={{ scale: 1.05 }}
          onClick={() => router.push('/')}
        >
          CalmRush
        </motion.h1>
        
        {/* Floating Navigation Items */}
        <div className="flex items-center space-x-8">
          {/* Your Space Button */}
          <motion.button
            onClick={() => setShowWellnessCenter(true)}
            className="text-white/80 hover:text-white text-lg font-medium transition-all duration-300 hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Your Space
          </motion.button>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <span className="text-lg font-medium">{user?.name || 'User'}</span>
              <motion.svg
                className="w-4 h-4"
                animate={{ rotate: showProfileDropdown ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </motion.button>
            
            {/* Dropdown Menu */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-full mt-2 w-48 backdrop-blur-2xl bg-slate-800/30 rounded-xl border border-slate-600/20 overflow-hidden"
                >
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        router.push('/history');
                      }}
                      className="w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-slate-700/30 transition-colors"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileDropdown(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-3 text-left text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Floating 3D Crystal - No Container */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1px',
          height: '1px',
          pointerEvents: 'none',
          overflow: 'visible'
        }}
      >
        {/* Visual drop zone indicator when dragging thoughts */}
        {isDraggingThought && (
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border-4 border-dashed border-cyan-400 opacity-50 pointer-events-none"
            style={{
              animation: 'pulse 2s infinite'
            }}
          />
        )}
        <Canvas
          camera={{ position: [0, 0, 9], fov: 40 }}
          style={{ 
            width: '100vw',
            height: '100vh',
            background: 'transparent',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
            margin: 0,
            padding: 0,
            overflow: 'visible'
          }}
          gl={{ 
            alpha: true, 
            antialias: true
          }}
        >
          <Scene3D />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            enableRotate={false}
          />
          {/* Post-Processing Effects */}
          <EffectComposer>
            <Bloom
              intensity={1.2}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.3}
            />
          </EffectComposer>
      </Canvas>
      </div>
      
      {/* Answers Text - Separate Element */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-20 text-center text-white text-2xl font-bold z-10"
        style={{
          textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4)',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        Answers
      </motion.h2>

      {/* Floating Thoughts - Hide when problem form is shown */}
      {!showProblemForm && floatingThoughts.map((thought) => (
        <motion.div
          key={thought.id}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1, 
            scale: thought.isDragging ? 1.1 : 1,
            x: thought.x,
            y: thought.y
          }}
          transition={{ 
            duration: thought.isDragging ? 0.1 : 0.3,
            ease: thought.isDragging ? 'easeOut' : 'easeInOut'
          }}
          onMouseDown={(e) => handleThoughtMouseDown(e, thought.id, thought.text)}
          onMouseUp={handleThoughtMouseUp}
          className="absolute cursor-move select-none z-20"
          style={{
            left: 0,
            top: 0,
            transform: `translate(${thought.x}px, ${thought.y}px) translate(-50%, -50%)`,
          }}
        >
                <div 
                  className={`
                    px-6 py-3 rounded-2xl backdrop-blur-2xl border-2 font-medium text-sm
                    ${thought.isProcessed ? 
                      'bg-green-500/20 border-green-400 text-green-200' : 
                      thought.sentiment === 'positive' ? 
                      'bg-green-500/10 border-green-400 text-green-300' : 
                      thought.sentiment === 'negative' ? 
                      'bg-red-500/10 border-red-400 text-red-300' : 
                      'bg-cyan-500/10 border-cyan-400 text-cyan-300'
                    }
                    ${thought.isDragging ? 'shadow-2xl' : 'shadow-lg'}
                  `}
            style={{
              boxShadow: thought.isProcessed ? 
                '0 0 25px rgba(34, 197, 94, 0.4), 0 0 50px rgba(34, 197, 94, 0.2)' :
                thought.sentiment === 'positive' ? 
                '0 0 20px rgba(34, 197, 94, 0.3), 0 0 40px rgba(34, 197, 94, 0.1)' :
                thought.sentiment === 'negative' ?
                '0 0 20px rgba(248, 113, 113, 0.3), 0 0 40px rgba(248, 113, 113, 0.1)' :
                '0 0 20px rgba(34, 211, 238, 0.3), 0 0 40px rgba(34, 211, 238, 0.1)',
              textShadow: '0 0 10px rgba(255, 255, 255, 0.3)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            {/* Problem text */}
            <div className="font-medium">
              {thought.text}
            </div>
            
            {/* Solution text (if exists) */}
            {thought.solution && (
              <div className="text-sm opacity-80 mt-2 pt-2 border-t border-current/20">
                {thought.solution}
              </div>
            )}
            
            {thought.confidence && (
              <div className="text-xs opacity-60 mt-1">
                {thought.sentiment} ({Math.round(thought.confidence * 100)}%)
              </div>
            )}
          </div>
        </motion.div>
      ))}

      {/* Chat Element - Bottom Center - Static */}
      {!showProblemForm && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-lg mx-4 z-20"
        >
        <div className="relative">
          {/* Outer container with animated gradient border */}
          <div className="relative backdrop-blur-2xl bg-slate-800/20 rounded-2xl p-[2px]">
            {/* Animated gradient border */}
            <motion.div 
              className="absolute inset-0 rounded-2xl"
              animate={{
                background: [
                  'linear-gradient(45deg, #8b5cf6, #3b82f6, #8b5cf6, #ec4899)',
                  'linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6, #8b5cf6)',
                  'linear-gradient(45deg, #8b5cf6, #3b82f6, #8b5cf6, #ec4899)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{
                padding: '2px',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'xor',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
              }}
            />
            
            {/* Inner container with enhanced glassmorphism */}
            <div className="relative backdrop-blur-2xl bg-slate-800/30 rounded-xl border border-slate-600/10 overflow-hidden">
              {/* Subtle inner glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-xl"></div>
              
                    <form onSubmit={handleSubmit} className="relative p-3">
                      <div className="flex items-center space-x-2">
                        {/* Input field */}
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={thought}
                            onChange={(e) => setThought(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            onKeyDown={handleKeyDown}
                            placeholder={isLoading ? "Processing thought..." : "What's on your mind today?"}
                            disabled={isLoading}
                            className="w-full bg-transparent text-white placeholder-gray-300 focus:outline-none text-base font-light py-3 px-3 disabled:opacity-50"
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
                      }}
                    />
                    
                    {/* Enhanced interactive circle element - Enter Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoading || !thought.trim()}
                      whileHover={{ 
                        scale: 1.2,
                        boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
                      }}
                      whileTap={{ scale: 0.9 }}
                      className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer backdrop-blur-sm border border-white/20 transition-all duration-200 ${
                        isLoading || !thought.trim() 
                          ? 'bg-white/10 cursor-not-allowed opacity-50' 
                          : 'bg-white/30 hover:bg-white/40'
                      }`}
                    >
                      <motion.div 
                        className={`w-2.5 h-2.5 rounded-full ${
                          isLoading ? 'bg-white/50' : 'bg-white'
                        }`}
                        animate={isLoading ? {
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        } : {
                          scale: [1, 1.1, 1],
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{
                          duration: isLoading ? 0.8 : 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
      </div>

          {/* Enhanced instruction text below */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="text-center text-white/80 text-sm font-light mt-4"
            style={{ 
              textShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            Drag and drop thoughts into &quot;Process&quot; area below.
          </motion.p>
          </div>
        </motion.div>
      )}

      {/* Problem Form - Appears when chat is dragged to 3D model */}
      {showProblemForm && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-4 z-30"
        >
          <div className="relative">
            {/* Outer container with animated gradient border */}
            <div className="relative backdrop-blur-2xl bg-slate-800/20 rounded-2xl p-[2px]">
              {/* Animated gradient border */}
              <motion.div 
                className="absolute inset-0 rounded-2xl"
                animate={{
                  background: [
                    'linear-gradient(45deg, #8b5cf6, #3b82f6, #8b5cf6, #ec4899)',
                    'linear-gradient(45deg, #ec4899, #8b5cf6, #3b82f6, #8b5cf6)',
                    'linear-gradient(45deg, #8b5cf6, #3b82f6, #8b5cf6, #ec4899)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  padding: '2px',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'xor',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                }}
              />
              
              {/* Inner container */}
              <div className="relative backdrop-blur-2xl bg-slate-800/30 rounded-xl border border-slate-600/10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-xl"></div>
                
                <form onSubmit={(e) => {
                  console.log('Form onSubmit triggered');
                  handleProblemSubmit(e);
                }} className="relative p-6">
                  <h3 className="text-white text-xl font-bold mb-4 text-center">
                    {selectedThoughtText || "Your Problem"}
                  </h3>
                  
                  <div className="mb-4">
                    <textarea
                      value={problemText}
                      onChange={(e) => setProblemText(e.target.value)}
                      placeholder="Write your solution or thoughts about this problem..."
                      className="w-full bg-transparent text-white placeholder-gray-300 focus:outline-none text-base font-light py-3 px-3 rounded-lg border border-slate-600/20 resize-none"
                      rows={4}
                      style={{ 
                        fontFamily: 'Inter, sans-serif',
                        textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-center">
                    <motion.button
                      type="submit"
                      disabled={!problemText.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => {
                        console.log('Button clicked!', { problemText, draggedThoughtId });
                        e.preventDefault();
                        handleProblemSubmit(e);
                      }}
                      className={`px-8 py-3 rounded-full font-medium transition-all duration-200 ${
                        problemText.trim() 
                          ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg' 
                          : 'bg-gray-500 cursor-not-allowed text-gray-300'
                      }`}
                    >
                      Carry On
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
        )}

        {/* Wellness Center Modal */}
        <WellnessCenter 
          isOpen={showWellnessCenter} 
          onClose={() => setShowWellnessCenter(false)} 
        />

        {/* Background Music Control - Bottom Right */}
        <motion.button
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 flex items-center justify-center text-white text-2xl transition-all duration-300 hover:scale-110 hover:bg-white/20 z-40"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          {isMusicPlaying ? '🔊' : '🔇'}
        </motion.button>
        </>
      )}

        {/* Reset Modal */}
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowResetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-2xl mx-4 border border-slate-600/20"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-3xl font-bold text-white mb-6 text-center">
                🎉 All Problems Solved!
              </h2>
              
              <div className="mb-6">
                <p className="text-lg text-gray-300 text-center mb-4">
                  Congratulations! You&apos;ve successfully processed all your thoughts and found solutions.
                </p>
                
                <div className="bg-green-500/10 border border-green-400/20 rounded-lg p-4 mb-4">
                  <h3 className="text-green-300 font-semibold mb-2">Completed Solutions:</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {completedSolutions.map((solution, index) => (
                      <div key={index} className="text-sm text-gray-300">
                        <div className="font-medium text-green-200">Problem: {solution.problem}</div>
                        <div className="text-gray-400 ml-2">Solution: {solution.solution}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                <motion.button
                  onClick={() => {
                    setShowResetModal(false);
                    // Keep the green thoughts and allow for more problems
                    // Don't reset hasShownResetModal so modal won't appear again
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Keep Working
                </motion.button>
                
                <motion.button
                  onClick={handleResetPlayground}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Reset Playground & Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md mx-4 border border-slate-600/20"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                Welcome to CalmRush
              </h2>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                {loginError && (
                  <div className="text-red-400 text-sm text-center">
                    {loginError}
                  </div>
                )}
                
                <motion.button
                  type="submit"
                  disabled={isLoggingIn}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                </motion.button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => router.push('/')}
                    className="text-purple-400 hover:text-purple-300 underline"
                  >
                    Go to landing page
                  </button>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
    </div>
  );
}
