const board = document.getElementById("board");

const scoreBoard = document.getElementById("scoreBoard");

const startButton = document.getElementById("start");

const gameOverSign = document.getElementById("gameOver");

const boardSize = 10;

const gameSpeed = 100;

const squareTypes = {
  emptySquare: 0,

  snakeSquare: 1,

  foodSquare: 2,
};

const directions = {
  ArrowUp: -10,

  ArrowDown: 10,

  ArrowRight: 1,

  ArrowLeft: -1,
};

let snake;

let score;

let direction;

let boardSquares;

let emptySquares;

let moveInterval;

const drawSnake = () => {
  snake.forEach((square) => drawSquare(square, "snakeSquare"));
};

const drawSquare = (square, type) => {
  const [row, column] = square.split("");

  boardSquares[row][column] = squareTypes[type];

  const squareElement = document.getElementById(square);

  squareElement.setAttribute("class", `square ${type}`);

  if (type === "emptySquare") {
    emptySquares.push(square);
  } else {
    const index = emptySquares.indexOf(square);

    if (index !== -1) {
      emptySquares.splice(index, 1);
    }
  }
};

const moveSnake = () => {
  const newSquare = String(
    Number(snake[snake.length - 1]) + directions[direction],
  ).padStart(2, "0");

  const [row, column] = newSquare.split("");

  if (
    newSquare < 0 ||
    newSquare > boardSize * boardSize ||
    (direction === "ArrowRight" && column == 0) ||
    (direction === "ArrowLeft" && column == 9) ||
    boardSquares[row][column] === squareTypes.snakeSquare
  ) {
    gameOver();
  } else {
    snake.push(newSquare);

    if (boardSquares[row][column] === squareTypes.foodSquare) {
      addFood();
    } else {
      const emptySquare = snake.shift();

      drawSquare(emptySquare, "emptySquare");
    }

    drawSnake();
  }
};

const addFood = () => {
  score++;

  updateScore();

  createRandomFood();
};

const gameOver = () => {
  gameOverSign.style.display = "block";

  clearInterval(moveInterval);

  startButton.disabled = false;
};

const setDirection = (newDirection) => {
  direction = newDirection;
};

const directionEvent = (key) => {
  // Prevenir scroll de la página
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key.code)) {
    key.preventDefault();
    key.stopPropagation();
  }

  switch (key.code) {
    case "ArrowUp":
      direction != "ArrowDown" && setDirection(key.code);
      break;
    case "ArrowDown":
      direction != "ArrowUp" && setDirection(key.code);
      break;
    case "ArrowLeft":
      direction != "ArrowRight" && setDirection(key.code);
      break;
    case "ArrowRight":
      direction != "ArrowLeft" && setDirection(key.code);
      break;
  }
};

const createRandomFood = () => {
  const randomEmptySquare =
    emptySquares[Math.floor(Math.random() * emptySquares.length)];

  drawSquare(randomEmptySquare, "foodSquare");
};

const updateScore = () => {
  scoreBoard.innerText = score;
};

const createBoard = () => {
  boardSquares.forEach((row, rowIndex) => {
    row.forEach((column, columnndex) => {
      const squareValue = `${rowIndex}${columnndex}`;

      const squareElement = document.createElement("div");

      squareElement.setAttribute("class", "square emptySquare");

      squareElement.setAttribute("id", squareValue);

      board.appendChild(squareElement);

      emptySquares.push(squareValue);
    });
  });
};

const setGame = () => {
  snake = ["00", "01", "02", "03"];

  score = 0;

  direction = "ArrowRight";

  boardSquares = Array.from(Array(boardSize), () =>
    new Array(boardSize).fill(squareTypes.emptySquare),
  );

  console.log(boardSquares);

  board.innerHTML = "";

  emptySquares = [];

  createBoard();
};

const startGame = () => {
  setGame();

  gameOverSign.style.display = "none";

  startButton.disabled = true;

  drawSnake();

  updateScore();

  createRandomFood();

  document.addEventListener("keydown", directionEvent);

  moveInterval = setInterval(() => moveSnake(), gameSpeed);
};

startButton.addEventListener("click", startGame);

// Sistema de detección de colisión del footer
const footerCollisionDetector = () => {
  const footer = document.querySelector(".game-footer");
  const gameContainer = document.querySelector(".game-container");
  const instructionsCard = document.querySelector(".instructions-card");

  if (!footer || !gameContainer || !instructionsCard) return;

  const footerRect = footer.getBoundingClientRect();
  const gameContainerRect = gameContainer.getBoundingClientRect();
  const instructionsCardRect = instructionsCard.getBoundingClientRect();

  // Detectar si el footer colisiona con el contenido
  const collidesWithGame = footerRect.top < gameContainerRect.bottom;
  const collidesWithCard =
    instructionsCardRect && footerRect.top < instructionsCardRect.bottom;

  if (collidesWithGame || collidesWithCard) {
    // Ocultar footer si colisiona
    footer.style.opacity = "0";
    footer.style.transform = "translateY(100%)";
    footer.style.transition = "all 0.3s ease";
  } else {
    // Mostrar footer si no colisiona
    footer.style.opacity = "1";
    footer.style.transform = "translateY(0)";
    footer.style.transition = "all 0.3s ease";
  }
};

// Monitorear cambios en el viewport
const setupFooterCollisionDetection = () => {
  // Detectar en tiempo real
  window.addEventListener("resize", footerCollisionDetector);
  window.addEventListener("scroll", footerCollisionDetector);

  // Detectar cambios de zoom
  let zoomLevel = window.devicePixelRatio;
  const zoomDetector = setInterval(() => {
    if (window.devicePixelRatio !== zoomLevel) {
      zoomLevel = window.devicePixelRatio;
      footerCollisionDetector();
    }
  }, 500);

  // Verificación inicial
  setTimeout(footerCollisionDetector, 100);
};

// Iniciar el sistema cuando se carga la página
document.addEventListener("DOMContentLoaded", setupFooterCollisionDetection);
