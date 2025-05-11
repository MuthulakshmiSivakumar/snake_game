const gameBoard = document.getElementById("gameBoard");
const context = gameBoard.getContext("2d");

// 🟩 Responsive canvas size
const screenWidth = window.innerWidth;
const canvasSize = screenWidth < 600 ? screenWidth - 20 : 500;
gameBoard.width = canvasSize;
gameBoard.height = canvasSize;

const Width = gameBoard.width;
const Height = gameBoard.height;
const unit = 25;

let foodX, foodY;
let snake,
  direction,
  gameLoop,
  isGameOver = false,
  isStarted = false,
  score = 0;

// Prevent scroll on arrow or space keys
window.addEventListener(
  "keydown",
  function (e) {
    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        " ",
        "Enter",
      ].includes(e.key)
    ) {
      e.preventDefault();
    }
  },
  false
);

function initGame() {
  context.fillStyle = "#212121";
  context.fillRect(0, 0, Width, Height);
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText("Press Enter to Start", Width / 2 - 100, Height / 2);
  document.getElementById("msg").textContent = "Press Enter to Start";
}

function startGame() {
  snake = [{ x: unit * 5, y: unit * 5 }];
  direction = "RIGHT";
  isGameOver = false;
  isStarted = true;
  score = 0;
  document.getElementById("scoreVal").textContent = score;
  document.getElementById("msg").textContent =
    "Press Space to Pause or Continue";

  createFood();
  gameLoop = setInterval(update, 150);
}

function createFood() {
  foodX = Math.floor(Math.random() * (Width / unit)) * unit;
  foodY = Math.floor(Math.random() * (Height / unit)) * unit;
}

function drawFood() {
  context.fillStyle = "red";
  context.fillRect(foodX, foodY, unit, unit);
}

function drawSnake() {
  context.fillStyle = "lime";
  snake.forEach((part) => context.fillRect(part.x, part.y, unit, unit));
}

function update() {
  if (isGameOver || !isStarted) return;

  context.fillStyle = "#212121";
  context.fillRect(0, 0, Width, Height);

  drawFood();
  drawSnake();

  let head = { ...snake[0] };

  if (direction === "UP") head.y -= unit;
  if (direction === "DOWN") head.y += unit;
  if (direction === "LEFT") head.x -= unit;
  if (direction === "RIGHT") head.x += unit;

  if (
    head.x < 0 ||
    head.x >= Width ||
    head.y < 0 ||
    head.y >= Height ||
    snake.some((part) => part.x === head.x && part.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === foodX && head.y === foodY) {
    score++;
    document.getElementById("scoreVal").textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}

function gameOver() {
  clearInterval(gameLoop);
  isGameOver = true;
  isStarted = false;
  document.getElementById("msg").textContent =
    "Game Over! Press Space to Restart";
  context.fillStyle = "white";
  context.font = "20px Arial";
  context.fillText("Game Over! Press Space", Width / 2 - 100, Height / 2);
}

document.addEventListener("keydown", (e) => {
  if (!isStarted && e.key === "Enter") {
    startGame();
    return;
  }

  if (isGameOver && e.key === " ") {
    startGame();
    return;
  }

  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

// Start with welcome screen
initGame();
