
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const bestScoreDisplay = document.getElementById('best-score');
const timerDisplay = document.getElementById('timer'); 

canvas.width = 800;
canvas.height = 600;

let score = 0;
let bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
let gameTime; 
let gameInterval, objectInterval, timerInterval;
let objects = [];
const objectTypes = ['piñata', 'calavera', 'cactus'];

const images = {
    'piñata': new Image(),
    'calavera': new Image(),
    'cactus': new Image()
};

images['piñata'].src = 'images/pinata.jpg'; 
images['calavera'].src = 'images/calavera.jpg';
images['cactus'].src = 'images/mort.jpg';

function updateScore() {
    scoreDisplay.innerText = `Score: ${score}`;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        bestScoreDisplay.innerText = `Meilleur Score: ${bestScore}`;
    }
}

function createObject() {
    const type = objectTypes[Math.floor(Math.random() * objectTypes.length)];
    const x = Math.random() * (canvas.width - 50);
    const y = Math.random() * (canvas.height - 50);
    const object = { type, x, y, width: 50, height: 50 };
    objects.push(object);

    setTimeout(() => {
        const index = objects.indexOf(object);
        if (index !== -1) {
            objects.splice(index, 1);
            drawObjects(); 
        }
    }, 2000); 
}

function drawObjects() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    objects.forEach(obj => {
        ctx.drawImage(images[obj.type], obj.x, obj.y, obj.width, obj.height);
    });
}

canvas.addEventListener('click', function(event) {
    const { offsetX, offsetY } = event;
    objects.forEach((obj, index) => {
        if (offsetX >= obj.x && offsetX <= obj.x + obj.width && 
            offsetY >= obj.y && offsetY <= obj.y + obj.height) {
            if (obj.type === 'piñata') {
                score += 1;
            } else if (obj.type === 'calavera') {
                score += 5;
            } else if (obj.type === 'cactus') {
                score -= 5;
            }
            objects.splice(index, 1);
            updateScore();
            drawObjects();
        }
    });
});

function updateTimer() {
    timerDisplay.innerText = `Temps restant: ${gameTime}s`;
}

function startGame(level) {
    score = 0;
    objects = [];
    updateScore();

    clearInterval(objectInterval);
    clearInterval(gameInterval);
    clearInterval(timerInterval); 

    let objectSpeed, gameDuration;

    switch (level) {
        case 'easy':
            gameDuration = 50;
            objectSpeed = 1000;
            break;
        case 'intermediate':
            gameDuration = 35;
            objectSpeed = 800;
            break;
        case 'hard':
            gameDuration = 15;
            objectSpeed = 600;
            break;
    }

    gameTime = gameDuration;
    updateTimer(); 
    objectInterval = setInterval(() => {
        createObject();
        drawObjects();
    }, objectSpeed);

    timerInterval = setInterval(() => {
        gameTime--;
        updateTimer(); 
        if (gameTime <= 0) {
            endGame();
        }
    }, 1000);
}

function launchConfetti() {
    const confettiSettings = {
        particleCount: 150,  
        spread: 80,             
        origin: { y: 0.6 },   
        colors: ['#ff69b4', '#ff6347', '#ffeb3b', '#00e676', '#00bcd4'] 
    };

    for (let i = 0; i < 3; i++) {
        setTimeout(() => confetti(confettiSettings), i * 200);
    }
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(objectInterval);
    clearInterval(timerInterval);

    document.getElementById('final-score').innerText = score;
    document.getElementById('end-modal').style.display = 'flex';

    launchConfetti();
}

// Redémarrer le jeu avec le niveau choisi dans la modal
document.getElementById('restart-easy').addEventListener('click', () => {
    document.getElementById('end-modal').style.display = 'none';
    startGame('easy');
});

document.getElementById('restart-intermediate').addEventListener('click', () => {
    document.getElementById('end-modal').style.display = 'none';
    startGame('intermediate');
});

document.getElementById('restart-hard').addEventListener('click', () => {
    document.getElementById('end-modal').style.display = 'none';
    startGame('hard');
});


document.getElementById('start-easy').addEventListener('click', () => startGame('easy'));
document.getElementById('start-intermediate').addEventListener('click', () => startGame('intermediate'));
document.getElementById('start-hard').addEventListener('click', () => startGame('hard'));

bestScoreDisplay.innerText = `Meilleur Score: ${bestScore}`;
