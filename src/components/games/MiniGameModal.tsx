import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Game } from '@/data/mockData';
import { QuizGame } from './QuizGame';
import { MemoryGame } from './MemoryGame';
import { PuzzleGame } from './PuzzleGame';

interface MiniGameModalProps {
  game: Game;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (gameId: string, xpEarned: number) => void;
}

export const MiniGameModal: React.FC<MiniGameModalProps> = ({
  game,
  isOpen,
  onClose,
  onComplete
}) => {
  const renderGame = () => {
    switch (game.type) {
      case 'quiz':
        return <QuizGame game={game} onComplete={onComplete} onClose={onClose} />;
      case 'memory':
        return <MemoryGame game={game} onComplete={onComplete} onClose={onClose} />;
      case 'puzzle':
        return <PuzzleGame game={game} onComplete={onComplete} onClose={onClose} />;
      default:
        return <div>Game type not supported</div>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{game.title}</DialogTitle>
        </DialogHeader>
        {renderGame()}
      </DialogContent>
    </Dialog>
  );
};