import { useEffect, useState } from 'react';
import type { Card as CardType } from '../store/gameStore';

interface CardProps {
  card: CardType;
  onClick: () => void;
  playerColor: string;
  isLastMatched: boolean;
}

export default function Card({ card, onClick, playerColor, isLastMatched }: CardProps) {
  const [matchAnim, setMatchAnim] = useState(false);

  useEffect(() => {
    if (isLastMatched) {
      setMatchAnim(true);
      const t = setTimeout(() => setMatchAnim(false), 600);
      return () => clearTimeout(t);
    }
  }, [isLastMatched]);

  if (card.isMatched) {
    return (
      <div
        className={`aspect-square rounded-2xl transition-all duration-500
          ${matchAnim ? 'scale-110' : 'scale-0 opacity-0'}
        `}
      />
    );
  }

  return (
    <div
      className="aspect-square perspective-1000 cursor-pointer select-none"
      onClick={onClick}
    >
      <div
        className={`relative w-full h-full transform-style-preserve-3d transition-transform duration-500
          ${card.isFlipped ? 'rotate-y-180' : ''}
        `}
      >
        {/* Card Back */}
        <div
          className="absolute inset-0 backface-hidden rounded-2xl flex items-center justify-center shadow-md border-4"
          style={{ borderColor: playerColor, backgroundColor: playerColor + '22' }}
        >
          <span className="text-3xl">❓</span>
        </div>

        {/* Card Front */}
        <div
          className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl flex flex-col items-center justify-center shadow-md bg-white border-4"
          style={{ borderColor: playerColor }}
        >
          <span className="text-3xl leading-none">{card.emoji}</span>
        </div>
      </div>
    </div>
  );
}
