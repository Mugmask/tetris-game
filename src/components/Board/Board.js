import "./Board.css";
import Shapes from "../Shapes/Shapes";
import { useEffect, useState } from "react";

export function Board({ rows, columns, gameStatus }) {
  const [board, setBoard] = useState(Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0)));
  const [randomShape, setRandomShape] = useState(null);
  const [position, setPosition] = useState({ x: 3, y: 0 });

  /*   TODO:
 - Mover piezas con el teclado
 - Rotar piezas con flecha arriba
 - fixear cambio de colores por pieza
 - */

  window.addEventListener("keydown", (event) => {
    event.preventDefault();
    if (event.key === "ArrowDown") {
      console.log("abajo");
    }
    if (event.key === "ArrowUp") {
      console.log("arriba");
    }
    if (event.key === "ArrowLeft") {
      console.log("izq");
    }
    if (event.key === "ArrowRight") {
      console.log("der");
    }
  });

  const draw = (startY, startX) => {
    const newShape = Shapes[Math.floor(Math.random() * Shapes.length)];
    setRandomShape(newShape);
    let newBoard = board.map((row) => row.map((x) => x));
    newShape.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          newBoard[startY + rowIndex][startX + colIndex] = cell;
        }
      });
    });
    setBoard(newBoard);
  };
  const moveShape = () => {
    if (!randomShape) return;

    let newBoard = board.map((row) => [...row]);

    // Limpiar la posición de la pieza anterior
    randomShape.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          // Si la celda en el tablero original está ocupada, limpiarla
          if (board[rowIndex + position.y] && board[rowIndex + position.y][colIndex + position.x]) {
            newBoard[rowIndex + position.y][colIndex + position.x] = 0;
          }
        }
      });
    });

    let newY = position.y + 1;
    if (!checkColision(newBoard)) {
      randomShape.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            newBoard[rowIndex + newY][colIndex + position.x] = cell;
          }
        });
      });

      setBoard(newBoard);
      setPosition({ x: position.x, y: newY });
    } else {
      if (newY === 1) {
        gameStatus("gameOver");
        return;
      }
      setPosition({ x: 3, y: 0 });
      draw(0, 3);
    }
  };
  const checkColision = (newBoard) => {
    const shape = randomShape.shape;
    const newY = position.y + 1;
    for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
      for (let colIndex = 0; colIndex < shape[rowIndex].length; colIndex++) {
        if (shape[rowIndex][colIndex]) {
          const newRow = newY + rowIndex;
          const newCol = position.x + colIndex;

          if (newRow >= rows || newCol < 0 || newCol >= columns || newBoard[newRow][newCol]) {
            return true;
          }
        }
      }
    }
    return false;
  };

  useEffect(() => {
    if (!randomShape) draw(0, 3);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      moveShape();
    }, 1000);

    return () => clearInterval(interval);
  }, [board]);

  return (
    <div className="board-container">
      {board.map((row, indexRow) => {
        return (
          <ul key={`${indexRow}`}>
            {row.map((column, indexCol) => {
              return column === 1 ? (
                <li key={`${indexRow}-${indexCol}`} className={`piece sparkle ${randomShape?.className}`}></li>
              ) : (
                <li key={`${indexRow}-${indexCol}`}></li>
              );
            })}
          </ul>
        );
      })}
    </div>
  );
}
