export type Player = {
  id: number; // representing the player's unique identifier
  name: string;
  iconClass: string; // representing the CSS class for the player's icon
  colorClass: string; // representing the CSS class for the player's color
};

export type Move = {
  squareId: number; // from 1-9, represents square on game board
  player: Player;
};

export type GameStatus = {
  isComplete: boolean; // true or false
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
