import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { mockMentalHealthResources, MentalHealthResource } from '@/data/mockData';
import { 
  Heart, 
  Lightbulb, 
  Activity, 
  Quote,
  CheckCircle,
  Calendar,
  Smile,
  Meh,
  Frown,
  ExternalLink,
  BookOpen,
  Video,
  Music,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type MoodType = 'great' | 'good' | 'okay' | 'sad' | 'stressed';

interface MoodEntry {
  date: string;
  mood: MoodType;
  note?: string;
}

interface WellnessGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

const moodOptions = [
  { type: 'great' as MoodType, emoji: '😊', label: 'Great', color: 'text-secondary' },
  { type: 'good' as MoodType, emoji: '🙂', label: 'Good', color: 'text-primary' },
  { type: 'okay' as MoodType, emoji: '😐', label: 'Okay', color: 'text-muted-foreground' },
  { type: 'sad' as MoodType, emoji: '😔', label: 'Sad', color: 'text-accent' },
  { type: 'stressed' as MoodType, emoji: '😰', label: 'Stressed', color: 'text-destructive' }
];

const wellnessResources = [
  {
    id: '1',
    title: 'Meditation for Students',
    type: 'video',
    duration: '10 min',
    description: 'Guided meditation to reduce study stress',
    url: '#'
  },
  {
    id: '2', 
    title: 'Study-Life Balance Guide',
    type: 'article',
    duration: '5 min read',
    description: 'Tips for maintaining healthy study habits',
    url: '#'
  },
  {
    id: '3',
    title: 'Calm Study Music',
    type: 'audio',
    duration: '30 min',
    description: 'Relaxing background music for focused study',
    url: '#'
  }
];

export const MentalHealth = () => {
  const [resources, setResources] = useState<MentalHealthResource[]>(mockMentalHealthResources);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { date: '2024-01-10', mood: 'good' },
    { date: '2024-01-09', mood: 'great' },
    { date: '2024-01-08', mood: 'okay' },
    { date: '2024-01-07', mood: 'good' },
  ]);
  const [todayMood, setTodayMood] = useState<MoodType | null>(null);
  const [wellnessGoals] = useState<WellnessGoal[]>([
    { id: '1', title: 'Daily Meditation', target: 7, current: 4, unit: 'days/week' },
    { id: '2', title: 'Exercise', target: 5, current: 3, unit: 'times/week' },
    { id: '3', title: 'Sleep Hours', target: 8, current: 6.5, unit: 'hours' }
  ]);
  
  const { toast } = useToast();

  const toggleResourceCompletion = (id: string) => {
    setResources(resources.map(resource => 
      resource.id === id 
        ? { ...resource, completed: !resource.completed }
        : resource
    ));
    
    const resource = resources.find(r => r.id === id);
    toast({
      title: resource?.completed ? "Exercise unmarked" : "Exercise completed!",
      description: resource?.completed 
        ? "Removed from completed exercises" 
        : "Great job on taking care of your mental health!",
    });
  };

  const recordMood = (mood: MoodType) => {
    const today = new Date().toISOString().split('T')[0];
    setTodayMood(mood);
    setMoodEntries(prev => {
      const updated = prev.filter(entry => entry.date !== today);
      return [{ date: today, mood }, ...updated];
    });
    
    toast({
      title: "Mood recorded!",
      description: `Thanks for sharing how you're feeling today.`,
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'tip': return Lightbulb;
      case 'exercise': return Activity;
      case 'quote': return Quote;
      case 'article': return BookOpen;
      default: return Heart;
    }
  };

  const getWellnessIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'audio': return Music;
      case 'article': return BookOpen;
      default: return ExternalLink;
    }
  };

  const completedResources = resources.filter(r => r.completed).length;
  const completionPercentage = (completedResources / resources.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mental Health & Wellness</h2>
        <p className="text-muted-foreground">Take care of your mental well-being while you learn</p>
      </div>

      {/* Mood Tracker */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-wellness-calm" />
            Daily Mood Check-in
          </CardTitle>
          <CardDescription>How are you feeling today?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center gap-4">
            {moodOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => recordMood(option.type)}
                className={`
                  flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-smooth
                  ${todayMood === option.type 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-muted-foreground hover:bg-muted/50'
                  }
                `}
              >
                <span className="text-2xl">{option.emoji}</span>
                <span className={`text-sm font-medium ${option.color}`}>{option.label}</span>
              </button>
            ))}
          </div>
          
          {moodEntries.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium mb-3">Recent Mood History</h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {moodEntries.slice(0, 7).map((entry, index) => {
                  const mood = moodOptions.find(m => m.type === entry.mood);
                  return (
                    <div key={index} className="flex flex-col items-center gap-1 min-w-[60px]">
                      <span className="text-lg">{mood?.emoji}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString([], { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Wellness Goals */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-wellness-energy" />
            Wellness Goals
          </CardTitle>
          <CardDescription>Track your mental health goals this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {wellnessGoals.map((goal) => (
            <div key={goal.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{goal.title}</span>
                <span className="text-sm text-muted-foreground">
                  {goal.current}/{goal.target} {goal.unit}
                </span>
              </div>
              <Progress value={(goal.current / goal.target) * 100} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Daily Exercises */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-wellness-focus" />
            Daily Mental Wellness Exercises
          </CardTitle>
          <CardDescription>
            Complete these exercises to improve your mental well-being
          </CardDescription>
          <div className="flex items-center gap-2 mt-2">
            <Progress value={completionPercentage} className="flex-1" />
            <span className="text-sm text-muted-foreground">
              {completedResources}/{resources.length} completed
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {resources.map((resource) => {
            const Icon = getResourceIcon(resource.type);
            return (
              <div
                key={resource.id}
                className={`
                  flex items-center gap-3 p-4 rounded-lg border transition-smooth
                  ${resource.completed 
                    ? 'bg-secondary/10 border-secondary' 
                    : 'bg-muted/30 border-border hover:bg-muted/50'
                  }
                `}
              >
                <Checkbox
                  checked={resource.completed}
                  onCheckedChange={() => toggleResourceCompletion(resource.id)}
                />
                <Icon className={`h-5 w-5 ${
                  resource.type === 'tip' ? 'text-wellness-energy' :
                  resource.type === 'exercise' ? 'text-wellness-focus' :
                  resource.type === 'quote' ? 'text-wellness-calm' :
                  'text-primary'
                }`} />
                <div className="flex-1">
                  <h4 className={`font-medium ${resource.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {resource.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{resource.content}</p>
                </div>
                {resource.completed && (
                  <CheckCircle className="h-5 w-5 text-secondary" />
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Wellness Resources */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Wellness Resources
          </CardTitle>
          <CardDescription>Helpful content for maintaining mental health</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wellnessResources.map((resource) => {
              const Icon = getWellnessIcon(resource.type);
              return (
                <div
                  key={resource.id}
                  className="p-4 border border-border rounded-lg hover:shadow-md transition-smooth cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{resource.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {resource.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {resource.duration}
                        </Badge>
                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Support */}
      <Card className="shadow-card bg-gradient-to-r from-wellness-calm/10 to-wellness-focus/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-destructive" />
            Need Immediate Support?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              If you're experiencing severe stress, anxiety, or depression, don't hesitate to reach out for help.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Student Counseling
              </Button>
              <Button variant="outline" size="sm">
                📞 Helpline: 1800-XXX-XXXX
              </Button>
              <Button variant="outline" size="sm">
                🏥 Find Mental Health Services
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};