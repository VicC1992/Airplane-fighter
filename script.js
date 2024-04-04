const windowGame = document.querySelector(".gameDiv");
let gameWindowRect = windowGame.getBoundingClientRect();
let horizontalPositionPlane;
let verticalPositionPlane;
let gameInProcess = false;
//crearea avionului
function createPlane() {
    const plane = document.createElement("div");
    windowGame.appendChild(plane);
    horizontalPositionPlane = 47;
    verticalPositionPlane = 81;
    plane.classList.add("plane");
    document.addEventListener("keydown", planeMove);
}
//manevrarea avionului
let verticalPositionPlaneLimitUp = 1;
let verticalPositionPlaneLimitDown = 81;
let horizontalPositionPlaneLimitRight = 90;
let horizontalPositionPlaneLimitLeft = 1;

function planeMove(e) {
    const planeMove = document.querySelector(".plane");
    if (e.key === "ArrowRight" && horizontalPositionPlane < horizontalPositionPlaneLimitRight) {
        horizontalPositionPlane += 1;
        planeMove.style.left = `${horizontalPositionPlane}%`;
    } else if (e.key === "ArrowLeft" && horizontalPositionPlane > horizontalPositionPlaneLimitLeft) {
        horizontalPositionPlane -= 1;
        planeMove.style.left = `${horizontalPositionPlane}%`;
    } else if (e.key === "ArrowUp" && verticalPositionPlane > verticalPositionPlaneLimitUp) {
        verticalPositionPlane -= 2;
        planeMove.style.top = `${verticalPositionPlane}%`;
    } else if (e.key === "ArrowDown" && verticalPositionPlane < verticalPositionPlaneLimitDown) {
        verticalPositionPlane += 2;
        planeMove.style.top = `${verticalPositionPlane}%`;
    }
}
//generarea pozitii random pentru crearea de asteroizi
function getRandomPosition(min, max) {
    return Math.random() * (max - min) + min;
}
//crearea asteroizilor
let asteroidInterval;
let speedCreationAsteriod = 3500;

function createAsteroid() {
    if (gameInProcess === true) {
        const asteroid = document.createElement("div");
        windowGame.appendChild(asteroid);
        asteroid.classList.add("asteroid");
        asteroid.style.left = `${getRandomPosition(24, 72)}%`;
        asteroidLanding(asteroid);
    }
}
//asteroizi evitati
let landedAsteroids = 0;
const levelSpan = document.getElementById("level");
let spanLandedAsteroids = document.getElementById("landedAsteroids");
setInterval(asteroidLanding, 100);

function asteroidLanding() {
    if (gameInProcess === true) {
        const asteroids = document.querySelectorAll(".asteroid");
        asteroids.forEach(asteroid => {
            const asteroidRect = asteroid.getBoundingClientRect();
            if (asteroidRect.bottom >= gameWindowRect.bottom) {
                asteroid.remove();
                ++landedAsteroids;
                spanLandedAsteroids.innerText = landedAsteroids;
            }
        });
    }
}
//coliziunea intre asteroid si avion
let damagePlane = 25;
let airplaneLife = 100;
let collisionPlaneAsteroidInterval;

function collisionPlaneAsteroid() {
    if (gameInProcess === true) {
        const asteroids = document.querySelectorAll(".asteroid");
        const plane = document.querySelector(".plane");
        const planeRect = plane.getBoundingClientRect();
        asteroids.forEach(asteroid => {
            const asteroidRect = asteroid.getBoundingClientRect();
            if (asteroidRect.bottom >= planeRect.top && asteroidRect.right >= planeRect.left && asteroidRect.left <= planeRect.right) {
                asteroid.remove();
                airplaneLife -= damagePlane;
                airplaneLifeSpan.innerText = airplaneLife;
                if (airplaneLife <= 0) {
                    gameOver();
                }
            }
        })
    }
}
//crearea munitiei
function createBullet() {
    if (gameInProcess === true) {
        const bullet = document.createElement("div");
        bullet.classList.add("bullet");
        bullet.style.top = `${verticalPositionPlane - 2}%`;
        bullet.style.left = `${horizontalPositionPlane + 2.5}%`;
        windowGame.appendChild(bullet);
        flewBullets(bullet);
    }
}
document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
        createBullet();
    }
});
//eliminarea gloantelor ce depasesc fereastra jocului
setInterval(flewBullets, 100);

function flewBullets() {
    const bullets = document.querySelectorAll(".bullet");
    bullets.forEach(bullet => {
        const bulletRect = bullet.getBoundingClientRect();
        if (bulletRect.top <= gameWindowRect.top) {
            bullet.remove();
        }
    });
}
let level = 0;
let nextLevel = 50;
let destroyedAsteroids = 0;
const eliminatedAsteroids = document.getElementById("eliminatedAsteroids");
const airplaneLifeSpan = document.getElementById("airplaneLife");
//distrugerea asteroizilor
setInterval(collisionBulletAsteroid, 100);

function collisionBulletAsteroid(bullet) {
    const bullets = document.querySelectorAll(".bullet");
    const asteroids = document.querySelectorAll(".asteroid");
    bullets.forEach(bullet => {
        const bulletRect = bullet.getBoundingClientRect();
        asteroids.forEach(asteroid => {
            const asteroidRect = asteroid.getBoundingClientRect();
            if (asteroidRect.bottom >= bulletRect.top && asteroidRect.right >= bulletRect.left && asteroidRect.left <= bulletRect.right) {
                asteroid.remove();
                bullet.remove();
                ++destroyedAsteroids;
                if (destroyedAsteroids === nextLevel && speedCreationAsteriod >= 500) {
                    clearInterval(asteroidInterval);
                    speedCreationAsteriod -= 200;
                    nextLevel += 50;
                    ++level;
                    levelSpan.innerText = level;
                    asteroidInterval = setInterval(createAsteroid, speedCreationAsteriod);
                }
                eliminatedAsteroids.innerText = destroyedAsteroids;
            }
        });
    })
}
//timer
let hour = 0;
let minute = 0;
let second = 0;
let millisecond = 0;
let cron;

function start() {
    pause();
    cron = setInterval(() => {
        timer();
    }, 10);
}

function pause() {
    clearInterval(cron);
}

function reset() {
    hour = 0;
    minute = 0;
    second = 0;
    millisecond = 0;
    document.getElementById('hour').innerText = '00';
    document.getElementById('minute').innerText = '00';
    document.getElementById('second').innerText = '00';
}

function timer() {
    if ((millisecond += 10) == 1000) {
        millisecond = 0;
        second++;
    }
    if (second == 60) {
        second = 0;
        minute++;
    }
    if (minute == 60) {
        minute = 0;
        hour++;
    }
    document.getElementById('hour').innerText = returnData(hour);
    document.getElementById('minute').innerText = returnData(minute);
    document.getElementById('second').innerText = returnData(second);
}

function returnData(input) {
    return input > 10 ? input : `0${input}`
}
//creare fereastra intro
const pageContainer = document.getElementById("pageDiv");
introGame();

function introGame() {
    const introDiv = document.createElement("div");
    const startButton = document.createElement("button");
    pageContainer.appendChild(introDiv);
    introDiv.classList.add("introDiv");
    pageContainer.appendChild(startButton);
    startButton.classList.add("startButton");
    startButton.innerText = "Start Game";
    startButton.addEventListener("click", startGame);
    startButton.addEventListener("click", start);
}
//start joc
let intro = document.querySelector(".introDiv");
let startButton = document.querySelector(".startButton");

function startGame() {
    gameInProcess = true;
    createPlane();
    collisionPlaneAsteroidInterval = setInterval(collisionPlaneAsteroid, 100);
    asteroidInterval = setInterval(createAsteroid, speedCreationAsteriod);
    intro.style.visibility = "hidden";
    startButton.style.visibility = "hidden";
}
//stop joc
function createGameOverDiv() {
    const gameOverDiv = document.createElement("div");
    windowGame.appendChild(gameOverDiv);
    gameOverDiv.classList.add("gameOver");
}

function gameOver() {
    const plane = document.querySelector(".plane");
    let asteroids = document.querySelectorAll(".asteroid");
    gameInProcess = false;
    plane.remove();
    clearInterval(asteroidInterval);
    clearInterval(collisionPlaneAsteroidInterval);
    asteroids.forEach(asteroid => {
        asteroid.remove();
    });
    pause();
    createGameOverDiv();
    createRestartButton();
}

function createRestartButton() {
    const restartButton = document.createElement("button");
    windowGame.appendChild(restartButton);
    restartButton.classList.add("restartButton");
    restartButton.innerText = "Restart Game";
    restartButton.addEventListener("click", restartGame);
}

function restartGame() {
    gameInProcess = true;
    let gameOverDiv = document.querySelector(".gameOver");
    let restartButton = document.querySelector(".restartButton");
    gameOverDiv.remove();
    restartButton.remove();
    level = 0;
    landedAsteroids = 0;
    destroyedAsteroids = 0;
    airplaneLife = 100;
    levelSpan.innerText = level;
    eliminatedAsteroids.innerText = destroyedAsteroids;
    spanLandedAsteroids.innerText = landedAsteroids;
    airplaneLifeSpan.innerText = airplaneLife;
    collisionPlaneAsteroidInterval = setInterval(collisionPlaneAsteroid, 100);
    clearInterval(asteroidInterval);
    speedCreationAsteriod = 3500;
    asteroidInterval = setInterval(createAsteroid, speedCreationAsteriod);
    reset();
    start();
    createPlane();
}