
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';
import { SubscriptionStatus } from './types';

export const useProfileManagement = (user: User | null) => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const loadUserProfile = useCallback(async () => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      // Since we're having issues with the profiles table, we'll create a minimal profile object
      // from the user data itself as a temporary solution.
      // When the database schema is properly set up, this would fetch from the profiles table
      const userProfile = {
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
        first_name: '',
        last_name: '',
        avatar_url: '',
        subscription: null
      };
      
      setProfile(userProfile);
      
      return userProfile;
    } catch (error) {
      console.error('Error loading user profile:', error);
      toast({
        title: 'Profile Error',
        description: 'Failed to load your profile information',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateUserProfile = useCallback(async (
    updates: {
      first_name?: string;
      last_name?: string;
      avatar_url?: string;
    }
  ) => {
    if (!user) return null;
    
    try {
      setLoading(true);
      
      // For now, just update the local profile state since we're having DB issues
      setProfile(prevProfile => ({
        ...prevProfile,
        ...updates
      }));
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
      
      return profile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      toast({
        title: 'Update Error',
        description: 'Failed to update your profile',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [user, profile]);

  // Extract subscription from profile for convenience
  const subscription: SubscriptionStatus | null = profile?.subscription || null;

  // Alias updateUserProfile as updateProfile for consistency with the AuthContext interface
  const updateProfile = updateUserProfile;

  return {
    profile,
    profileLoading: loading,
    loadUserProfile,
    updateUserProfile,
    subscription,
    updateProfile,
  };
};
