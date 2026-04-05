import { create } from 'zustand';

export type GameScreen = 'start' | 'game' | 'result';

export interface Player {
  name: string;
  color: string;
  score: number;
}

export interface Card {
  id: number;
  pairId: number;
  emoji: string;
  label: string;
  isFlipped: boolean;
  isMatched: boolean;
}

// 16 unique pairs of cards with emojis
const CARD_PAIRS = [
  { emoji: '🌸', label: 'Cherry Blossom' },
  { emoji: '🌻', label: 'Sunflower' },
  { emoji: '🌈', label: 'Rainbow' },
  { emoji: '🦋', label: 'Butterfly' },
  { emoji: '🐶', label: 'Dog' },
  { emoji: '🐱', label: 'Cat' },
  { emoji: '🐸', label: 'Frog' },
  { emoji: '🦄', label: 'Unicorn' },
  { emoji: '🐠', label: 'Fish' },
  { emoji: '🐢', label: 'Turtle' },
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🐨', label: 'Koala' },
  { emoji: '🐙', label: 'Octopus' },
  { emoji: '🦜', label: 'Parrot' },
  { emoji: '🍓', label: 'Strawberry' },
  { emoji: '🍦', label: 'Ice Cream' },
];

export const PLAYER_COLORS = [
  { name: 'Red', value: '#ef4444', bg: 'bg-red-500', light: 'bg-red-100', border: 'border-red-500', text: 'text-red-600' },
  { name: 'Blue', value: '#3b82f6', bg: 'bg-blue-500', light: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-600' },
  { name: 'Green', value: '#22c55e', bg: 'bg-green-500', light: 'bg-green-100', border: 'border-green-500', text: 'text-green-600' },
  { name: 'Purple', value: '#a855f7', bg: 'bg-purple-500', light: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-600' },
  { name: 'Orange', value: '#f97316', bg: 'bg-orange-500', light: 'bg-orange-100', border: 'border-orange-500', text: 'text-orange-600' },
  { name: 'Pink', value: '#ec4899', bg: 'bg-pink-500', light: 'bg-pink-100', border: 'border-pink-500', text: 'text-pink-600' },
];

function createShuffledCards(): Card[] {
  const cards: Card[] = [];
  CARD_PAIRS.forEach((pair, pairId) => {
    cards.push({ id: pairId * 2, pairId, emoji: pair.emoji, label: pair.label, isFlipped: false, isMatched: false });
    cards.push({ id: pairId * 2 + 1, pairId, emoji: pair.emoji, label: pair.label, isFlipped: false, isMatched: false });
  });
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

interface GameState {
  screen: GameScreen;
  players: [Player, Player];
  currentPlayerIndex: 0 | 1;
  cards: Card[];
  flippedCards: number[]; // card ids currently flipped (max 2)
  isLocked: boolean; // prevent clicks during animation
  isWaitingForSecondPlayer: boolean; // after 1st player flips 2 non-matching cards
  switchingPlayer: boolean; // animation state for player switch
  lastMatchedCards: number[] | null; // for removal animation

  // Actions
  setPlayers: (p1: Player, p2: Player) => void;
  startGame: () => void;
  flipCard: (cardId: number) => void;
  confirmMismatch: () => void; // 2nd player confirms to hide cards
  resetGame: (samePlayersReversed?: boolean) => void;
  goToStart: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  screen: 'start',
  players: [
    { name: 'Player 1', color: '#ef4444', score: 0 },
    { name: 'Player 2', color: '#3b82f6', score: 0 },
  ],
  currentPlayerIndex: 0,
  cards: [],
  flippedCards: [],
  isLocked: false,
  isWaitingForSecondPlayer: false,
  switchingPlayer: false,
  lastMatchedCards: null,

  setPlayers: (p1, p2) => {
    set({ players: [p1, p2] });
  },

  startGame: () => {
    set({
      screen: 'game',
      cards: createShuffledCards(),
      flippedCards: [],
      isLocked: false,
      isWaitingForSecondPlayer: false,
      switchingPlayer: false,
      lastMatchedCards: null,
      players: get().players.map(p => ({ ...p, score: 0 })) as [Player, Player],
    });
  },

  flipCard: (cardId: number) => {
    const state = get();
    if (state.isLocked || state.isWaitingForSecondPlayer) return;

    const card = state.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    const newFlipped = [...state.flippedCards, cardId];

    // Flip the card
    const newCards = state.cards.map(c =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );

    if (newFlipped.length === 1) {
      set({ cards: newCards, flippedCards: newFlipped });
    } else if (newFlipped.length === 2) {
      set({ cards: newCards, flippedCards: newFlipped, isLocked: true });

      const [id1, id2] = newFlipped;
      const card1 = newCards.find(c => c.id === id1)!;
      const card2 = newCards.find(c => c.id === id2)!;

      if (card1.pairId === card2.pairId) {
        // Match!
        setTimeout(() => {
          const updatedCards = newCards.map(c =>
            c.id === id1 || c.id === id2 ? { ...c, isMatched: true, isFlipped: false } : c
          );
          const updatedPlayers = get().players.map((p, i) =>
            i === get().currentPlayerIndex ? { ...p, score: p.score + 1 } : p
          ) as [Player, Player];

          const allMatched = updatedCards.every(c => c.isMatched);

          set({
            cards: updatedCards,
            flippedCards: [],
            isLocked: false,
            lastMatchedCards: [id1, id2],
            players: updatedPlayers,
          });

          if (allMatched) {
            setTimeout(() => set({ screen: 'result' }), 600);
          }

          setTimeout(() => set({ lastMatchedCards: null }), 600);
        }, 700);
      } else {
        // No match — wait for second player to confirm
        set({ isWaitingForSecondPlayer: true, isLocked: false });
      }
    }
  },

  confirmMismatch: () => {
    const state = get();
    const { flippedCards, currentPlayerIndex } = state;

    // Hide the two flipped cards
    const newCards = state.cards.map(c =>
      flippedCards.includes(c.id) ? { ...c, isFlipped: false } : c
    );

    const nextPlayer = (currentPlayerIndex === 0 ? 1 : 0) as 0 | 1;

    set({
      cards: newCards,
      flippedCards: [],
      isWaitingForSecondPlayer: false,
      switchingPlayer: false,
      isLocked: false,
      currentPlayerIndex: nextPlayer,
    });
  },

  resetGame: (samePlayersReversed = false) => {
    const state = get();
    let players = state.players;
    if (samePlayersReversed) {
      // Revanche: swap starting player (reverse order)
      players = [state.players[1], state.players[0]] as [Player, Player];
    }
    set({
      screen: 'game',
      cards: createShuffledCards(),
      players: players.map(p => ({ ...p, score: 0 })) as [Player, Player],
      currentPlayerIndex: 0,
      flippedCards: [],
      isLocked: false,
      isWaitingForSecondPlayer: false,
      switchingPlayer: false,
      lastMatchedCards: null,
    });
  },

  goToStart: () => {
    set({
      screen: 'start',
      cards: [],
      flippedCards: [],
      isLocked: false,
      isWaitingForSecondPlayer: false,
      switchingPlayer: false,
      lastMatchedCards: null,
      players: [
        { name: 'Player 1', color: '#ef4444', score: 0 },
        { name: 'Player 2', color: '#3b82f6', score: 0 },
      ],
      currentPlayerIndex: 0,
    });
  },
}));
