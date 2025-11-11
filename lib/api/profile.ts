// Client-side API utilities for profile management
import { UserProfile, ProfileStats } from '@/models/user';

/**
 * Fetch the current user's profile
 */
export async function fetchProfile(): Promise<UserProfile> {
  const response = await fetch('/api/profile', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
}

/**
 * Update the current user's profile
 */
export async function updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    throw new Error('Failed to update profile');
  }

  return response.json();
}

/**
 * Fetch the current user's profile statistics
 */
export async function fetchProfileStats(): Promise<ProfileStats> {
  const response = await fetch('/api/profile/stats', {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch profile stats');
  }

  return response.json();
}
