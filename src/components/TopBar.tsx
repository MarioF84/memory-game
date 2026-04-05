import { useGameStore } from '../store/gameStore';

export default function TopBar() {
  const { players, currentPlayerIndex, switchingPlayer } = useGameStore();

  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="flex items-stretch gap-0 shadow-lg">
        {players.map((player, idx) => {
          const isActive = currentPlayerIndex === idx && !switchingPlayer;
          const isNext = currentPlayerIndex !== idx && switchingPlayer;

          return (
            <div
              key={idx}
              className={`flex-1 flex flex-col items-center justify-center py-1.5 px-2 transition-all duration-500
                ${isActive ? 'scale-100' : 'scale-95 opacity-70'}
              `}
              style={{
                backgroundColor: isActive ? player.color : '#e5e7eb',
                borderBottom: isActive ? `4px solid ${player.color}` : '4px solid transparent',
              }}
            >
              <div className="flex items-center gap-1">
                {isActive && (
                  <span className="text-white text-sm animate-bounce">▶</span>
                )}
                {isNext && (
                  <span className="text-sm animate-spin">⏳</span>
                )}
                <span
                  className={`text-sm font-extrabold truncate max-w-[90px]
                    ${isActive ? 'text-white' : 'text-gray-500'}
                  `}
                >
                  {player.name}
                </span>
              </div>
              <div
                className={`text-2xl font-black leading-none
                  ${isActive ? 'text-white' : 'text-gray-400'}
                `}
              >
                {player.score}
              </div>
              <div
                className={`text-[10px] font-semibold
                  ${isActive ? 'text-white/80' : 'text-gray-400'}
                `}
              >
                {isActive ? "YOUR TURN" : "waiting..."}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
