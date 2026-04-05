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

  // Delay the color switch so it only changes after the player has lifted
  // their finger from the card (~400 ms after isWaitingForSecondPlayer fires).
  const [delayedIsWaiting, setDelayedIsWaiting] = useState(false);
  useEffect(() => {
    if (isWaitingForSecondPlayer) {
      const t = setTimeout(() => setDelayedIsWaiting(true), 400);
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
      <TopBar />

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
          disabled={!isWaitingForSecondPlayer}
          className="w-full py-2.5 rounded-2xl text-base font-extrabold text-white shadow transition-all active:scale-95"
          style={{
            backgroundColor: isWaitingForSecondPlayer ? otherPlayer.color : '#d1d5db',
            opacity: isWaitingForSecondPlayer ? 1 : 0.4,
          }}
        >
          {isWaitingForSecondPlayer
            ? `🙈 Hide Cards & ${otherPlayer.name}'s Turn!`
            : '🙈 Hide Cards'}
        </button>
      </div>
    </div>
  );
}
