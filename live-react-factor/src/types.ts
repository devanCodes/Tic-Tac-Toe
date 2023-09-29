export type Player = {
  id: number;
  name: string;
  iconClass: string;
  colorClass: string;
};

export type Move = {
  squareId: number; // from 1-9, represents square on game board
  player: Player;
};

export type GameStatus = {
  isComplete: boolean;
  winner: Player | null; // if null and game is complete, is a tie
};

export type Game = {
  moves: Move[];
  status: GameStatus;
};

// GameState object that is used in localStorage
export type GameState = {
  currentGameMoves: Move[];
  history: {
    currentRoundGames: Game[];
    allGames: Game[];
  };
};
