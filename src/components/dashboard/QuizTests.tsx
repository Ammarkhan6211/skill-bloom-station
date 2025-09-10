import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { mockQuizzes, Quiz } from '@/data/mockData';
import { 
  Brain, 
  Clock, 
  Trophy, 
  Play, 
  CheckCircle,
  XCircle,
  Star,
  Timer,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  timeTaken: number;
  date: Date;
}

export const QuizTests = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const { toast } = useToast();

  // Timer logic
  useEffect(() => {
    if (timeLeft > 0 && activeQuiz && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && activeQuiz) {
      handleSubmitQuiz();
    }
  }, [timeLeft, activeQuiz, showResults]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setTimeLeft(quiz.timeLimit);
    setQuizStartTime(new Date());
    setShowResults(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);

    if (currentQuestion + 1 < activeQuiz!.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      handleSubmitQuiz(newAnswers);
    }
  };

  const handleSubmitQuiz = (finalAnswers?: number[]) => {
    if (!activeQuiz || !quizStartTime) return;

    const submittedAnswers = finalAnswers || [...answers, selectedAnswer !== null ? selectedAnswer : -1];
    const score = submittedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === activeQuiz.questions[index].correct ? 1 : 0);
    }, 0);

    const timeTaken = Math.floor((new Date().getTime() - quizStartTime.getTime()) / 1000);
    
    const result: QuizResult = {
      quizId: activeQuiz.id,
      score,
      totalQuestions: activeQuiz.questions.length,
      timeTaken,
      date: new Date()
    };

    setResults(prev => [...prev, result]);
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === activeQuiz.id 
        ? { ...quiz, attempted: true, score: Math.round((score / activeQuiz.questions.length) * 100) }
        : quiz
    ));
    
    setShowResults(true);
    
    toast({
      title: "Quiz completed!",
      description: `You scored ${score}/${activeQuiz.questions.length} (${Math.round((score / activeQuiz.questions.length) * 100)}%)`,
    });
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setShowResults(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setTimeLeft(0);
    setQuizStartTime(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (activeQuiz && showResults) {
    const latestResult = results[results.length - 1];
    const percentage = (latestResult.score / latestResult.totalQuestions) * 100;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-xp-gold mb-4" />
          <h2 className="text-2xl font-bold mb-2">Quiz Results</h2>
          <p className="text-muted-foreground">{activeQuiz.title}</p>
        </div>

        <Card className="shadow-card">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <div className="text-5xl font-bold text-primary">{percentage.toFixed(0)}%</div>
                <div className="text-lg text-muted-foreground">Overall Score</div>
              </div>
              
              <Progress value={percentage} className="w-full h-4" />
              
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{latestResult.score}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">
                    {latestResult.totalQuestions - latestResult.score}
                  </div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent">{formatTime(latestResult.timeTaken)}</div>
                  <div className="text-sm text-muted-foreground">Time Taken</div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Badge variant="outline" className="text-xp-gold">
                  <Star className="h-3 w-3 mr-1" />
                  +{Math.round(percentage)} XP Earned
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={closeQuiz} className="flex-1">
            Back to Quizzes
          </Button>
          <Button onClick={() => startQuiz(activeQuiz)} className="flex-1 bg-gradient-primary">
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  if (activeQuiz) {
    const question = activeQuiz.questions[currentQuestion];
    return (
      <div className="space-y-6">
        {/* Quiz Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{activeQuiz.title}</h2>
            <p className="text-muted-foreground">
              Question {currentQuestion + 1} of {activeQuiz.questions.length}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span className={`font-bold text-lg ${timeLeft <= 30 ? 'text-destructive' : ''}`}>
                {formatTime(timeLeft)}
              </span>
            </div>
            <Button variant="outline" onClick={closeQuiz}>
              Exit Quiz
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(((currentQuestion + 1) / activeQuiz.questions.length) * 100)}%</span>
          </div>
          <Progress value={((currentQuestion + 1) / activeQuiz.questions.length) * 100} />
        </div>

        {/* Question */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className="w-full text-left justify-start p-4 h-auto"
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="font-medium mr-3 text-primary">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1">{option}</span>
                {selectedAnswer === index && (
                  <CheckCircle className="h-4 w-4 ml-2" />
                )}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            disabled={currentQuestion === 0}
            onClick={() => {
              if (currentQuestion > 0) {
                setCurrentQuestion(currentQuestion - 1);
                setSelectedAnswer(answers[currentQuestion - 1] ?? null);
              }
            }}
          >
            Previous
          </Button>
          <Button 
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null}
            className="bg-gradient-primary hover:bg-primary-dark"
          >
            {currentQuestion + 1 === activeQuiz.questions.length ? 'Submit Quiz' : 'Next Question'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Quiz & Aptitude Tests</h2>
        <p className="text-muted-foreground">Test your knowledge and track your progress</p>
      </div>

      {/* Quiz Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{results.length}</div>
            <div className="text-sm text-muted-foreground">Quizzes Completed</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-secondary" />
            <div className="text-2xl font-bold">
              {results.length > 0 
                ? Math.round(results.reduce((acc, r) => acc + (r.score / r.totalQuestions * 100), 0) / results.length)
                : 0}%
              </div>
            <div className="text-sm text-muted-foreground">Average Score</div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="p-6 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-xp-gold" />
            <div className="text-2xl font-bold">
              {results.reduce((acc, r) => acc + Math.round(r.score / r.totalQuestions * 100), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total XP Earned</div>
          </CardContent>
        </Card>
      </div>

      {/* Available Quizzes */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Available Tests</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="shadow-card hover:shadow-elevated transition-smooth">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      {quiz.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {quiz.questions.length} questions • {formatTime(quiz.timeLimit)} time limit
                    </CardDescription>
                  </div>
                  {quiz.attempted && (
                    <Badge variant="secondary">
                      {quiz.score}% Score
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {formatTime(quiz.timeLimit)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {quiz.questions.length} questions
                  </div>
                </div>
                
                <Button 
                  onClick={() => startQuiz(quiz)}
                  className="w-full bg-gradient-primary hover:bg-primary-dark transition-smooth"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {quiz.attempted ? 'Retake Test' : 'Start Test'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Recent Results</h3>
          <div className="space-y-3">
            {results.slice(-3).reverse().map((result, index) => {
              const quiz = quizzes.find(q => q.id === result.quizId);
              const percentage = (result.score / result.totalQuestions) * 100;
              return (
                <Card key={index} className="shadow-card">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{quiz?.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {result.date.toLocaleDateString()} • {formatTime(result.timeTaken)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{percentage.toFixed(0)}%</div>
                        <div className="text-sm text-muted-foreground">
                          {result.score}/{result.totalQuestions}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};