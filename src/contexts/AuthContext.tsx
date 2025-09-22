'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Debug user state changes
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking authentication...');
        
        // First check if we have authentication cookies
        if (typeof document !== 'undefined') {
          const cookies = document.cookie;
          console.log('Browser cookies:', cookies);
          const userIdCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('userId='));
          const isAuthCookie = cookies.split(';').find(cookie => cookie.trim().startsWith('isAuthenticated='));
          
          console.log('UserId cookie:', userIdCookie);
          console.log('Auth cookie:', isAuthCookie);
          
          // If no auth cookies, user is definitely not logged in
          if (!userIdCookie || !isAuthCookie) {
            console.log('No authentication cookies found');
            setUser(null);
            setLoading(false);
            return;
          }
        }
        
        const response = await fetch('/api/auth/me', {
          method: 'GET',
          credentials: 'include', // Ensure cookies are sent
        });
        console.log('Auth check response:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('User data received:', data);
          if (data.user) {
            setUser(data.user);
            console.log('User set in context:', data.user);
          } else {
            console.log('No user data in response');
            setUser(null);
          }
        } else {
          console.log('Auth check failed with status:', response.status);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (data.success) {
        console.log('Login successful, setting user:', data.data);
        setUser(data.data);
        return { success: true };
      } else {
        console.log('Login failed:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Ensure cookies are sent
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      
      // Clear authentication cookies immediately
      if (typeof document !== 'undefined') {
        document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'isAuthenticated=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      }
      
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include' // Ensure cookies are sent
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

