
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const cols = 29;
const rows = 26;
let dir = "right";
let snake = [{x: 5, y: 5}];
let food = {x: 10, y: 10};
let paused = false;
let score = 0;

function drawRect(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * gridSize, y * gridSize, gridSize - 1, gridSize - 1);
}

function drawMap() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let x = 0; x < cols; x++) {
        drawRect(x, 0, "#888");
        drawRect(x, rows - 1, "#888");
    }
    for (let y = 0; y < rows; y++) {
        drawRect(0, y, "#888");
        drawRect(cols - 1, y, "#888");
    }
}

function placeFood() {
    while (true) {
        food.x = Math.floor(Math.random() * (cols - 2)) + 1;
        food.y = Math.floor(Math.random() * (rows - 2)) + 1;
        if (!snake.some(part => part.x === food.x && part.y === food.y)) break;
    }
}

function moveSnake() {
    if (paused) return;

    const head = {...snake[0]};
    switch (dir) {
        case "up": head.y--; break;
        case "down": head.y++; break;
        case "left": head.x--; break;
        case "right": head.x++; break;
    }

    // 撞墙
    if (head.x <= 0 || head.x >= cols - 1 || head.y <= 0 || head.y >= rows - 1) {
        alert("撞墙了！游戏结束
分数：" + score);
        location.reload();
        return;
    }

    // 咬自己
    if (snake.some(part => part.x === head.x && part.y === head.y)) {
        alert("咬到自己了！游戏结束
分数：" + score);
        location.reload();
        return;
    }

    snake.unshift(head);

    // 吃到食物
    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((part, i) => drawRect(part.x, part.y, i === 0 ? "#0ff" : "#0f0"));
}

function drawFood() {
    drawRect(food.x, food.y, "#f00");
}

document.addEventListener("keydown", e => {
    const key = e.key;
    if (key === " " || key === "Spacebar") paused = !paused;
    if (key === "ArrowUp" || key === "w") if (dir !== "down") dir = "up";
    if (key === "ArrowDown" || key === "s") if (dir !== "up") dir = "down";
    if (key === "ArrowLeft" || key === "a") if (dir !== "right") dir = "left";
    if (key === "ArrowRight" || key === "d") if (dir !== "left") dir = "right";
});

function gameLoop() {
    moveSnake();
    drawMap();
    drawSnake();
    drawFood();
    requestAnimationFrame(gameLoop);
}

placeFood();
gameLoop();
