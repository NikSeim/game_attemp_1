let tg = window.Telegram.WebApp;
tg.expand();

const worldSize = 10;
let playerX = 0;
let playerY = 0;
let coins = 0;
let world = [];

function initWorld() {
    world = Array(worldSize).fill().map(() => Array(worldSize).fill(0));
    for (let i = 0; i < 10; i++) {
        let x = Math.floor(Math.random() * worldSize);
        let y = Math.floor(Math.random() * worldSize);
        if (world[y][x] === 0) {
            world[y][x] = 'coin';
        }
    }
    world[playerY][playerX] = 'player';
}

function renderWorld() {
    const gameWorld = document.getElementById('game-world');
    gameWorld.innerHTML = '';
    for (let y = 0; y < worldSize; y++) {
        for (let x = 0; x < worldSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (world[y][x] === 'player') {
                cell.classList.add('player');
            } else if (world[y][x] === 'coin') {
                cell.classList.add('coin');
            }
            gameWorld.appendChild(cell);
        }
    }
    document.getElementById('score').textContent = `Coins: ${coins}`;
}

function movePlayer(dx, dy) {
    let newX = playerX + dx;
    let newY = playerY + dy;
    if (newX >= 0 && newX < worldSize && newY >= 0 && newY < worldSize) {
        if (world[newY][newX] === 'coin') {
            coins++;
        }
        world[playerY][playerX] = 0;
        playerX = newX;
        playerY = newY;
        world[playerY][playerX] = 'player';
        renderWorld();
    }
}

document.getElementById('up').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('down').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('left').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('right').addEventListener('click', () => movePlayer(1, 0));

initWorld();
renderWorld();

// Отправка данных в Telegram при закрытии игры
tg.onEvent('viewportChanged', () => {
    if (!tg.isExpanded) {
        tg.sendData(JSON.stringify({coins: coins}));
    }
});