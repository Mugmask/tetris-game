import { useState } from "react";
import { Board } from "./Board/Board";
import "./Game.css";

const BOARD_WIDTH = 20;
const BOARD_HEIGHT = 10;

export default function Game() {
  const [startGame, setStartGame] = useState("start");

  return (
    <div className="game-container">
      {startGame === "start" ? (
        <button className="start-button" onClick={() => setStartGame(true)}>
          Start
        </button>
      ) : startGame === "gameOver" ? (
        <button className="start-button" onClick={() => setStartGame(true)}>
          Play Again
        </button>
      ) : (
        <Board rows={BOARD_WIDTH} columns={BOARD_HEIGHT} gameStatus={setStartGame} />
      )}
    </div>
  );
}
