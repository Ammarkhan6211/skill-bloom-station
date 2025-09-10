import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/data/mockData';
import { Clock, CheckCircle, XCircle, Trophy } from 'lucide-react';

interface QuizGameProps {
  game: Game;
  onComplete: (gameId: string, xpEarned: number) => void;
  onClose: () => void;
}

const quizQuestions = [
  {
    question: "What is the correct way to declare a variable in JavaScript?",
    options: ["var myVar = 5;", "variable myVar = 5;", "v myVar = 5;", "declare myVar = 5;"],
    correct: 0
  },
  {
    question: "Which method is used to add an element to the end of an array?",
    options: ["append()", "push()", "add()", "insert()"],
    correct: 1
  },
  {
    question: "What does CSS stand for?",
    options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
    correct: 1
  },
  {
    question: "Which HTML tag is used for the largest heading?",
    options: ["<h6>", "<h1>", "<heading>", "<head>"],
    correct: 1
  },
  {
    question: "What is the purpose of the 'return' statement in a function?",
    options: ["To stop the function", "To send a value back", "To restart the function", "To delete the function"],
    correct: 1
  }
];

export const QuizGame: React.FC<QuizGameProps> = ({ game, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [timeLeft, showResult]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer !== null ? selectedAnswer : -1];
    setAnswers(newAnswers);
    
    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setTimeLeft(60);
    } else {
      // Calculate score
      const correctAnswers = newAnswers.reduce((acc, answer, index) => {
        return acc + (answer === quizQuestions[index].correct ? 1 : 0);
      }, 0);
      setScore(correctAnswers);
      setShowResult(true);
    }
  };

  const handleComplete = () => {
    const xpEarned = Math.round((score / quizQuestions.length) * game.xp);
    onComplete(game.id, xpEarned);
  };

  if (showResult) {
    const percentage = (score / quizQuestions.length) * 100;
    return (
      <div className="space-y-6 p-4">
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-xp-gold mb-4" />
          <h3 className="text-2xl font-bold mb-2">Quiz Completed!</h3>
          <p className="text-lg text-muted-foreground">
            You scored {score} out of {quizQuestions.length} questions
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">{percentage.toFixed(0)}%</div>
              <Progress value={percentage} className="w-full" />
              <div className="flex justify-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-secondary">{score}</div>
                  <div className="text-sm text-muted-foreground">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-destructive">{quizQuestions.length - score}</div>
                  <div className="text-sm text-muted-foreground">Incorrect</div>
                </div>
              </div>
              <Badge variant="outline" className="text-xp-gold">
                +{Math.round((score / quizQuestions.length) * game.xp)} XP Earned
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button onClick={handleComplete} className="flex-1 bg-gradient-primary">
            Claim Rewards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            Question {currentQuestion + 1} of {quizQuestions.length}
          </h3>
          <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span className={`font-bold ${timeLeft <= 10 ? 'text-destructive' : ''}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {quizQuestions[currentQuestion].question}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {quizQuestions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === index ? "default" : "outline"}
              className="w-full text-left justify-start p-4 h-auto"
              onClick={() => handleAnswerSelect(index)}
            >
              <span className="font-medium mr-3">{String.fromCharCode(65 + index)}.</span>
              {option}
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Exit Quiz
        </Button>
        <Button 
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
          className="flex-1 bg-gradient-primary"
        >
          {currentQuestion + 1 === quizQuestions.length ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </div>
    </div>
  );
};