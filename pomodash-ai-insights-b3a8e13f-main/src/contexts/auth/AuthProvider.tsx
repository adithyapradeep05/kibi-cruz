
import React, { createContext, useEffect } from 'react';
import { AuthContextType } from './types';
import { useAuthState } from './useAuthState';
import { useProfileManagement } from './useProfileManagement';
import { useAuthMethods } from './useAuthMethods';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Auth state management
  const { user, session, isLoading } = useAuthState();
  
  // Profile management
  const { 
    profile, 
    subscription, 
    updateProfile, 
    loadUserProfile 
  } = useProfileManagement(user);
  
  // Auth methods
  const { signInWithEmail, signInWithGoogle, signOut } = useAuthMethods();

  // Load user profile on mount or when user changes
  useEffect(() => {
    if (user) {
      loadUserProfile();
    }
  }, [user, loadUserProfile]);

  // Combine all values for the context provider
  const value: AuthContextType = {
    user,
    session,
    isLoading,
    profile,
    subscription,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
