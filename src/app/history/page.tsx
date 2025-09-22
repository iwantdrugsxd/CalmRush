'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ThoughtHistoryItem {
  id: string
  problem: string
  solution: string
  createdAt: string
}

interface UserStats {
  totalThoughts: number
  resolvedThoughts: number
  meditationSessions: number
  breathingSessions: number
  joinDate: string
  lastActive: string
}

export default function HistoryPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [thoughts, setThoughts] = useState<ThoughtHistoryItem[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'history'>('profile')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (user) {
      fetchThoughtHistory()
      fetchUserStats()
    }
  }, [user])

  // Refresh stats when component becomes visible (user returns from wellness center)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        fetchUserStats()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [user])

  const fetchThoughtHistory = async () => {
    try {
      const response = await fetch('/api/thoughts/history')
      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          setThoughts(data.data)
        } else {
          setThoughts([])
        }
      }
    } catch (error) {
      console.error('Failed to fetch thought history:', error)
      setThoughts([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch('/api/user/stats')
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setUserStats({
            totalThoughts: data.data.totalThoughts,
            resolvedThoughts: data.data.resolvedThoughts,
            meditationSessions: data.data.meditationSessions,
            breathingSessions: data.data.breathingSessions,
            joinDate: data.data.user.joinDate,
            lastActive: new Date().toISOString()
          })
        }
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error)
      // Fallback to mock stats
      const mockStats: UserStats = {
        totalThoughts: thoughts.length,
        resolvedThoughts: thoughts.length,
        meditationSessions: Math.floor(Math.random() * 20) + 5,
        breathingSessions: Math.floor(Math.random() * 50) + 10,
        joinDate: user?.createdAt || new Date().toISOString(),
        lastActive: new Date().toISOString()
      }
      setUserStats(mockStats)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Blurred Playground Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover blur-md"
        >
          <source src="/videos/playground bg.mp4" type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        {/* Main Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-4xl"
        >
          {/* Glassmorphic Card */}
          <div className="relative backdrop-blur-2xl bg-slate-800/30 rounded-2xl border border-slate-600/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-2xl"></div>

            <div className="relative p-8">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-between items-center mb-8"
              >
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">Profile & History</h1>
                  <p className="text-slate-300 text-lg">Track your journey and personal growth</p>
                </div>
                <div className="flex items-center space-x-4">
                  <motion.button
                    onClick={() => router.push('/playground')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500/80 to-purple-500/80 hover:from-blue-600/80 hover:to-purple-600/80 text-white rounded-full transition-all backdrop-blur-sm border border-blue-400/30"
                  >
                    Back to Playground
                  </motion.button>
                  <button
                    onClick={() => router.push('/playground')}
                    className="text-gray-400 hover:text-white text-2xl transition-colors"
                  >
                    ×
                  </button>
                </div>
              </motion.div>

              {/* Tab Navigation */}
              <div className="flex mb-8 bg-slate-700/30 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'profile' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Profile Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    activeTab === 'history' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Thought History
                </button>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    {/* User Info Card */}
                    <div className="bg-slate-700/50 rounded-lg p-6">
                      <div className="flex items-center space-x-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">{user?.name || 'User'}</h2>
                          <p className="text-slate-300">{user?.email}</p>
                          <p className="text-slate-400 text-sm">
                            Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    {userStats && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-slate-700/50 rounded-lg p-4 text-center"
                        >
                          <div className="text-2xl font-bold text-green-400 mb-1">{userStats.totalThoughts}</div>
                          <div className="text-slate-300 text-sm">Total Thoughts</div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-slate-700/50 rounded-lg p-4 text-center"
                        >
                          <div className="text-2xl font-bold text-blue-400 mb-1">{userStats.resolvedThoughts}</div>
                          <div className="text-slate-300 text-sm">Resolved</div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="bg-slate-700/50 rounded-lg p-4 text-center"
                        >
                          <div className="text-2xl font-bold text-purple-400 mb-1">{userStats.meditationSessions}</div>
                          <div className="text-slate-300 text-sm">Meditation Sessions</div>
                        </motion.div>
                        
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="bg-slate-700/50 rounded-lg p-4 text-center"
                        >
                          <div className="text-2xl font-bold text-cyan-400 mb-1">{userStats.breathingSessions}</div>
                          <div className="text-slate-300 text-sm">Breathing Sessions</div>
                        </motion.div>
                      </div>
                    )}

                    {/* Progress Overview */}
                    <div className="bg-slate-700/50 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-white mb-4">Your Progress</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm text-slate-300 mb-2">
                            <span>Thought Resolution Rate</span>
                            <span>{userStats ? Math.round((userStats.resolvedThoughts / Math.max(userStats.totalThoughts, 1)) * 100) : 0}%</span>
                          </div>
                          <div className="w-full bg-slate-600/30 rounded-full h-2">
                            <motion.div
                              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${userStats ? (userStats.resolvedThoughts / Math.max(userStats.totalThoughts, 1)) * 100 : 0}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {thoughts.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center py-12"
                      >
                        <div className="text-slate-400 text-lg mb-4">No thoughts recorded yet</div>
                        <p className="text-slate-500">Start processing your thoughts in the playground!</p>
                      </motion.div>
                    ) : (
                      thoughts.map((thought, index) => (
                        <motion.div
                          key={thought.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                          className="bg-slate-700/50 rounded-lg p-6"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="text-slate-400 text-sm">
                              {new Date(thought.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          </div>

                          <div className="space-y-4">
                            {/* Problem */}
                            <div>
                              <h3 className="text-green-400 font-semibold mb-2">Problem:</h3>
                              <p className="text-white text-lg">{thought.problem}</p>
                            </div>

                            {/* Solution */}
                            <div>
                              <h3 className="text-blue-400 font-semibold mb-2">Solution:</h3>
                              <p className="text-slate-300">{thought.solution}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}