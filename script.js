const gameBoard = document.getElementById("gameBoard");
const context = gameBoard.getContext("2d");

const screenWidth = window.innerWidth;
const canvasSize = screenWidth < 600 ? screenWidth - 20 : 500;
gameBoard.width = canvasSize;
gameBoard.height = canvasSize;

const Width = gameBoard.width;
const Height = gameBoard.height;
const unit = 25;

let foodX, foodY;
let snake, direction, gameLoop;
let isGameOver = false;
let isStarted = false;
let isPaused = false;
let score = 0;
let speed = 300;

window.addEventListener("keydown", (e) => {
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " ", "Enter"].includes(
      e.key
    )
  ) {
    e.preventDefault();
  }
});

function initGame() {
  context.fillStyle = "#212121";
  context.fillRect(0, 0, Width, Height);
  context.fillStyle = "white";
  context.font = "20px Arial";
  const text = "Press Enter to Start";
  const textWidth = context.measureText(text).width;
  context.fillText(text, (Width - textWidth) / 2, Height / 2);
  document.getElementById("msg").textContent = "Press Enter to Start";
}

function startGame() {
  snake = [{ x: unit * 5, y: unit * 5 }];
  direction = "RIGHT";
  isGameOver = false;
  isStarted = true;
  isPaused = false;
  score = 0;
  speed = 300;
  document.getElementById("scoreVal").textContent = score;
  document.getElementById("msg").textContent =
    "Press Space to Pause or Continue";
  createFood();
  clearInterval(gameLoop);
  gameLoop = setInterval(update, speed);
}

function createFood() {
  do {
    foodX = Math.floor(Math.random() * (Width / unit)) * unit;
    foodY = Math.floor(Math.random() * (Height / unit)) * unit;
  } while (snake.some((part) => part.x === foodX && part.y === foodY));
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
  if (isGameOver || !isStarted || isPaused) return;

  context.fillStyle = "#212121";
  context.fillRect(0, 0, Width, Height);

  drawFood();
  drawSnake();

  let head = { ...snake[0] };

  if (direction === "UP") head.y -= unit;
  else if (direction === "DOWN") head.y += unit;
  else if (direction === "LEFT") head.x -= unit;
  else if (direction === "RIGHT") head.x += unit;

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

    if (score % 5 === 0 && speed > 100) {
      clearInterval(gameLoop);
      speed -= 20;
      gameLoop = setInterval(update, speed);
    }

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
  const text = "Game Over! Press Space";
  const textWidth = context.measureText(text).width;
  context.fillText(text, (Width - textWidth) / 2, Height / 2);
}

function changeDirection(dir) {
  if (dir === "UP" && direction !== "DOWN") direction = "UP";
  else if (dir === "DOWN" && direction !== "UP") direction = "DOWN";
  else if (dir === "LEFT" && direction !== "RIGHT") direction = "LEFT";
  else if (dir === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
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

  if (e.key === " " && isStarted && !isGameOver) {
    isPaused = !isPaused;
    document.getElementById("msg").textContent = isPaused
      ? "Paused. Press Space to Resume"
      : "Press Space to Pause or Continue";
    return;
  }

  if (e.key === "ArrowUp") changeDirection("UP");
  else if (e.key === "ArrowDown") changeDirection("DOWN");
  else if (e.key === "ArrowLeft") changeDirection("LEFT");
  else if (e.key === "ArrowRight") changeDirection("RIGHT");
});

initGame();
