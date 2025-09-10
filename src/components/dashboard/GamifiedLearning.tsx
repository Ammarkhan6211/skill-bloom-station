import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { mockCourses, mockGames, Course, Game } from '@/data/mockData';
import { 
  BookOpen, 
  Gamepad2, 
  Trophy, 
  Star, 
  Play, 
  Lock,
  Award,
  Zap,
  Target,
  Brain
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MiniGameModal } from '@/components/games/MiniGameModal';

export const GamifiedLearning = () => {
  const [courses] = useState<Course[]>(mockCourses);
  const [games, setGames] = useState<Game[]>(mockGames);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showGameModal, setShowGameModal] = useState(false);
  const { toast } = useToast();

  const handlePlayGame = (game: Game) => {
    setSelectedGame(game);
    setShowGameModal(true);
  };

  const handleGameComplete = (gameId: string, xpEarned: number) => {
    setGames(games.map(game => 
      game.id === gameId 
        ? { ...game, completed: true, progress: 100 }
        : game
    ));
    
    toast({
      title: "Game completed!",
      description: `You earned ${xpEarned} XP points!`,
    });
    
    setShowGameModal(false);
    setSelectedGame(null);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'progress-beginner';
      case 'Intermediate': return 'progress-intermediate'; 
      case 'Advanced': return 'progress-advanced';
      default: return 'primary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Gamified Learning</h2>
        <p className="text-muted-foreground">Level up your skills through interactive courses and games</p>
      </div>

      {/* XP Summary */}
      <Card className="shadow-card bg-gradient-gamification text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">Your Learning Journey</h3>
              <p className="text-white/80">Complete courses and games to earn XP and unlock new content</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold flex items-center gap-2">
                <Zap className="h-8 w-8 text-xp-gold" />
                1250 XP
              </div>
              <div className="text-sm text-white/80">Total Experience Points</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Interactive Courses</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Card key={course.id} className={`shadow-card hover:shadow-elevated transition-smooth ${!course.isUnlocked ? 'opacity-60' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{course.thumbnail}</div>
                    <div>
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <CardDescription>{course.category}</CardDescription>
                    </div>
                  </div>
                  {!course.isUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className={`text-${getLevelColor(course.level)}`}
                  >
                    {course.level}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-xp-gold">
                    <Star className="h-4 w-4" />
                    {course.xp} XP
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>

                <Button 
                  className={`w-full transition-smooth ${
                    course.isUnlocked 
                      ? 'bg-gradient-primary hover:bg-primary-dark' 
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                  disabled={!course.isUnlocked}
                >
                  {course.isUnlocked ? (
                    course.progress > 0 ? 'Continue Learning' : 'Start Course'
                  ) : (
                    'Locked'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Mini Games Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Learning Games</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Card key={game.id} className="shadow-card hover:shadow-elevated transition-smooth">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {game.type === 'quiz' && <Brain className="h-5 w-5 text-primary" />}
                      {game.type === 'memory' && <Target className="h-5 w-5 text-secondary" />}
                      {game.type === 'puzzle' && <Trophy className="h-5 w-5 text-accent" />}
                      {game.title}
                    </CardTitle>
                    <CardDescription>{game.description}</CardDescription>
                  </div>
                  {game.completed && <Award className="h-5 w-5 text-xp-gold" />}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-xp-gold">
                    <Star className="h-4 w-4" />
                    {game.xp} XP
                  </div>
                  <Badge variant={game.completed ? 'default' : 'secondary'}>
                    {game.completed ? 'Completed' : 'Available'}
                  </Badge>
                </div>
                
                {game.progress > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span>{game.progress}%</span>
                    </div>
                    <Progress value={game.progress} />
                  </div>
                )}

                <Button 
                  onClick={() => handlePlayGame(game)}
                  className="w-full bg-gradient-primary hover:bg-primary-dark transition-smooth"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {game.completed ? 'Play Again' : game.progress > 0 ? 'Continue' : 'Start Game'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Game Modal */}
      {selectedGame && (
        <MiniGameModal
          game={selectedGame}
          isOpen={showGameModal}
          onClose={() => {
            setShowGameModal(false);
            setSelectedGame(null);
          }}
          onComplete={handleGameComplete}
        />
      )}
    </div>
  );
};