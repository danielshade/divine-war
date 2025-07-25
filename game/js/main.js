// --- 1. НАЛАШТУВАННЯ ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const infoPanel = document.getElementById('infoPanel');

// --- 2. ІГРОВІ ДАНІ ---

// Дані про регіони (залишаються без змін)
const regions = [
    { name: 'Олімп', x: 50, y: 50, width: 250, height: 180, color: '#A1C4FD', description: 'Землі порядку та амбіцій. Олімпійці сильні в стратегії та магії стихій.' },
    { name: 'Ніл', x: 450, y: 350, width: 300, height: 200, color: '#FFDB58', description: 'Долина вічності та циклів. Боги Нілу володіють магією життя і смерті.' },
    { name: 'Вальхала', x: 100, y: 400, width: 200, height: 150, color: '#B2BEB5', description: 'Крижані землі честі та слави. Воїни Асгарду покладаються на лють та силу.' }
];

// НОВЕ: Створюємо об'єкт для нашого гравця (героя)
const player = {
    x: canvas.width / 2,  // Початкова позиція X (центр)
    y: canvas.height / 2, // Початкова позиція Y (центр)
    width: 40,            // Ширина героя
    height: 50,           // Висота героя
    speed: 4,             // Швидкість руху (пікселів за кадр)
    image: new Image()    // Створюємо об'єкт зображення для спрайту
};
player.image.src = 'assets/hero.png'; // Вказуємо шлях до нашого спрайту

// НОВЕ: Об'єкт для відстеження натиснутих клавіш
const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false
};


// --- 3. ГОЛОВНІ ФУНКЦІЇ ГРИ ---

/**
 * НОВЕ: Функція update()
 * Ця функція відповідає за оновлення даних гри (логіку).
 * Наприклад, рух персонажа. Вона викликається в кожному кадрі.
 */
function update() {
    // Рухаємо гравця в залежності від натиснутих клавіш
    if (keysPressed.ArrowUp) {
        player.y -= player.speed;
    }
    if (keysPressed.ArrowDown) {
        player.y += player.speed;
    }
    if (keysPressed.ArrowLeft) {
        player.x -= player.speed;
    }
    if (keysPressed.ArrowRight) {
        player.x += player.speed;
    }
}

/**
 * НОВЕ: Функція draw()
 * Ця функція відповідає за все, що малюється на екрані.
 * Вона теж викликається в кожному кадрі, ПІСЛЯ update().
 */
function draw() {
    // 1. Очищуємо все поле
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Малюємо карту (регіони)
    regions.forEach(region => {
        ctx.fillStyle = region.color;
        ctx.fillRect(region.x, region.y, region.width, region.height);
        ctx.fillStyle = '#000';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(region.name, region.x + region.width / 2, region.y + region.height / 2);
    });

    // 3. НОВЕ: Малюємо гравця
    // Використовуємо ctx.drawImage() для малювання нашого спрайту
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

/**
 * НОВЕ: Ігровий Цикл (Game Loop)
 * Це серце нашої гри. Ця функція безперервно виконується,
 * оновлюючи логіку та перемальовуючи екран.
 */
function gameLoop() {
    update(); // Спочатку оновлюємо логіку (наприклад, нові координати гравця)
    draw();   // Потім перемальовуємо все з новими даними

    // Просимо браузер викликати gameLoop знову, як тільки він буде готовий
    // Це створює плавну анімацію
    requestAnimationFrame(gameLoop);
}


// --- 4. ОБРОБКА ПОДІЙ ---

// Обробка кліків миші (залишається без змін, але тепер не використовується активно)
function handleMapClick(mouseX, mouseY) {
    let regionClicked = false;
    regions.forEach(region => {
        if (mouseX > region.x && mouseX < region.x + region.width &&
            mouseY > region.y && mouseY < region.y + region.height) {
            infoPanel.innerHTML = `<h2>${region.name}</h2><p>${region.description}</p>`;
            regionClicked = true;
        }
    });
    if (!regionClicked) {
        infoPanel.innerHTML = `<h2>Інформація</h2><p>Клікніть на регіон, щоб дізнатися більше.</p>`;
    }
}
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    handleMapClick(mouseX, mouseY);
});


// НОВЕ: Обробка натискання клавіш
window.addEventListener('keydown', function(event) {
    if (keysPressed.hasOwnProperty(event.key)) {
        keysPressed[event.key] = true;
    }
});

window.addEventListener('keyup', function(event) {
    if (keysPressed.hasOwnProperty(event.key)) {
        keysPressed[event.key] = false;
    }
});


// --- 5. ЗАПУСК ГРИ ---

// ВАЖЛИВО: Ми повинні запустити гру тільки ПІСЛЯ того,
// як зображення нашого героя повністю завантажиться.
// Інакше гра спробує намалювати порожню картинку.
player.image.onload = function() {
    // Запускаємо ігровий цикл
    gameLoop();
};