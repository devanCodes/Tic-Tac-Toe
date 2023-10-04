import "./App.css";

// import the classNames utility from the "classnames" library. It helps you conditionally apply CSS classes to elements based on certain conditions
import classNames from "classnames";

// State types and helpers
import type { GameState, Player } from "./types";
import { useLocalStorage } from "./useLocalStorage";
import { deriveStats, deriveGame } from "./utils";

// Component imports
import Modal from "./components/Modal";
import Menu from "./components/Menu";

// This code defines an initial state for your game. It's an object of type GameState with two properties: currentGameMoves (an empty array) and history (an object with two empty arrays)
const initialState: GameState = {
  currentGameMoves: [],
  history: {
    currentRoundGames: [],
    allGames: [],
  },
};

export default function App() {
  // This line uses the useLocalStorage hook to manage the state of your application. It initializes state with the value retrieved from local storage with the key "game-state-key" or uses initialState if nothing is found. setState is a function that allows you to update this state
  const [state, setState] = useLocalStorage("game-state-key", initialState);

  // Derived state (updates on every state change)
  // These lines calculate derived state values by calling the deriveGame and deriveStats functions with your current state. It helps you maintain additional game-related data and statistics based on the current state.
  const game = deriveGame(state);
  const stats = deriveStats(state);

  // This is a function named resetGame that takes a boolean parameter isNewRound. It's responsible for resetting the game state based on whether it's a new round or not.
  const resetGame = (isNewRound: boolean) => {
    setState((prevState) => {
      const stateCopy = structuredClone(prevState);
      // If game is complete, archive it to history object
      if (game.status.isComplete) {
        const { moves, status } = game;
        stateCopy.history.currentRoundGames.push({
          moves,
          status,
        });
      }

      stateCopy.currentGameMoves = [];

      // Must archive current round in addition to resetting current game
      if (isNewRound) {
        stateCopy.history.allGames.push(...stateCopy.history.currentRoundGames);
        stateCopy.history.currentRoundGames = [];
      }

      return stateCopy;
    });
  };

  // This is another function named handlePlayerMove, which takes two parameters: squareId (a number) and player (of type Player). It's responsible for handling a player's move in the game. 
  const handlePlayerMove = (squareId: number, player: Player) => {
    setState((prev) => {
      const { currentGameMoves } = structuredClone(prev);

      currentGameMoves.push({
        player,
        squareId,
      });

      return {
        ...prev,
        currentGameMoves,
      };
    });
  };

  return (
    <>
      <main>
        <div className="grid">
          <div className={classNames("turn", game.currentPlayer.colorClass)}>
            <i
              className={classNames("fa-solid", game.currentPlayer.iconClass)}
            ></i>
            <p>{game.currentPlayer.name}, you're up!</p>
          </div>

          <Menu
            onAction={(action) => {
              resetGame(action === "new-round");
            }}
          />

          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((squareId) => {
            const existingMove = game.moves.find(
              (move) => move.squareId === squareId
            );

            return (
              <div
                key={squareId}
                id={squareId.toString()}
                className="square shadow"
                onClick={() => {
                  // Don't make a move on square if there already is one
                  if (existingMove) return;

                  handlePlayerMove(squareId, game.currentPlayer);
                }}
              >
                {existingMove && (
                  <i
                    className={classNames(
                      "fa-solid",
                      existingMove.player.iconClass,
                      existingMove.player.colorClass
                    )}
                  ></i>
                )}
              </div>
            );
          })}

          <div
            className="score shadow"
            style={{ backgroundColor: "var(--turquoise)" }}
          >
            <p>Player 1</p>
            <span>{stats.playersWithStats[0].wins} Wins</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--light-gray)" }}
          >
            <p>Ties</p>
            <span>{stats.ties}</span>
          </div>
          <div
            className="score shadow"
            style={{ backgroundColor: "var(--yellow)" }}
          >
            <p>Player 2</p>
            <span>{stats.playersWithStats[1].wins} Wins</span>
          </div>
        </div>
      </main>

      {/* This JSX code conditionally renders a Modal component based on whether the game is complete (game.status.isComplete). If the game is complete, it displays a message indicating the winner or a tie and provides a button to reset the game. */}
      {game.status.isComplete && (
        <Modal
          message={
            game.status.winner ? `${game.status.winner.name} wins!` : "Tie!"
          }
          onClick={() => resetGame(false)}
        />
      )}
    </>
  );
}