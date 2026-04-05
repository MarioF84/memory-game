import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import TopBar from './TopBar';
import Card from './Card';

export default function GameBoard() {
  const {
    cards,
    players,
    currentPlayerIndex,
    flipCard,
    isWaitingForSecondPlayer,
    confirmMismatch,
    switchingPlayer,
    lastMatchedCards,
    flippedCards,
  } = useGameStore();

  const currentPlayer = players[currentPlayerIndex];
  const otherPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  const otherPlayer = players[otherPlayerIndex];

  // Delay the color switch and hide button activation by 1s after the last
  // card tap so the current player can see the mismatch before handing over.
  const [delayedIsWaiting, setDelayedIsWaiting] = useState(false);
  useEffect(() => {
    if (isWaitingForSecondPlayer) {
      const t = setTimeout(() => setDelayedIsWaiting(true), 1000);
      return () => clearTimeout(t);
    } else {
      setDelayedIsWaiting(false);
    }
  }, [isWaitingForSecondPlayer]);

  const displayColor = delayedIsWaiting ? otherPlayer.color : currentPlayer.color;

  return (
    <div
      className="h-dvh flex flex-col"
      style={{ backgroundColor: displayColor + '18' }}
    >
      <TopBar visualActivePlayerIndex={delayedIsWaiting ? otherPlayerIndex as 0 | 1 : currentPlayerIndex} />

      {/* Status Banner */}
      <div
        className="py-2 px-4 text-center font-bold text-white text-sm shadow"
        style={{ backgroundColor: displayColor }}
      >
        {switchingPlayer ? (
          <span className="animate-pulse">🔄 Switching to {otherPlayer.name}...</span>
        ) : isWaitingForSecondPlayer ? (
          <span>
            👀 <strong>{otherPlayer.name}</strong>, please confirm! Then it's your turn ▶️
          </span>
        ) : flippedCards.length === 1 ? (
          <span>🎴 <strong>{currentPlayer.name}</strong>, flip the second card!</span>
        ) : (
          <span>⭐ <strong>{currentPlayer.name}</strong>, flip two cards!</span>
        )}
      </div>

      {/* Card Grid: 8 rows × 4 cols */}
      <div className="flex-1 p-2 min-h-0">
        <div className="grid grid-cols-4 grid-rows-8 gap-1.5 h-full">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => !isWaitingForSecondPlayer && !switchingPlayer && flipCard(card.id)}
              playerColor={displayColor}
              isLastMatched={lastMatchedCards?.includes(card.id) ?? false}
            />
          ))}
        </div>
      </div>

      {/* Confirm Mismatch Button — always in layout, disabled when not needed */}
      <div className="px-3 pb-2 pt-1">
        <button
          onClick={confirmMismatch}
          disabled={!delayedIsWaiting}
          className="relative overflow-hidden w-full py-2.5 rounded-2xl text-base font-extrabold text-white shadow transition-transform active:scale-95"
          style={{
            backgroundColor: delayedIsWaiting ? otherPlayer.color : '#d1d5db',
            opacity: delayedIsWaiting ? 1 : 0.4,
          }}
        >
          {isWaitingForSecondPlayer && !delayedIsWaiting && (
            <span className="absolute inset-y-0 left-0 bg-white/30 animate-progress-fill" />
          )}
          {delayedIsWaiting
            ? `🙈 Hide Cards & ${otherPlayer.name}'s Turn!`
            : '🙈 Hide Cards'}
        </button>
      </div>
    </div>
  );
}
