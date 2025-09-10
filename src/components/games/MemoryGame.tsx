import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/data/mockData';
import { Trophy, RotateCcw, Clock } from 'lucide-react';

interface MemoryGameProps {
  game: Game;
  onComplete: (gameId: string, xpEarned: number) => void;
  onClose: () => void;
}

const cardSymbols = ['🌟', '🎯', '🚀', '💎', '🔥', '⚡', '🎨', '🎪'];

interface GameCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export const MemoryGame: React.FC<MemoryGameProps> = ({ game, onComplete, onClose }) => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  // Timer
  useEffect(() => {
    if (!gameCompleted) {
      const timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameCompleted]);

  // Check for matches
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);

      if (firstCard && secondCard && firstCard.symbol === secondCard.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  // Check for game completion
  useEffect(() => {
    if (matches === cardSymbols.length) {
      setGameCompleted(true);
    }
  }, [matches]);

  const initializeGame = () => {
    const gameCards = [...cardSymbols, ...cardSymbols]
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);
    
    setCards(gameCards);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setTimeElapsed(0);
    setGameCompleted(false);
  };

  const handleCardClick = (cardId: number) => {
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const handleComplete = () => {
    // Calculate XP based on performance
    const timeBonus = Math.max(0, 120 - timeElapsed); // Bonus for completing under 2 minutes
    const moveBonus = Math.max(0, 20 - moves); // Bonus for fewer moves
    const xpEarned = Math.round(game.xp + timeBonus + moveBonus);
    onComplete(game.id, xpEarned);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameCompleted) {
    return (
      <div className="space-y-6 p-4">
        <div className="text-center">
          <Trophy className="h-16 w-16 mx-auto text-xp-gold mb-4" />
          <h3 className="text-2xl font-bold mb-2">Congratulations!</h3>
          <p className="text-lg text-muted-foreground">
            You completed the memory game!
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{moves}</div>
                <div className="text-sm text-muted-foreground">Moves</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">{matches}/{cardSymbols.length}</div>
                <div className="text-sm text-muted-foreground">Matches</div>
              </div>
            </div>
            <div className="text-center mt-4">
              <Badge variant="outline" className="text-xp-gold">
                +{game.xp + Math.max(0, 120 - timeElapsed) + Math.max(0, 20 - moves)} XP Earned
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
      {/* Game Stats */}
      <div className="flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timeElapsed)}</span>
          </div>
          <div>Moves: {moves}</div>
          <div>Matches: {matches}/{cardSymbols.length}</div>
        </div>
        <Button variant="outline" size="sm" onClick={initializeGame}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`
              aspect-square bg-muted border-2 border-border rounded-lg cursor-pointer
              flex items-center justify-center text-2xl font-bold
              transition-all duration-300 hover:shadow-md
              ${card.isFlipped || card.isMatched ? 'bg-primary text-primary-foreground' : 'hover:bg-muted/80'}
              ${card.isMatched ? 'opacity-75' : ''}
            `}
            onClick={() => handleCardClick(card.id)}
          >
            {card.isFlipped || card.isMatched ? card.symbol : '?'}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Exit Game
        </Button>
      </div>
    </div>
  );
};