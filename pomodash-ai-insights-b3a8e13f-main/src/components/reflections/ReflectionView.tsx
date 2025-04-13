
import React from 'react';
import { WeeklyReflection } from '@/utils/weeklyReflection';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { 
  BarChart,
  Calendar,
  CheckSquare,
  Clock,
  FileText,
  Goal,
  Line,
  LineChart,
  ListTodo,
  Lightbulb,
  Sparkles,
  Star,
  Zap
} from 'lucide-react';

interface ReflectionViewProps {
  reflection: WeeklyReflection;
}

const ReflectionView: React.FC<ReflectionViewProps> = ({ reflection }) => {
  // Format the date
  const formattedDate = format(new Date(reflection.date), 'MMMM d, yyyy');
  
  return (
    <div className="space-y-6">
      <Card className="border-[3px] border-[#0f172a] shadow-[0_8px_0_rgba(15,23,42,0.7)] hover:shadow-[0_10px_0_rgba(15,23,42,0.7)] hover:translate-y-[-2px] transition-all duration-300 overflow-hidden bg-[#151e2d]">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-extrabold text-white">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-[#33C3F0]" />
                Weekly Reflection
              </div>
            </CardTitle>
            <Badge className="bg-[#33C3F0]/20 text-[#33C3F0] border-[#33C3F0]/30 px-2">
              {formattedDate}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-6">
            {/* Summary Section */}
            <div className="p-4 rounded-lg bg-[#1e293b]/50 border-l-4 border-[#33C3F0] text-white italic">
              <div className="flex">
                <Sparkles className="h-5 w-5 text-[#33C3F0] mr-2 flex-shrink-0 mt-1" />
                <p>{reflection.summary}</p>
              </div>
            </div>
            
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-[#1e293b]/30 p-4 rounded-lg border border-[#0f172a]/30">
                <div className="flex items-center text-[#33C3F0] mb-2">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  <span className="text-sm font-semibold">Tasks</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {reflection.stats.tasksCompleted}/{reflection.stats.totalTasks}
                </p>
                <p className="text-xs text-white/60">completed tasks</p>
              </div>
              
              <div className="bg-[#1e293b]/30 p-4 rounded-lg border border-[#0f172a]/30">
                <div className="flex items-center text-[#33C3F0] mb-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm font-semibold">Focus Time</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {reflection.stats.totalFocusMinutes}
                </p>
                <p className="text-xs text-white/60">minutes</p>
              </div>
              
              <div className="bg-[#1e293b]/30 p-4 rounded-lg border border-[#0f172a]/30">
                <div className="flex items-center text-[#33C3F0] mb-2">
                  <FileText className="h-4 w-4 mr-2" />
                  <span className="text-sm font-semibold">Sessions</span>
                </div>
                <p className="text-2xl font-bold text-white">
                  {reflection.stats.focusSessionsCount}
                </p>
                <p className="text-xs text-white/60">focus sessions</p>
              </div>
            </div>
            
            {/* Momentum & Mood Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#1e293b]/30 p-4 rounded-lg border border-[#0f172a]/30">
                <div className="flex items-center text-[#33C3F0] mb-3">
                  <LineChart className="h-4 w-4 mr-2" />
                  <span className="text-sm font-semibold">Progress Momentum</span>
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-[#0f172a] rounded-full h-2.5 mr-2">
                    <div 
                      className="bg-[#33C3F0] h-2.5 rounded-full" 
                      style={{ width: `${reflection.progressMomentum * 10}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-bold">{reflection.progressMomentum}/10</span>
                </div>
                
                <div className="mt-4 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-xs text-white/60">Mood:</span>
                    <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                      {reflection.moodTrend}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/60">Energy:</span>
                    <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                      {reflection.energyLevel}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-white/60">Streak:</span>
                    <Badge variant="outline" className="text-xs px-2 py-0 h-5">
                      {reflection.stats.streakStatus}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Goals Section */}
              <div className="bg-[#1e293b]/30 p-4 rounded-lg border border-[#0f172a]/30">
                <div className="flex items-center text-[#33C3F0] mb-3">
                  <Goal className="h-4 w-4 mr-2" />
                  <span className="text-sm font-semibold">Goal Activity</span>
                </div>
                
                {reflection.activeGoals.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-white/60 mb-1">Active Goals:</p>
                    <div className="space-y-1">
                      {reflection.activeGoals.map((goal, index) => (
                        <div key={index} className="text-sm text-white bg-[#0f172a]/50 py-1 px-2 rounded flex items-center">
                          <Star className="h-3 w-3 text-[#33C3F0] mr-2" />
                          {goal}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {reflection.ignoredGoals.length > 0 && (
                  <div>
                    <p className="text-xs text-white/60 mb-1">Needs Attention:</p>
                    <div className="space-y-1">
                      {reflection.ignoredGoals.map((goal, index) => (
                        <div key={index} className="text-sm text-white bg-[#0f172a]/50 py-1 px-2 rounded flex items-center">
                          <ListTodo className="h-3 w-3 text-amber-400 mr-2" />
                          {goal}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Next Week Focus */}
            <div className="bg-[#1e293b]/30 p-4 rounded-lg border border-[#0f172a]/30">
              <div className="flex items-center text-[#33C3F0] mb-3">
                <Lightbulb className="h-4 w-4 mr-2" />
                <span className="text-sm font-semibold">Focus for Next Week</span>
              </div>
              
              <div className="space-y-2">
                {reflection.nextWeekFocus.map((focus, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-[#33C3F0]/20 text-white p-3 rounded-lg flex items-start">
                      <Zap className="h-4 w-4 text-[#33C3F0] mr-2 flex-shrink-0 mt-0.5" />
                      <span>{focus}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReflectionView;
