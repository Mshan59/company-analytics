// lib/auth.ts
import { jwtVerify, SignJWT } from 'jose';

export interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

// For client-side token handling
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    // Also set as cookie for middleware
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}; samesite=strict${process.env.NODE_ENV === 'production' ? '; secure' : ''}`;
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};

// For API route token verification
export const verifyToken = async (token: string) => {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
};

// Create authenticated fetch utility
export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
  };
  
  return fetch(url, {
    ...options,
    headers,
    credentials: 'include', // This is important for sending cookies
  });
};

// Helper to check if user is logged in
export const isLoggedIn = () => {
  return !!getToken();
};

// Logout function
export const logout = () => {
  removeToken();
  // You might want to redirect or notify other parts of your app
  window.location.href = '/login';
};

// Parse user data from token
export const getUserFromToken = async (token: string): Promise<UserData | null> => {
  try {
    const payload = await verifyToken(token);
    if (!payload) return null;
    
    return {
      id: payload.userId as number,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as string
    };
  } catch (error) {
    console.error('Error parsing user data from token:', error);
    return null;
  }
};