import "./Board.css";
import Shapes from "../Shapes/Shapes";
import { useEffect, useState } from "react";

export function Board({ rows, columns, gameStatus }) {
  const [board, setBoard] = useState(Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0)));
  const [randomShape, setRandomShape] = useState(null);
  const [position, setPosition] = useState({ x: 3, y: 0 });
  const [newPosition, setNewPosition] = useState({ x: 3, y: 0 });

  /*   TODO:
 - Mover piezas con el teclado
 - Rotar piezas con flecha arriba
 - fixear cambio de colores por pieza
 - */
  const createBoard = () => {
    if (!board) return;

    let newBoard = board.map((row) => [...row]);
    return newBoard;
  };

  window.addEventListener("keydown", (event) => {
    setNewPosition({ x: position.x, y: position.y + 1 });
    event.preventDefault();

    let newBoard = createBoard();

    if (event.key === "ArrowDown") {
      if (!checkColision(newBoard, newPosition)) {
        fillBoard(newBoard, newPosition);
      }
    }
    if (event.key === "ArrowUp") {
    }
    if (event.key === "ArrowLeft") {
    }
    if (event.key === "ArrowRight") {
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
  const fillBoard = (newBoard, newPosition) => {
    if (!randomShape) return;

    randomShape.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          newBoard[rowIndex + newPosition.y][colIndex + newPosition.x] = cell;
        }
      });
    });

    setBoard(newBoard);
    setPosition({ x: newPosition.x, y: newPosition.y });
  };
  const moveShape = () => {
    if (!randomShape) return;

    let newBoard = createBoard();

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

    //ir uno para abajo
    let y = position.y + 1;
    let x = position.x;

    if (!checkColision(newBoard, { y, x })) {
      randomShape.shape.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            newBoard[rowIndex + y][colIndex + x] = cell;
          }
        });
      });

      setBoard(newBoard);
      setPosition({ x: x, y: y });
    } else {
      if (y === 1) {
        gameStatus("gameOver");
        return;
      }
      /* setPosition({ x: 3, y: 0 });
      draw(0, 3); */
    }
  };
  const checkColision = (newBoard, move) => {
    if (!randomShape) return;

    const shape = randomShape.shape;
    //todo: hacer los posibles casos por el trigger
    /*     const newY = position.y + 1;
    let newX = position.x + 1; */
    for (let rowIndex = 0; rowIndex < shape.length; rowIndex++) {
      for (let colIndex = 0; colIndex < shape[rowIndex].length; colIndex++) {
        if (shape[rowIndex][colIndex]) {
          const newRow = move.y + rowIndex;
          const newCol = move.x + colIndex;

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
