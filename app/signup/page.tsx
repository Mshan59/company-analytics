// "use client"
// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
"use client";
import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Link from 'next/link';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string>('member');
  const [ownerExists, setOwnerExists] = useState<boolean>(false);
  const [adminExists, setAdminExists] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/roles/availability', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        setOwnerExists(!!data.ownerExists);
        setAdminExists(!!data.adminExists);
      } catch {}
    };
    load();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      });
    
      const data = await res.json();
    
      if (res.ok) {
        setMessage('Signup successful! You can now login.');
        setName('');
        setEmail('');
        setPassword('');
        setRole('member');
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-black/10">
      <div className="relative z-10 w-full max-w-md p-8 rounded-lg backdrop-blur-sm bg-white/20 shadow-xl border border-white/30">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-bold ">Feature Flow</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium ">Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/30 rounded-md 
                          focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent
                           placeholder-gray-300 backdrop-blur-sm"
                placeholder="Enter your name"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium ">Email Address</label>
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

          <div className="space-y-2">
            <label htmlFor="role" className="block text-sm font-medium ">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full py-2 px-3 bg-white/10 border border-white/30 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent"
            >
              <option value="member">Member</option>
              <option value="admin" disabled={adminExists}>Admin {adminExists ? '(taken)' : ''}</option>
              <option value="super-admin" disabled={ownerExists}>Super Admin {ownerExists ? '(taken)' : ''}</option>
              <option value="manager" disabled={adminExists}>Manager {adminExists ? '(maps to Admin - taken)' : '(maps to Admin)'} </option>
              <option value="ceo" disabled={ownerExists}>CEO {ownerExists ? '(maps to Super Admin - taken)' : '(maps to Super Admin)'} </option>
            </select>
            <p className="text-xs text-gray-700">Note: Super Admin (owner/CEO) is unique. Manager maps to Admin and is unique.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium ">Password</label>
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

          {message && (
            <div className="text-sm text-center py-1">{message}</div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                     text-sm font-medium text-black bg-gray-100 hover:bg-gray-200 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
            disabled={submitting}
          >
            {submitting ? 'Signing up…' : 'Sign up'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm ">
          Already have an account?{' '}
          <Link href="/login" className="font-medium  hover:text-gray-200">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;