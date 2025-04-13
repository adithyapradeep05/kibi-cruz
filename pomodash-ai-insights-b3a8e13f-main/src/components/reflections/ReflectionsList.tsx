
import React, { useState, useEffect } from 'react';
import { getUserReflections, WeeklyReflection } from '@/utils/weeklyReflection';
import { useAuth } from '@/contexts/auth';
import ReflectionView from './ReflectionView';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarIcon, Clock, FileText, HistoryIcon, ListTodo } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from '@/hooks/use-toast';

const ReflectionsList: React.FC = () => {
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);
  const [selectedReflection, setSelectedReflection] = useState<WeeklyReflection | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchReflections = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const userReflections = await getUserReflections(user.id);
        setReflections(userReflections);
        
        if (userReflections.length > 0) {
          setSelectedReflection(userReflections[0]);
        }
      } catch (error) {
        console.error("Error fetching reflections:", error);
        toast({
          title: "Couldn't load reflections",
          description: "There was an error loading your weekly reflections",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchReflections();
  }, [user]);

  const handleEmailReflection = async () => {
    if (!selectedReflection || !user?.email) return;
    
    try {
      const { error } = await supabase.functions.invoke('send-weekly-reflection', {
        body: { 
          reflection: selectedReflection,
          email: user.email
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Email Sent",
        description: "Your reflection has been emailed to you",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Email Not Sent",
        description: "There was an error sending your reflection by email",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (reflections.length === 0) {
    return (
      <Card className="border-[3px] border-[#0f172a] shadow-lg bg-[#151e2d]">
        <CardHeader>
          <CardTitle className="text-white">Weekly Reflections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-[#33C3F0] mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">No Reflections Yet</h3>
            <p className="text-white/60 mb-4">
              Weekly reflections are generated automatically every Sunday.
              Continue logging your focus sessions and completing tasks!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <HistoryIcon className="h-5 w-5 text-[#33C3F0] mr-2" /> 
          <h2 className="text-lg font-bold text-white">Weekly Reflections</h2>
        </div>
        
        <div className="flex items-center gap-2">
          <Select 
            value={selectedReflection?.id} 
            onValueChange={(value) => {
              const reflection = reflections.find(r => r.id === value);
              if (reflection) setSelectedReflection(reflection);
            }}
          >
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Select week" />
            </SelectTrigger>
            <SelectContent>
              {reflections.map(reflection => (
                <SelectItem key={reflection.id} value={reflection.id}>
                  Week of {format(new Date(reflection.date), 'MMM d, yyyy')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline"
            size="sm"
            onClick={handleEmailReflection}
            className="h-8"
          >
            Email Reflection
          </Button>
        </div>
      </div>
      
      {selectedReflection && <ReflectionView reflection={selectedReflection} />}
    </div>
  );
};

export default ReflectionsList;
