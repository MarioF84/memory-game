import { useGameStore } from './store/gameStore';
import StartScreen from './components/StartScreen';
import GameBoard from './components/GameBoard';
import ResultScreen from './components/ResultScreen';

function App() {
  const screen = useGameStore((state) => state.screen);

  return (
    <>
      {screen === 'start' && <StartScreen />}
      {screen === 'game' && <GameBoard />}
      {screen === 'result' && <ResultScreen />}
    </>
  );
}

export default App;
