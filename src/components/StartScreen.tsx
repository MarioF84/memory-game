import { useState } from 'react';
import { useGameStore, PLAYER_COLORS } from '../store/gameStore';
import type { Player } from '../store/gameStore';

const DEFAULT_NAMES = ['Player 1', 'Player 2'];

export default function StartScreen() {
  const { setPlayers, startGame } = useGameStore();
  const [names, setNames] = useState([DEFAULT_NAMES[0], DEFAULT_NAMES[1]]);
  const [colorIndices, setColorIndices] = useState([0, 1]);

  const handleStart = () => {
    const p1: Player = { name: names[0] || DEFAULT_NAMES[0], color: PLAYER_COLORS[colorIndices[0]].value, score: 0 };
    const p2: Player = { name: names[1] || DEFAULT_NAMES[1], color: PLAYER_COLORS[colorIndices[1]].value, score: 0 };
    setPlayers(p1, p2);
    startGame();
  };

  const sameColor = colorIndices[0] === colorIndices[1];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-300 to-indigo-200 px-4 py-8">
      <div className="text-center mb-8">
        <div className="text-6xl mb-2">🎴</div>
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg tracking-wide">Memory Game</h1>
        <p className="text-white/80 text-lg mt-1 font-medium">2 Players • Fun for the whole family!</p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm space-y-6">
        {[0, 1].map((playerIdx) => (
          <div key={playerIdx}>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: PLAYER_COLORS[colorIndices[playerIdx]].value }}
              />
              <label className="font-bold text-gray-700 text-base">Player {playerIdx + 1}</label>
            </div>
            <input
              type="text"
              value={names[playerIdx]}
              onChange={(e) => {
                const newNames = [...names];
                newNames[playerIdx] = e.target.value;
                setNames(newNames);
              }}
              maxLength={15}
              placeholder={DEFAULT_NAMES[playerIdx]}
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-2 text-base font-semibold focus:outline-none focus:border-sky-400 mb-3"
            />
            <div className="flex gap-2 flex-wrap">
              {PLAYER_COLORS.map((color, colorIdx) => {
                const isSelected = colorIndices[playerIdx] === colorIdx;
                const isUsedByOther = colorIndices[1 - playerIdx] === colorIdx;
                return (
                  <button
                    key={colorIdx}
                    onClick={() => {
                      const newIndices = [...colorIndices];
                      newIndices[playerIdx] = colorIdx;
                      setColorIndices(newIndices);
                    }}
                    className={`w-9 h-9 rounded-full border-4 transition-transform ${
                      isSelected ? 'border-gray-700 scale-110' : 'border-transparent'
                    } ${isUsedByOther && !isSelected ? 'opacity-30' : ''}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {sameColor && (
          <p className="text-red-500 text-sm text-center font-semibold">
            ⚠️ Please choose different colors for each player!
          </p>
        )}

        <button
          onClick={handleStart}
          disabled={sameColor}
          className={`w-full py-4 rounded-2xl text-xl font-extrabold text-white shadow-lg transition-all
            ${sameColor
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-sky-400 to-indigo-500 hover:from-sky-500 hover:to-indigo-600 active:scale-95'
            }`}
        >
          🚀 Start Game!
        </button>
      </div>
    </div>
  );
}
