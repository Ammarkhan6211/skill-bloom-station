import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/data/mockData';
import { Trophy, RotateCcw, Clock, Shuffle } from 'lucide-react';

interface PuzzleGameProps {
  game: Game;
  onComplete: (gameId: string, xpEarned: number) => void;
  onClose: () => void;
}

export const PuzzleGame: React.FC<PuzzleGameProps> = ({ game, onComplete, onClose }) => {
  const [tiles, setTiles] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  const gridSize = 3;
  const totalTiles = gridSize * gridSize;

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

  // Check for completion
  useEffect(() => {
    if (tiles.length > 0) {
      const isCompleted = tiles.every((tile, index) => 
        index === totalTiles - 1 ? tile === 0 : tile === index + 1
      );
      if (isCompleted && !gameCompleted) {
        setGameCompleted(true);
      }
    }
  }, [tiles, gameCompleted]);

  const initializeGame = () => {
    // Create solved state: [1, 2, 3, 4, 5, 6, 7, 8, 0]
    let newTiles = Array.from({ length: totalTiles - 1 }, (_, i) => i + 1);
    newTiles.push(0); // Empty space

    // Shuffle the tiles with valid moves to ensure solvability
    for (let i = 0; i < 100; i++) {
      const validMoves = getValidMoves(newTiles);
      if (validMoves.length > 0) {
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        newTiles = makeMove(newTiles, randomMove);
      }
    }

    setTiles(newTiles);
    setMoves(0);
    setTimeElapsed(0);
    setGameCompleted(false);
  };

  const getEmptyIndex = (currentTiles: number[]) => {
    return currentTiles.indexOf(0);
  };

  const getValidMoves = (currentTiles: number[]) => {
    const emptyIndex = getEmptyIndex(currentTiles);
    const row = Math.floor(emptyIndex / gridSize);
    const col = emptyIndex % gridSize;
    const validMoves = [];

    // Up
    if (row > 0) validMoves.push(emptyIndex - gridSize);
    // Down  
    if (row < gridSize - 1) validMoves.push(emptyIndex + gridSize);
    // Left
    if (col > 0) validMoves.push(emptyIndex - 1);
    // Right
    if (col < gridSize - 1) validMoves.push(emptyIndex + 1);

    return validMoves;
  };

  const makeMove = (currentTiles: number[], tileIndex: number) => {
    const emptyIndex = getEmptyIndex(currentTiles);
    const newTiles = [...currentTiles];
    
    // Swap the clicked tile with the empty space
    newTiles[emptyIndex] = newTiles[tileIndex];
    newTiles[tileIndex] = 0;
    
    return newTiles;
  };

  const handleTileClick = (tileIndex: number) => {
    if (gameCompleted || tiles[tileIndex] === 0) return;

    const validMoves = getValidMoves(tiles);
    if (validMoves.includes(tileIndex)) {
      setTiles(makeMove(tiles, tileIndex));
      setMoves(prev => prev + 1);
    }
  };

  const handleComplete = () => {
    // Calculate XP based on performance
    const timeBonus = Math.max(0, 180 - timeElapsed); // Bonus for completing under 3 minutes
    const moveBonus = Math.max(0, 50 - moves); // Bonus for fewer moves
    const xpEarned = Math.round(game.xp + timeBonus / 2 + moveBonus);
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
          <h3 className="text-2xl font-bold mb-2">Puzzle Solved!</h3>
          <p className="text-lg text-muted-foreground">
            You completed the sliding puzzle!
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{moves}</div>
                <div className="text-sm text-muted-foreground">Moves</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
            </div>
            <div className="text-center mt-4">
              <Badge variant="outline" className="text-xp-gold">
                +{game.xp + Math.max(0, 180 - timeElapsed) / 2 + Math.max(0, 50 - moves)} XP Earned
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
        </div>
        <Button variant="outline" size="sm" onClick={initializeGame}>
          <Shuffle className="h-4 w-4 mr-2" />
          Shuffle
        </Button>
      </div>

      {/* Instructions */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Click on tiles adjacent to the empty space to move them. Arrange the numbers from 1 to 8 in order!
          </p>
        </CardContent>
      </Card>

      {/* Game Board */}
      <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`
              aspect-square border-2 border-border rounded-lg cursor-pointer
              flex items-center justify-center text-xl font-bold
              transition-all duration-200 hover:shadow-md
              ${tile === 0 ? 'bg-muted/50' : 'bg-primary text-primary-foreground hover:bg-primary-dark'}
            `}
            onClick={() => handleTileClick(index)}
          >
            {tile === 0 ? '' : tile}
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