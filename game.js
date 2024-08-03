let tg = window.Telegram.WebApp;
tg.expand(); // Расширяем приложение на весь экран

const originalWorldSize = 20; // Исходный размер мира
const displayWorldSize = 5; // Размер отображаемого мира
let playerX = Math.floor(originalWorldSize / 2); // Начальная позиция игрока по X
let playerY = Math.floor(originalWorldSize / 2); // Начальная позиция игрока по Y
let coins = 0; // Счетчик монет
let steps = 150; // Счетчик шагов
let world = []; // Игровой мир
let visibleCells = Array.from({ length: originalWorldSize }, () => Array(originalWorldSize).fill(false)); // Видимые клетки
let gameInitialized = false; // Флаг для проверки инициализации игры

// Загрузка прогресса
function loadProgress() {
    const savedCoins = localStorage.getItem('coins');
    const savedSteps = localStorage.getItem('steps');
    if (savedCoins) {
        coins = parseInt(savedCoins, 10);
    }
    if (savedSteps) {
        steps = parseInt(savedSteps, 10);
    }
}

// Сохранение прогресса
function saveProgress() {
    localStorage.setItem('coins', coins);
    localStorage.setItem('steps', steps);
}

// Инициализация мира
function initWorld() {
    world = Array.from({ length: originalWorldSize }, () => Array(originalWorldSize).fill(0));
    for (let i = 0; i < 50; i++) { // Увеличиваем количество монет
        let x = Math.floor(Math.random() * originalWorldSize);
        let y = Math.floor(Math.random() * originalWorldSize);
        if (world[y][x] === 0) {
            world[y][x] = 'coin'; // Размещение монеты
        }
    }
    world[playerY][playerX] = 'player'; // Установка игрока
    updateVisibility(); // Открываем клетки вокруг игрока
    renderWorld();
}

// Обновление счетчика шагов
function updateStepCounter() {
    document.getElementById('step-counter').textContent = `${steps}/150`;
}

// Обновление видимости клеток
function updateVisibility() {
    for (let y = playerY - 1; y <= playerY + 1; y++) {
        for (let x = playerX - 1; x <= playerX + 1; x++) {
            if (y >= 0 && y < originalWorldSize && x >= 0 && x < originalWorldSize) {
                visibleCells[y][x] = true;
            }
        }
    }
}

// Отображение мира
function renderWorld() {
    const gameWorld = document.getElementById('game-world');
    gameWorld.innerHTML = ''; // Очистка контейнера

    const startX = Math.max(0, Math.min(playerX - Math.floor(displayWorldSize / 2), originalWorldSize - displayWorldSize));
    const startY = Math.max(0, Math.min(playerY - Math.floor(displayWorldSize / 2), originalWorldSize - displayWorldSize));

    for (let y = startY; y < startY + displayWorldSize; y++) {
        for (let x = startX; x < startX + displayWorldSize; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (world[y][x] === 'player') {
                const playerDiv = document.createElement('div');
                playerDiv.classList.add('player');
                const img = document.createElement('img');
                img.src = 'image/xyeta.jpg'; // Устанавливаем путь к изображению
                playerDiv.appendChild(img); // Добавляем изображение внутрь элемента игрока
                cell.appendChild(playerDiv); // Добавляем элемент игрока в клетку
            } else if (world[y][x] === 'coin') {
                const coinDiv = document.createElement('div');
                coinDiv.classList.add('coin');
                cell.appendChild(coinDiv); // Добавляем элемент монеты в клетку
            }
            const fog = document.createElement('div');
            fog.classList.add('fog');
            if (!visibleCells[y][x]) {
                fog.style.display = 'block';
            }
            cell.appendChild(fog);
            cell.addEventListener('click', () => handleCellClick(x, y)); // Добавляем обработчик клика
            gameWorld.appendChild(cell);
        }
    }
    document.getElementById('score').textContent = `Монеты: ${coins}`; // Обновление счета
    updateStepCounter(); // Обновление счетчика шагов
}

// Обработчик клика по ячейке
function handleCellClick(x, y) {
    const dx = x - playerX;
    const dy = y - playerY;

    if (steps > 0 && ((Math.abs(dx) === 1 && dy === 0) || (dx === 0 && Math.abs(dy) === 1))) {
        movePlayer(dx, dy);
    }
}

// Перемещение игрока
function movePlayer(dx, dy) {
    let newX = playerX + dx;
    let newY = playerY + dy;
    if (newX >= 0 && newX < originalWorldSize && newY >= 0 && newY < originalWorldSize) {
        if (world[newY][newX] === 'coin') {
            coins++; // Увеличение счета при сборе монеты
            world[newY][newX] = 0; // Удаление монеты из мира
            saveProgress(); // Сохранение прогресса при сборе монеты
        }
        world[playerY][playerX] = 0; // Удаление игрока из старой позиции
        playerX = newX;
        playerY = newY;
        world[playerY][playerX] = 'player'; // Установка игрока на новую позицию
        steps--; // Уменьшение шагов
        updateVisibility(); // Обновление видимости клеток
        saveProgress(); // Сохранение прогресса при перемещении
        renderWorld(); // Обновление отображения мира
    }
}

// Вкладки
document.getElementById('game-tab').addEventListener('click', showGameTab);
document.getElementById('leaderboard-tab').addEventListener('click', showLeaderboardTab);
document.getElementById('friends-tab').addEventListener('click', showFriendsTab);
document.getElementById('tasks-tab').addEventListener('click', showTasksTab);

// Показать вкладку с игрой
function showGameTab() {
    document.getElementById('game-world').style.display = 'grid'; // Убедитесь, что стиль 'grid' установлен
    document.getElementById('controls').style.display = 'flex'; // Показываем счетчик шагов и кнопку "New Game"
    document.getElementById('new-game').style.display = 'block'; // Показываем кнопку "New Game"
    if (!gameInitialized) {
        loadProgress(); // Загружаем прогресс перед инициализацией
        initWorld(); // Инициализация мира только при первом открытии
        gameInitialized = true; // Устанавливаем флаг инициализации
    } else {
        renderWorld(); // Обновляем отображение, если игра уже инициализирована
    }
}

// Показать вкладку с таблицей лидеров
function showLeaderboardTab() {
    document.getElementById('game-world').style.display = 'none';
    document.getElementById('controls').style.display = 'none'; // Скрываем счетчик шагов и кнопку "New Game"
    document.getElementById('score').textContent = 'Таблица лидеров'; // Пример
}

// Показать вкладку с друзьями
function showFriendsTab() {
    document.getElementById('game-world').style.display = 'none';
    document.getElementById('controls').style.display = 'none'; // Скрываем счетчик шагов и кнопку "New Game"
    document.getElementById('score').textContent = 'Друзья'; // Пример
}

// Показать вкладку с заданиями
function showTasksTab() {
    document.getElementById('game-world').style.display = 'none';
    document.getElementById('controls').style.display = 'none'; // Скрываем счетчик шагов и кнопку "New Game"
    document.getElementById('score').textContent = 'Задания'; // Пример
}

// Обработчик для кнопки "New Game"
document.getElementById('new-game').addEventListener('click', () => {
    playerX = Math.floor(originalWorldSize / 2); // Сброс позиции игрока
    playerY = Math.floor(originalWorldSize / 2);
    steps = 150; // Сброс счетчика шагов
    visibleCells = Array.from({ length: originalWorldSize }, () => Array(originalWorldSize).fill(false)); // Сброс видимых клеток
    gameInitialized = false; // Сброс флага инициализации
    initWorld(); // Инициализация нового игрового мира
});

// Инициализация мира при загрузке
loadProgress(); // Загружаем прогресс при загрузке
initWorld();
