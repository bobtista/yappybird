const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScoreElement = document.getElementById('final-score');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const volumeMeter = document.getElementById('volume-meter');

canvas.width = 400;
canvas.height = 600;

const bird = {
    x: 50,
    y: canvas.height / 2,
    radius: 20,
    velocity: 0,
    gravity: 0.5,
    jump: -10
};

const pipes = [];
let score = 0;
let gameLoopId;
let audioContext;
let analyser;
let dataArray;

let isGameOver = false;

function drawBird() {
    ctx.beginPath();
    ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD700';
    ctx.fill();
    ctx.closePath();
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
    });
}

function updateGame() {
    if (isGameOver) return;

    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    // Prevent the bird from going below the screen
    if (bird.y + bird.radius > canvas.height) {
        bird.y = canvas.height - bird.radius;
        bird.velocity = 0;
    }

    // Prevent the bird from going above the screen
    if (bird.y - bird.radius < 0) {
        bird.y = bird.radius;
        bird.velocity = Math.max(0, bird.velocity); // Allow downward velocity, prevent upward
    }

    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (pipe.x + pipe.width < 0) {
            pipes.shift();
            score++;
            scoreElement.textContent = `Score: ${score}`;
        }

        if (
            bird.x + bird.radius > pipe.x &&
            bird.x - bird.radius < pipe.x + pipe.width &&
            (bird.y - bird.radius < pipe.top || bird.y + bird.radius > pipe.bottom)
        ) {
            gameOver();
        }
    });

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const gap = 150;
        const pipeTop = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50;
        pipes.push({
            x: canvas.width,
            top: pipeTop,
            bottom: pipeTop + gap,
            width: 50
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBird();
    drawPipes();
}

function gameLoop() {
    if (isGameOver) return; // Add this line to stop the game loop when the game is over

    updateGame();
    draw();
    processAudio();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function startGame() {
    isGameOver = false; // Reset the game over flag
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    score = 0;
    scoreElement.textContent = 'Score: 0';
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    setupAudio();
    gameLoopId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    isGameOver = true; // Set the game over flag
    cancelAnimationFrame(gameLoopId);
    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
}

function setupAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 32;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);  // Initialize dataArray here

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
            updateVolumeMeter(); // Start updating the volume meter
        })
        .catch(err => console.error('Error accessing microphone:', err));
}

function processAudio() {
    if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalizedVolume = average / 255;
        
        // Log the audio input to the console
        console.log(`Audio input: ${normalizedVolume.toFixed(3)}`);

        // Update volume meter
        volumeMeter.style.setProperty('--volume', `${normalizedVolume * 100}%`);
        
        // Adjust these values to fine-tune the bird's behavior
        const threshold = 0.6; // Started at 0.1
        const noiseGate = 0.2; // Ignore audio below this level
        const maxJump = -5; // Started at -15, make less negative for less powerful jumps
        
        if (normalizedVolume > threshold && normalizedVolume > noiseGate) {
            // Calculate jump strength based on volume, with a maximum limit
            const jumpStrength = Math.min((normalizedVolume - threshold) * bird.jump * 0.5, maxJump);
            bird.velocity += jumpStrength;
        }
    }
}

function updateVolumeMeter() {
    if (isGameOver) return; // Stop updating the volume meter when the game is over

    if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalizedVolume = average / 255;
        
        // Update volume meter
        volumeMeter.style.setProperty('--volume', `${normalizedVolume * 100}%`);
    }
    requestAnimationFrame(updateVolumeMeter);
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);