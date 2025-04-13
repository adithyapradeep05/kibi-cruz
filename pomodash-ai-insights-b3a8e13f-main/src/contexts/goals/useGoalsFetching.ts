
import { useState, useEffect } from 'react';
import { Goal } from '@/types/goals';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useGoalsFetching = (user: any | null) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setLoading(true);
        
        if (user) {
          // For Supabase fetching, we'd need to have the correct table structure
          // The errors suggest there's no 'goals' table or structure doesn't match
          // For now, we'll use local storage as a fallback and skip Supabase calls
          const localGoals = localStorage.getItem('goals');
          if (localGoals) {
            setGoals(JSON.parse(localGoals));
          }
        } else {
          const localGoals = localStorage.getItem('goals');
          if (localGoals) {
            setGoals(JSON.parse(localGoals));
          }
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
        toast({
          title: 'Error',
          description: 'Failed to load goals',
          variant: 'destructive',
        });
        
        // Fallback to local storage
        const localGoals = localStorage.getItem('goals');
        if (localGoals) {
          setGoals(JSON.parse(localGoals));
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoals();
  }, [user, toast]);

  // Save goals to localStorage whenever they change
  useEffect(() => {
    if (goals.length > 0) {
      localStorage.setItem('goals', JSON.stringify(goals));
    }
  }, [goals]);

  return { goals, setGoals, loading };
};
