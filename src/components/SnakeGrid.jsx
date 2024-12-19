import React, { useCallback, useEffect, useState } from "react";

export default function SnakeGrid() {
  const [matrix, setMatrix] = useState([]);
  const prepareMatrix = () => {
    let arr = [...Array(15)].map((cell) => [...Array(15)].fill(""));
    setMatrix(arr);
  };
  // [row, col]
  const [snake, setSnake] = useState([
    [3, 5],
    [3, 4],
    [3, 3],
  ]);

  const isSnake = (position) => {
    return snake.some(
      (snakePos) => snakePos[0] === position[0] && snakePos[1] === position[1]
    );
  };

  const isSnakeHead = (position) => {
    return snake[0][0] === position[0] && snake[0][1] === position[1];
  };

  const isApple = (position) => {
    return position[0] === apple[0] && position[1] === apple[1];
  };

  const getRandomApplePosition = () => {
    let row = Math.floor(Math.random() * 15);
    let col = Math.floor(Math.random() * 15);
    let pos = [row, col];
    if (isSnake(pos)) {
      return getRandomApplePosition();
    }

    return pos;
  };

  const [apple, setApple] = useState(getRandomApplePosition());

  const [direction, setDirection] = useState([0, 1]);
  // [-1,0], [0, 1], [1, 0], [0, -1]

  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case "ArrowUp": {
          if (direction[0] !== 1) setDirection([-1, 0]);
          break;
        }
        case "ArrowRight": {
          if (direction[1] !== -1) setDirection([0, 1]);
          break;
        }
        case "ArrowDown": {
          if (direction[0] !== -1) setDirection([1, 0]);
          break;
        }
        case "ArrowLeft": {
          if (direction[1] !== 1) setDirection([0, -1]);
          break;
        }
        default: {
          break;
        }
      }
    },
    [direction]
  );

  const validateNewHead = (newHead) => {
    if (isSnake(newHead)) return false;
    if (
      newHead[0] < 0 ||
      newHead[0] >= 15 ||
      newHead[1] < 0 ||
      newHead[1] >= 15
    )
      return false;
    return true;
  };

  const getScore = () => {
    return snake.length * 10;
  };

  useEffect(() => {
    let interval = setInterval(() => {
      setSnake((snake) => {
        let newHead = [snake[0][0] + direction[0], snake[0][1] + direction[1]];
        if (!validateNewHead(newHead)) {
          setSnake([
            [3, 5],
            [3, 4],
            [3, 3],
          ]);
        }
        let newSnake = [newHead, ...snake];
        console.log(newHead);
        if (isApple(newHead)) {
          setApple(getRandomApplePosition());
          return newSnake;
        }
        newSnake.pop();
        return newSnake;
      });
    }, 500);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearInterval(interval);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction, handleKeyDown]);

  useEffect(() => {
    prepareMatrix();
  }, []);

  return (
    <>
      <h2>Score: {getScore()}</h2>
      <div className="grid">
        {matrix.map((row, rowIndex) => {
          return row.map((col, colIndex) => {
            return (
              <div
                key={rowIndex + colIndex}
                className={`grid__cell
                ${isSnakeHead([rowIndex, colIndex]) && `grid__cell--snake-head`}
                ${isSnake([rowIndex, colIndex]) && `grid__cell--snake`}
                ${isApple([rowIndex, colIndex]) && `grid__cell--apple`}
              `}
              ></div>
            );
          });
        })}
      </div>
    </>
  );
}
