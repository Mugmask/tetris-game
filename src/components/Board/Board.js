import "./Board.css";
import Shapes from "../Shapes/Shapes";
import { useEffect, useState, useRef } from "react";

export function Board({ rows, columns, gameStatus }) {
  const [board, setBoard] = useState(Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0)));
  const [randomShape, setRandomShape] = useState(Shapes[Math.floor(Math.random() * Shapes.length)]);
  const [position, setPosition] = useState({ x: 3, y: 0 });

  const positionRef = useRef(position);
  const randomShapeRef = useRef(randomShape);
  const boardRef = useRef(board);

  /*   TODO:
 - Mover piezas con el teclado
 - Rotar piezas con flecha arriba
 - fixear cambio de colores por pieza
 - */
  const createBoard = () => {
    if (!boardRef.current) return;

    let newBoard = boardRef.current.map((row) => [...row]);
    return newBoard;
  };
  const draw = (currentShape, startY, startX) => {
    let newBoard = boardRef.current.map((row) => row.map((x) => x));
    currentShape.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          newBoard[startY + rowIndex][startX + colIndex] = cell;
        }
      });
    });
    setBoard(newBoard);
  };
  const cleanPreviousPosition = (currentShape, newBoard) => {
    let shape = currentShape !== randomShapeRef.current ? randomShapeRef.current : currentShape;

    shape.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          // Si la celda en el tablero original está ocupada, limpiarla
          if (
            boardRef.current[rowIndex + positionRef.current.y] &&
            boardRef.current[rowIndex + positionRef.current.y][colIndex + positionRef.current.x]
          ) {
            newBoard[rowIndex + positionRef.current.y][colIndex + positionRef.current.x] = 0;
          }
        }
      });
    });
    return newBoard;
  };
  const moveShape = (newPosition) => {
    if (!randomShapeRef.current) return;

    let newBoard = createBoard();
    let currentShape = randomShapeRef.current;

    newBoard = cleanPreviousPosition(currentShape, newBoard);

    const collisionResult = checkColision(newBoard, newPosition);

    if (collisionResult.type !== "none") {
      if (collisionResult.type === "wall") {
        return;
      } else if (collisionResult.type == "floor" && positionRef.current.y == 0) {
        gameStatus("gameOver");
        return;
      } else {
        setBoard(newBoard);
        setPosition({ x: 3, y: 0 });
        const newShape = Shapes[Math.floor(Math.random() * Shapes.length)];
        setRandomShape(newShape);
        draw(newShape, 0, 3);
      }
      return;
    }

    currentShape.shape.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell) {
          newBoard[rowIndex + newPosition.y][colIndex + newPosition.x] = cell;
        }
      });
    });
    setBoard(newBoard);
    setPosition(newPosition);
  };
  const checkColision = (newBoard, move) => {
    if (!randomShapeRef.current) return;

    let currentShape = randomShapeRef.current?.shape;

    for (let rowIndex = 0; rowIndex < currentShape.length; rowIndex++) {
      for (let colIndex = 0; colIndex < currentShape[rowIndex].length; colIndex++) {
        if (currentShape[rowIndex][colIndex]) {
          const newRow = move.y + rowIndex;
          const newCol = move.x + colIndex;

          if (newCol >= columns || newCol < 0) {
            return { type: "wall", position: { x: newCol, y: newRow } };
          }

          if (newRow >= rows) {
            return { type: "floor", position: { x: newCol, y: newRow } };
          }

          if (newBoard[newRow]?.[newCol]) {
            if (move.x !== positionRef.current.x) {
              return { type: "wall", position: { x: newCol, y: newRow } };
            }
            if (move.y !== positionRef.current.y) {
              return { type: "floor", position: { x: newCol, y: newRow } };
            }
          }
        }
      }
    }
    return { type: "none" };
  };
  const rotateShape = () => {
    if (!randomShapeRef.current) return;
    let currentShape = randomShapeRef.current?.shape;

    let rotatedShape = Array.from({ length: currentShape[0].length }, () => Array(currentShape.length).fill(0));

    for (let row = 0; row < currentShape.length; row++) {
      for (let col = 0; col < currentShape[row].length; col++) {
        rotatedShape[col][currentShape.length - 1 - row] = currentShape[row][col];
      }
    }
    boardRef.current = cleanPreviousPosition(currentShape, createBoard());
    setBoard(cleanPreviousPosition(currentShape, createBoard()));
    randomShapeRef.current.shape = rotatedShape;
    setRandomShape(randomShapeRef.current);
  };

  useEffect(() => {
    draw(randomShapeRef.current, 0, 3);

    const handleKeyDown = (event) => {
      event.preventDefault();

      let newPos = { ...positionRef.current };

      if (event.key === "ArrowDown") {
        newPos.y += 1;
      }
      if (event.key === "ArrowUp") {
        rotateShape();
      }
      if (event.key === "ArrowLeft") {
        newPos.x -= 1;
      }
      if (event.key === "ArrowRight") {
        newPos.x += 1;
      }

      moveShape(newPos);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      moveShape({ ...positionRef.current, y: positionRef.current.y + 1 });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    randomShapeRef.current = randomShape;
  }, [randomShape]);

  return (
    <div className="board-container">
      {boardRef.current.map((row, indexRow) => {
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
