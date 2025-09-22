'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CloudinaryVideo from '@/components/CloudinaryVideo';
import { useAuth } from '@/contexts/AuthContext';

// Kinetic Typography Component
function KineticHeadline() {
  const words = "Your Inner Calm. Visualized.".split(' ');

  return (
    <motion.h1
      className="text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-tight tracking-tight text-center"
      style={{ fontFamily: 'Inter, sans-serif' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-6"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            delay: index * 0.15,
            ease: 'easeOut',
          }}
          whileInView={{
            scale: [1, 1.01, 1],
            transition: {
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: index * 0.1,
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.h1>
  );
}

// Glassmorphic Sub-headline Component
function GlassmorphicSubheadline() {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.5 }}
      className="relative max-w-2xl mx-auto"
    >
      <div className="backdrop-blur-2xl bg-white/5 rounded-2xl p-6 border border-white/20 relative overflow-hidden">
        {/* Pulsing gradient border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            background: [
              'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)',
              'linear-gradient(45deg, #00ffff, #ff00ff, #00ffff)',
              'linear-gradient(45deg, #ff00ff, #00ffff, #ff00ff)',
            ],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            padding: '1px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'xor',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
          }}
        />
        
        <p className="text-lg md:text-xl text-white text-center relative z-10 font-light">
          Externalize. Process. Resolve. Find clarity in your personal digital sanctuary.
        </p>
      </div>
    </motion.div>
  );
}

// Advanced CTA Button Component
function AdvancedCTAButton({ user, onShowLogin }: { user: any; onShowLogin: () => void }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleClick = () => {
    // Check if user is authenticated (cached in context)
    if (user) {
      // User is logged in, go directly to playground
      router.push('/playground');
    } else {
      // User is not logged in, show login modal
      onShowLogin();
    }
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.2 }}
      className="relative"
    >
      <motion.button
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 20px 40px rgba(255, 0, 255, 0.4)'
        }}
        whileTap={{ scale: 0.95 }}
        className="relative px-10 py-4 rounded-full font-semibold text-lg text-white overflow-hidden group backdrop-blur-xl bg-white/10 border border-white/20"
        style={{
          backgroundImage: isHovered 
            ? 'linear-gradient(135deg, #ff00ff, #00ffff, #ff00ff)' 
            : 'linear-gradient(135deg, rgba(255, 0, 255, 0.3), rgba(0, 255, 255, 0.3))',
          backgroundSize: '200% 200%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
        animate={{
          backgroundPosition: isHovered ? '100% 100%' : '0% 0%',
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut',
        }}
      >
        {/* Aurora gradient animation */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
              rgba(255, 255, 255, 0.4) 0%, 
              transparent 60%)`,
          }}
        />
        
        {/* Button content */}
        <span className="relative z-10 flex items-center space-x-3">
          <span>Enter Mind Playground</span>
          <motion.span
            animate={{ x: isHovered ? 5 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-xl"
          >
            →
          </motion.span>
        </span>
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 -top-2 -left-2 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
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
    </motion.div>
  );
}

// Footer Tagline Component
function FooterTagline() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2.8 }}
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm text-center backdrop-blur-xl bg-white/5 rounded-full px-6 py-3 border border-white/10"
    >
      Where thoughts take form, and solutions find space.
      <motion.span
        className="ml-2 inline-block"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      >
        ✦
      </motion.span>
    </motion.p>
  );
}

export default function Home() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');

  // Handle login redirect from middleware
  useEffect(() => {
    const checkUrlParams = () => {
      const urlParams = new URLSearchParams(window.location.search);
      console.log('URL params:', urlParams.toString());
      if (urlParams.get('login') === 'required') {
        console.log('Showing login modal due to redirect');
        setShowLoginModal(true);
      }
    };

    // Check immediately
    checkUrlParams();
    
    // Also check after a small delay to ensure URL is fully loaded
    const timeoutId = setTimeout(checkUrlParams, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const result = await login(loginData.email, loginData.password);
      
      if (result.success) {
        setShowLoginModal(false);
        setLoginData({ email: '', password: '' });
        
        // Redirect to the intended page
        const urlParams = new URLSearchParams(window.location.search);
        const redirectTo = urlParams.get('redirect') || '/playground';
        router.push(redirectTo);
      } else {
        setLoginError(result.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegisterError('');

    // Validate passwords match
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Passwords do not match');
      setIsRegistering(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: registerData.name,
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShowRegisterModal(false);
        setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
        
        // Auto-login after successful registration
        const loginResult = await login(registerData.email, registerData.password);
        if (loginResult.success) {
          const urlParams = new URLSearchParams(window.location.search);
          const redirectTo = urlParams.get('redirect') || '/playground';
          router.push(redirectTo);
        }
      } else {
        setRegisterError(result.error || 'Registration failed');
      }
    } catch (error) {
      setRegisterError('Registration failed. Please try again.');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="relative w-full h-screen min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full min-h-screen">
        <CloudinaryVideo
          publicId="landing-video"
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
      
      {/* UI Overlay */}
      <div className="absolute inset-0 z-10 min-h-screen">
        {/* CalmRush Logo - Top Left */}
        <div className="absolute top-6 left-6 z-20">
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            CalmRush
          </motion.h1>
        </div>
        
        {/* Main Content - Centered */}
        <div className="flex flex-col items-center justify-center min-h-screen px-8">
          <div className="text-center max-w-4xl w-full">
            {/* Main Headline - Centered */}
            <div className="mb-16">
              <KineticHeadline />
            </div>
            
            {/* Sub-headline - Centered */}
            <div className="mb-20">
              <GlassmorphicSubheadline />
            </div>
            
            {/* CTA Button - Centered */}
            <div>
              <AdvancedCTAButton 
                user={user} 
                onShowLogin={() => setShowLoginModal(true)} 
              />
            </div>
          </div>
        </div>
        
        {/* Footer Tagline */}
        <FooterTagline />
      </div>

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
                  onClick={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                  }}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowRegisterModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md mx-4 border border-slate-600/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Join CalmRush
            </h2>
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
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
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Create a password"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              {registerError && (
                <div className="text-red-400 text-sm text-center">
                  {registerError}
                </div>
              )}
              
              <motion.button
                type="submit"
                disabled={isRegistering}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isRegistering ? 'Creating Account...' : 'Create Account'}
              </motion.button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setShowRegisterModal(false);
                    setShowLoginModal(true);
                  }}
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}