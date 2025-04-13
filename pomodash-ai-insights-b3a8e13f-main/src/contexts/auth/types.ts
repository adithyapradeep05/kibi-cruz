
import { User, Session } from '@supabase/supabase-js';

export type SubscriptionStatus = {
  isPaid: boolean;
  level: string;
  startDate?: string;
  endDate?: string;
};

export type UserProfile = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  subscription: SubscriptionStatus | null;
  created_at?: string;
};

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  profile: UserProfile | null;
  subscription: SubscriptionStatus | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
};
