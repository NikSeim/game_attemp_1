let tg = window.Telegram.WebApp;
tg.expand(); // Расширяем приложение на весь экран

const worldSize = 10; // Размер мира
let playerX = 0; // Начальная позиция игрока по X
let playerY = 0; // Начальная позиция игрока по Y
let coins = 0; // Счетчик монет
let world = []; // Игровой мир
let gameInitialized = false; // Флаг для проверки инициализации игры

// Загрузка прогресса
function loadProgress() {
    const savedCoins = localStorage.getItem('coins');
    if (savedCoins) {
        coins = parseInt(savedCoins, 10);
    }
}

// Сохранение прогресса
function saveProgress() {
    localStorage.setItem('coins', coins);
}

// Инициализация мира
function initWorld() {
    world = Array.from({ length: worldSize }, () => Array(worldSize).fill(0));
    for (let i = 0; i < 10; i++) {
        let x = Math.floor(Math.random() * worldSize);
        let y = Math.floor(Math.random() * worldSize);
        if (world[y][x] === 0) {
            world[y][x] = 'coin'; // Размещение монеты
        }
    }
    world[playerY][playerX] = 'player'; // Установка игрока
    renderWorld();
}

// Отображение мира
function renderWorld() {
    const gameWorld = document.getElementById('game-world');
    gameWorld.innerHTML = ''; // Очистка контейнера

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
    document.getElementById('score').textContent = `Монеты: ${coins}`; // Обновление счета
}

// Перемещение игрока
function movePlayer(dx, dy) {
    let newX = playerX + dx;
    let newY = playerY + dy;
    if (newX >= 0 && newX < worldSize && newY >= 0 && newY < worldSize) {
        if (world[newY][newX] === 'coin') {
            coins++; // Увеличение счета при сборе монеты
            world[newY][newX] = 0; // Удаление монеты из мира
            saveProgress(); // Сохранение прогресса при сборе монеты
        }
        world[playerY][playerX] = 0; // Удаление игрока из старой позиции
        playerX = newX;
        playerY = newY;
        world[playerY][playerX] = 'player'; // Установка игрока на новую позицию
        renderWorld(); // Обновление отображения мира
    }
}

// Обработчики нажатия на кнопки управления
document.getElementById('up').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('down').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('left').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('right').addEventListener('click', () => movePlayer(1, 0));

// Вкладки
document.getElementById('game-tab').addEventListener('click', showGameTab);
document.getElementById('leaderboard-tab').addEventListener('click', showLeaderboardTab);
document.getElementById('friends-tab').addEventListener('click', showFriendsTab);
document.getElementById('tasks-tab').addEventListener('click', showTasksTab);

// Показать вкладку с игрой
function showGameTab() {
    document.getElementById('game-world').style.display = 'grid'; // Убедитесь, что стиль 'grid' установлен
    document.getElementById('controls').style.display = 'flex'; // Показываем кнопки управления
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
    document.getElementById('controls').style.display = 'none'; // Скрываем кнопки управления
    document.getElementById('new-game').style.display = 'none'; // Скрываем кнопку "New Game"
    document.getElementById('score').textContent = 'Таблица лидеров'; // Пример
}

// Показать вкладку с друзьями
function showFriendsTab() {
    document.getElementById('game-world').style.display = 'none';
    document.getElementById('controls').style.display = 'none'; // Скрываем кнопки управления
    document.getElementById('new-game').style.display = 'none'; // Скрываем кнопку "New Game"
    document.getElementById('score').textContent = 'Друзья'; // Пример
}

// Показать вкладку с заданиями
function showTasksTab() {
    document.getElementById('game-world').style.display = 'none';
    document.getElementById('controls').style.display = 'none'; // Скрываем кнопки управления
    document.getElementById('new-game').style.display = 'none'; // Скрываем кнопку "New Game"
    document.getElementById('score').textContent = 'Задания'; // Пример
}

// Обработчик для кнопки "New Game"
document.getElementById('new-game').addEventListener('click', () => {
    playerX = 0; // Сброс позиции игрока
    playerY = 0;
    gameInitialized = false; // Сброс флага инициализации
    initWorld(); // Инициализация нового игрового мира
});

// Инициализация мира при загрузке
loadProgress(); // Загружаем прогресс при загрузке
initWorld();
