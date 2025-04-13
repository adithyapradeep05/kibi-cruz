
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for authentication methods (sign in, sign up, sign out)
 */
export function useAuthMethods() {
  const { toast } = useToast();

  const signInWithEmail = async (email: string, password: string) => {
    try {
      // No longer checking authorized_users table - open to everyone
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    } catch (error: any) {
      // Special handling for first-time user - try to sign up
      if (error.message.includes('Invalid login credentials')) {
        try {
          // No longer checking authorized_users table - open to everyone
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
          });
          
          if (signUpError) throw signUpError;
          
          toast({
            title: "Account created",
            description: "Please check your email to confirm your account.",
          });
          return;
        } catch (signUpError: any) {
          throw new Error(signUpError.message || "Failed to sign up");
        }
      }
      
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error signing in with Google",
        description: error.message || "An error occurred during Google sign in",
        variant: "destructive",
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    }
  };

  return {
    signInWithEmail,
    signInWithGoogle,
    signOut
  };
}
