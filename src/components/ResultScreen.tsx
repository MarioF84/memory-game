import { useGameStore } from '../store/gameStore';

export default function ResultScreen() {
  const { players, resetGame, goToStart } = useGameStore();

  const [p1, p2] = players;
  const isDraw = p1.score === p2.score;
  const winner = isDraw ? null : (p1.score > p2.score ? p1 : p2);
  const loser = isDraw ? null : (p1.score > p2.score ? p2 : p1);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-yellow-200 to-orange-100 px-4 py-8">
      {/* Trophy / Result */}
      <div className="text-center mb-6">
        <div className="text-7xl mb-3 animate-bounce">{isDraw ? '🤝' : '🏆'}</div>
        {isDraw ? (
          <h1 className="text-3xl font-extrabold text-orange-700">It's a Draw!</h1>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold" style={{ color: winner!.color }}>
              {winner!.name} Wins! 🎉
            </h1>
            <p className="text-gray-600 text-base mt-1">
              Better luck next time, {loser!.name}!
            </p>
          </>
        )}
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm mb-6">
        <h2 className="text-lg font-bold text-gray-500 text-center mb-4 uppercase tracking-wider">Final Score</h2>
        <div className="flex justify-around">
          {players.map((player, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-md mb-2"
                style={{ backgroundColor: player.color }}
              >
                {player.score}
              </div>
              <span className="text-base font-bold text-gray-700">{player.name}</span>
              {!isDraw && player === winner && (
                <span className="text-yellow-500 text-xl mt-1">👑</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="w-full max-w-sm space-y-3">
        <button
          onClick={() => resetGame(true)}
          className="w-full py-4 rounded-2xl text-xl font-extrabold text-white shadow-lg active:scale-95 transition-transform bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600"
        >
          🔄 Revanche! (Same Players)
        </button>
        <button
          onClick={goToStart}
          className="w-full py-4 rounded-2xl text-xl font-extrabold text-white shadow-lg active:scale-95 transition-transform bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600"
        >
          🏠 New Game
        </button>
      </div>

      <p className="mt-6 text-gray-400 text-sm">Memory Game 🎴</p>
    </div>
  );
}
