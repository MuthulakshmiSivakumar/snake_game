const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const startBtn = document.getElementById("startBtn");

// On-screen control buttons
const upBtn = document.getElementById("upBtn");
const downBtn = document.getElementById("downBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");

const box = 20;
let snake, food, dir, gameInterval, score;
let touchStartX = 0;
let touchStartY = 0;

// Start or restart game
startBtn.addEventListener("click", startGame);

// Keyboard controls
document.addEventListener("keydown", direction);

// Touch swipe controls
document.addEventListener("touchstart", touchStart);
document.addEventListener("touchmove", touchMove);

// Button controls
upBtn.addEventListener("click", () => {
  if (dir !== "DOWN") dir = "UP";
});
downBtn.addEventListener("click", () => {
  if (dir !== "UP") dir = "DOWN";
});
leftBtn.addEventListener("click", () => {
  if (dir !== "RIGHT") dir = "LEFT";
});
rightBtn.addEventListener("click", () => {
  if (dir !== "LEFT") dir = "RIGHT";
});

function direction(event) {
  if (event.keyCode === 37 && dir !== "RIGHT") dir = "LEFT";
  if (event.keyCode === 38 && dir !== "DOWN") dir = "UP";
  if (event.keyCode === 39 && dir !== "LEFT") dir = "RIGHT";
  if (event.keyCode === 40 && dir !== "UP") dir = "DOWN";
}

function touchStart(event) {
  touchStartX = event.touches[0].clientX;
  touchStartY = event.touches[0].clientY;
}

function touchMove(event) {
  let dx = event.touches[0].clientX - touchStartX;
  let dy = event.touches[0].clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0 && dir !== "LEFT") dir = "RIGHT";
    else if (dx < 0 && dir !== "RIGHT") dir = "LEFT";
  } else {
    if (dy > 0 && dir !== "UP") dir = "DOWN";
    else if (dy < 0 && dir !== "DOWN") dir = "UP";
  }
}

function startGame() {
  clearInterval(gameInterval);
  score = 0;
  dir = undefined;
  snake = [{ x: 9 * box, y: 9 * box }];
  food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box,
  };
  scoreDisplay.textContent = "Score: 0";
  gameInterval = setInterval(game, 300);
}

function game() {
  const head = { x: snake[0].x, y: snake[0].y };

  if (dir === "LEFT") head.x -= box;
  if (dir === "UP") head.y -= box;
  if (dir === "RIGHT") head.x += box;
  if (dir === "DOWN") head.y += box;

  if (
    head.x < 0 ||
    head.y < 0 ||
    head.x >= canvas.width ||
    head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(gameInterval);
    alert("Game Over! Your score: " + score);
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box,
    };
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lime" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);
}

function collision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}
