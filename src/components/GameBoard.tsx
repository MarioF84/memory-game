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

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: currentPlayer.color + '18' }}
    >
      <TopBar />

      {/* Status Banner */}
      <div
        className="py-2 px-4 text-center font-bold text-white text-sm shadow"
        style={{ backgroundColor: currentPlayer.color }}
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
      <div className="flex-1 p-3">
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => !isWaitingForSecondPlayer && !switchingPlayer && flipCard(card.id)}
              playerColor={currentPlayer.color}
              isLastMatched={lastMatchedCards?.includes(card.id) ?? false}
            />
          ))}
        </div>
      </div>

      {/* Confirm Mismatch Button */}
      {isWaitingForSecondPlayer && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t shadow-2xl z-50">
          <div className="max-w-sm mx-auto">
            <p className="text-center text-gray-600 text-sm mb-2">
              No match! <strong>{otherPlayer.name}</strong>, tap below to hide cards and take your turn.
            </p>
            <button
              onClick={confirmMismatch}
              className="w-full py-4 rounded-2xl text-xl font-extrabold text-white shadow-lg active:scale-95 transition-transform"
              style={{ backgroundColor: otherPlayer.color }}
            >
              🙈 Hide Cards & My Turn!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
