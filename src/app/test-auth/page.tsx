'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

export default function TestAuthPage() {
  const { user, login, register, logout, loading } = useAuth();
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpassword');
  const [name, setName] = useState('Test User');
  const [isLogin, setIsLogin] = useState(true);

  const handleLogin = async () => {
    const result = await login(email, password);
    console.log('Login result:', result);
  };

  const handleRegister = async () => {
    const result = await register(name, email, password);
    console.log('Register result:', result);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Authentication Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Current User:</h2>
        <pre className="bg-gray-800 p-4 rounded">
          {user ? JSON.stringify(user, null, 2) : 'No user logged in'}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Test Authentication:</h2>
        
        <div className="mb-4">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mr-4"
          >
            Switch to {isLogin ? 'Register' : 'Login'}
          </button>
        </div>

        {isLogin ? (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded w-64"
              />
            </div>
            <div>
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded w-64"
              />
            </div>
            <button
              onClick={handleLogin}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            >
              Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded w-64"
              />
            </div>
            <div>
              <label className="block mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded w-64"
              />
            </div>
            <div>
              <label className="block mb-2">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded w-64"
              />
            </div>
            <button
              onClick={handleRegister}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            >
              Register
            </button>
          </div>
        )}
      </div>

      {user && (
        <div className="mb-8">
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      )}

      <div className="mb-8">
        <a
          href="/playground"
          className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded inline-block"
        >
          Go to Playground
        </a>
      </div>
    </div>
  );
}


