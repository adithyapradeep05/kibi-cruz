
import React, { useState, useEffect } from 'react';
import { getLatestReflection, WeeklyReflection } from '@/utils/weeklyReflection';
import { useAuth } from '@/contexts/auth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, LineChart, ListTodo, Star, Lightbulb } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/hooks/use-toast';

interface LatestReflectionProps {
  onViewAll?: () => void;
}

const LatestReflection: React.FC<LatestReflectionProps> = ({ onViewAll }) => {
  const [reflection, setReflection] = useState<WeeklyReflection | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchLatestReflection = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const latest = await getLatestReflection(user.id);
        setReflection(latest);
      } catch (error) {
        console.error("Error fetching latest reflection:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLatestReflection();
  }, [user]);

  if (loading) {
    return (
      <Card className="border-[3px] border-[#0f172a] shadow-[0_8px_0_rgba(15,23,42,0.7)] bg-[#151e2d]">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Weekly Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!reflection) {
    return (
      <Card className="border-[3px] border-[#0f172a] shadow-[0_8px_0_rgba(15,23,42,0.7)] bg-[#151e2d]">
        <CardHeader className="pb-2">
          <CardTitle className="text-white">Weekly Reflection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Calendar className="h-10 w-10 text-[#33C3F0] mx-auto mb-3" />
            <h3 className="text-base font-medium text-white mb-1">No Reflection Yet</h3>
            <p className="text-white/60 text-sm mb-4">
              Your first weekly reflection will be generated on Sunday.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format the date
  const formattedDate = format(new Date(reflection.date), 'MMMM d, yyyy');
  
  return (
    <Card className="border-[3px] border-[#0f172a] shadow-[0_8px_0_rgba(15,23,42,0.7)] hover:shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:translate-y-[-2px] transition-all duration-300 overflow-hidden bg-[#151e2d]">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-[#33C3F0]" />
            Weekly Reflection
          </CardTitle>
          <Badge className="bg-[#33C3F0]/20 text-[#33C3F0] border-[#33C3F0]/30 px-2">
            {formattedDate}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Summary Section - abbreviated */}
          <div className="p-3 rounded-lg bg-[#1e293b]/50 border-l-4 border-[#33C3F0] text-white">
            <p className="italic text-sm line-clamp-3">{reflection.summary}</p>
          </div>
          
          {/* Stats Section - condensed */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#1e293b]/30 p-2 rounded-lg border border-[#0f172a]/30 text-center">
              <p className="text-xl font-bold text-white">
                {reflection.stats.tasksCompleted}
              </p>
              <p className="text-xs text-white/60">tasks</p>
            </div>
            
            <div className="bg-[#1e293b]/30 p-2 rounded-lg border border-[#0f172a]/30 text-center">
              <p className="text-xl font-bold text-white">
                {reflection.progressMomentum}
                <span className="text-sm">/10</span>
              </p>
              <p className="text-xs text-white/60">momentum</p>
            </div>
            
            <div className="bg-[#1e293b]/30 p-2 rounded-lg border border-[#0f172a]/30 text-center">
              <p className="text-xl font-bold text-white">
                {reflection.stats.focusSessionsCount}
              </p>
              <p className="text-xs text-white/60">sessions</p>
            </div>
          </div>
          
          {/* Focus for next week - just one item */}
          {reflection.nextWeekFocus.length > 0 && (
            <div className="bg-[#1e293b]/30 p-3 rounded-lg border border-[#0f172a]/30">
              <div className="flex items-center text-[#33C3F0] mb-1">
                <Lightbulb className="h-4 w-4 mr-1" />
                <span className="text-xs font-semibold">Focus for Next Week</span>
              </div>
              
              <div className="bg-[#33C3F0]/20 text-white p-2 rounded-lg text-sm">
                {reflection.nextWeekFocus[0]}
              </div>
            </div>
          )}
          
          {/* View all button */}
          {onViewAll && (
            <Button 
              variant="outline" 
              className="w-full mt-2 text-[#33C3F0] border-[#33C3F0]/30 hover:bg-[#33C3F0]/10"
              onClick={onViewAll}
            >
              View Full Reflection
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LatestReflection;
