import { GameState, Move, Player } from "./types";

// defining an array 'players' that holds 2 player objects; each player object has 4 props mentioned below, which represent unique identifiers, names, and CSS classes for their icons and colors
const players: Player[] = [
  {
    id: 1,
    name: "Player 1",
    iconClass: "fa-x",
    colorClass: "turquoise",
  },
  {
    id: 2,
    name: "Player 2",
    iconClass: "fa-o",
    colorClass: "yellow",
  },
];

// This line defines a function called deriveStats, which takes the game's state (state of type GameState) as a parameter. This function will calculate and return statistics related to the game.
export function deriveStats(state: GameState) {
  return {
    // This property is an array of player objects with additional statistics. It uses the map function to iterate over the players array and calculates the number of wins for each player in the current round.
    playersWithStats: players.map((player) => {
      const wins = state.history.currentRoundGames.filter(
        (game) => game.status.winner?.id === player.id
      ).length;

      return {
        ...player,
        wins,
      };
    }),
    // This property calculates the number of ties (games without a winner) in the current round by filtering the currentRoundGames in the game's history.
    ties: state.history.currentRoundGames.filter(
      (game) => game.status.winner === null
    ).length,
  };
}

// This line defines a function called deriveGame, which also takes the game's state (state of type GameState) as a parameter. This function calculates and returns the current state of the game.
export function deriveGame(state: GameState) {
  // These two lines determine the current player and the next player based on the number of moves made in the game. It uses the remainder operator (%) to alternate between players.
  const currentPlayer = players[state.currentGameMoves.length % 2];
  const nextPlayer = players[(state.currentGameMoves.length + 1) % 2];

  // This line defines an array called winningPatterns. It contains arrays representing the different winning combinations in the Tic-Tac-Toe game, such as rows, columns, and diagonals.
  const winningPatterns = [
    [1, 2, 3],
    [1, 5, 9],
    [1, 4, 7],
    [2, 5, 8],
    [3, 5, 7],
    [3, 6, 9],
    [4, 5, 6],
    [7, 8, 9],
  ];

  // Here, you initialize a variable winner as null, indicating that there's no winner initially. This variable will be updated as the game progresses.
  let winner: Player | null = null;

  // This loop iterates through each player in the players array and checks if any of them have achieved a winning combination. It does this by comparing the player's selected square IDs with the winning patterns.
  for (const player of players) {
    const selectedSquareIds = state.currentGameMoves
      .filter((move) => move.player.id === player.id)
      .map((move) => move.squareId);

    for (const pattern of winningPatterns) {
      if (pattern.every((v) => selectedSquareIds.includes(v))) {
        winner = player;
      }
    }
  }

  // In the deriveGame function, you return an object representing the game state
  return {
    moves: state.currentGameMoves,
    currentPlayer,
    status: {
      isComplete: winner != null || state.currentGameMoves.length === 9,
      winner,
    },
  };
}