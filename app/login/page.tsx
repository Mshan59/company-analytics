"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { setToken, verifyToken } from '@/lib/auth';
// import Image from 'next/image';
const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const payload = await verifyToken(token);
          if (payload) {
            // If token is valid, redirect to home or the intended destination
            const from = searchParams.get('from') || '/';
            router.push(from);
            return;
          }
        } catch (error) {
          // Token is invalid, remove it
          localStorage.removeItem('token');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router, searchParams]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
    
      const data = await res.json();
    
      if (res.ok) {
        // Use the auth utility to set the token
        setToken(data.token);
        
        // Get the redirect path from URL params or default to home
        const from = searchParams.get('from') || '/';
        router.push(from);
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-white">
    
      {/* Glassmorphism card */}
      <div className="relative z-10 w-full max-w-md p-8 rounded-lg backdrop-blur-sm bg-white/20 shadow-xl border border-white/30">
      
        {/* Logo and title section */}
        <div className="text-center space-y-2 mb-8">
          {/* <div className="flex justify-center">
            <Scale className="h-12 w-12 " />
          </div> */}
          <h1 className="text-2xl font-bold ">Feature flow</h1>
          {/* <p className="text-gray-700">Civil and Corporate Law Solutions</p> */}
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email field */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium ">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent
                           placeholder-gray-300 backdrop-blur-sm"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium ">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 bg-white/10 border border-white/30 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent
                           placeholder-gray-300 backdrop-blur-lg"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-300" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me and Forgot password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 bg-white/10 border-white/30 rounded focus:ring-2 focus:ring-white/50"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm ">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium  hover:text-gray-200">
                Forgot your password?
              </a>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                     text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            Sign in
          </button>
        </form>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm ">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium  hover:text-gray-200">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;