import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  Brain, 
  Trophy, 
  Target,
  TrendingUp,
  Award,
  Clock,
  Star
} from 'lucide-react';

export const DashboardOverview = () => {
  const { student } = useAuth();

  if (!student) return null;

  const progressItems = [
    {
      label: 'Courses Completed',
      value: student.progress.coursesCompleted,
      icon: BookOpen,
      color: 'progress-beginner'
    },
    {
      label: 'Quiz Score',
      value: student.progress.quizScore,
      icon: Brain,
      color: 'progress-intermediate'
    },
    {
      label: 'Skills Unlocked',
      value: student.progress.skillsUnlocked,
      icon: Target,
      color: 'progress-advanced'
    },
    {
      label: 'Games Completed',
      value: student.progress.gamesCompleted,
      icon: Trophy,
      color: 'xp-gold'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-primary p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {student.name}!</h1>
            <p className="text-primary-foreground/80 mt-1">
              Continue your learning journey and achieve your goals
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{student.xp}</div>
            <div className="text-sm text-primary-foreground/80">Total XP</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {progressItems.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {item.label}
                </CardTitle>
                <Icon className={`h-4 w-4 text-${item.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}%</div>
                <Progress 
                  value={item.value} 
                  className="mt-2" 
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {item.value >= 75 ? 'Excellent progress!' : 
                   item.value >= 50 ? 'Good progress' : 
                   'Keep going!'}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Level & Badges */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-xp-gold" />
              Achievements
            </CardTitle>
            <CardDescription>Your learning milestones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold">Level {student.level}</div>
                <div className="text-sm text-muted-foreground">Current Level</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{student.badges.length}</div>
                <div className="text-sm text-muted-foreground">Badges Earned</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Recent Badges:</div>
              <div className="flex flex-wrap gap-2">
                {student.badges.length > 0 ? (
                  student.badges.map((badge, index) => (
                    <Badge key={index} variant="secondary" className="bg-gradient-accent text-white">
                      <Star className="h-3 w-3 mr-1" />
                      {badge}
                    </Badge>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">Complete your first course to earn badges!</div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your learning activity this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-secondary rounded-full"></div>
                <div className="flex-1 text-sm">Completed React Fundamentals lesson</div>
                <div className="text-xs text-muted-foreground">2 days ago</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-accent rounded-full"></div>
                <div className="flex-1 text-sm">Earned "Quiz Master" badge</div>
                <div className="text-xs text-muted-foreground">3 days ago</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <div className="flex-1 text-sm">Started Data Structures course</div>
                <div className="text-xs text-muted-foreground">5 days ago</div>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Last active: Today at 2:30 PM</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump into your learning activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center cursor-pointer hover:bg-muted/80 transition-smooth">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-sm font-medium">Continue Course</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center cursor-pointer hover:bg-muted/80 transition-smooth">
              <Brain className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <div className="text-sm font-medium">Take Quiz</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center cursor-pointer hover:bg-muted/80 transition-smooth">
              <Trophy className="h-8 w-8 mx-auto mb-2 text-xp-gold" />
              <div className="text-sm font-medium">Play Game</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center cursor-pointer hover:bg-muted/80 transition-smooth">
              <Target className="h-8 w-8 mx-auto mb-2 text-accent" />
              <div className="text-sm font-medium">Set Goals</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};