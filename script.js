const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game objects
const paddle = {
    width: 10,
    height: 100,
    x: 10,
    y: canvas.height / 2 - 50,
    speed: 6,
    dy: 0
};

const computerPaddle = {
    width: 10,
    height: 100,
    x: canvas.width - 20,
    y: canvas.height / 2 - 50,
    speed: 5
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 8,
    dx: 5,
    dy: 5,
    speed: 5
};

let playerScore = 0;
let computerScore = 0;

// Mouse and keyboard controls
const mousePos = { y: canvas.height / 2 };
let keysPressed = {};

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mousePos.y = e.clientY - rect.top;
});

document.addEventListener('keydown', (e) => {
    keysPressed[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.key] = false;
});

// Update player paddle position
function updatePlayerPaddle() {
    // Mouse control
    if (mousePos.y > 0 && mousePos.y < canvas.height) {
        paddle.y = mousePos.y - paddle.height / 2;
    }

    // Arrow keys control
    if (keysPressed['ArrowUp'] && paddle.y > 0) {
        paddle.y -= paddle.speed;
    }
    if (keysPressed['ArrowDown'] && paddle.y < canvas.height - paddle.height) {
        paddle.y += paddle.speed;
    }

    // Keep paddle within bounds
    if (paddle.y < 0) paddle.y = 0;
    if (paddle.y > canvas.height - paddle.height) {
        paddle.y = canvas.height - paddle.height;
    }
}

// Update computer paddle (AI)
function updateComputerPaddle() {
    const computerCenter = computerPaddle.y + computerPaddle.height / 2;
    
    if (computerCenter < ball.y - 35) {
        computerPaddle.y += computerPaddle.speed;
    } else if (computerCenter > ball.y + 35) {
        computerPaddle.y -= computerPaddle.speed;
    }

    // Keep paddle within bounds
    if (computerPaddle.y < 0) computerPaddle.y = 0;
    if (computerPaddle.y > canvas.height - computerPaddle.height) 
        computerPaddle.y = canvas.height - computerPaddle.height;
}

// Update ball position
function updateBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Wall collision (top and bottom)
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.radius < 0 ? ball.radius : canvas.height - ball.radius;
    }

    // Paddle collision (player)
    if (ball.x - ball.radius < paddle.x + paddle.width &&
        ball.y > paddle.y &&
        ball.y < paddle.y + paddle.height) {
        ball.dx = Math.abs(ball.dx);
        ball.x = paddle.x + paddle.width + ball.radius;
        
        // Add spin based on where ball hits paddle
        let deltaY = ball.y - (paddle.y + paddle.height / 2);
        ball.dy = (deltaY / (paddle.height / 2)) * ball.speed;
    }

    // Paddle collision (computer)
    if (ball.x + ball.radius > computerPaddle.x &&
        ball.y > computerPaddle.y &&
        ball.y < computerPaddle.y + computerPaddle.height) {
        ball.dx = -Math.abs(ball.dx);
        ball.x = computerPaddle.x - ball.radius;
        
        // Add spin based on where ball hits paddle
        let deltaY = ball.y - (computerPaddle.y + computerPaddle.height / 2);
        ball.dy = (deltaY / (computerPaddle.height / 2)) * ball.speed;
    }

    // Score points
    if (ball.x - ball.radius < 0) {
        computerScore++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        playerScore++;
        resetBall();
    }

    // Update scoreboard
    document.getElementById('playerScore').textContent = playerScore;
    document.getElementById('computerScore').textContent = computerScore;
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
    ball.dy = (Math.random() * 2 - 1) * ball.speed;
}

// Draw functions
function drawPaddle(paddleObj) {
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(paddleObj.x, paddleObj.y, paddleObj.width, paddleObj.height);
}

function drawBall() {
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = '#00ff00';
    ctx.shadowBlur = 10;
}

function drawCenter() {
    ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw center line
    drawCenter();

    // Draw paddles and ball
    drawPaddle(paddle);
    drawPaddle(computerPaddle);
    drawBall();
}

// Game loop
function gameLoop() {
    updatePlayerPaddle();
    updateComputerPaddle();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
gameLoop();