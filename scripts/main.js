"use strict";

import { sound } from "./sound.js";

// Game state
let gameRunning = false;

// dino character
let dino = {
    state: "running",
    isAlive: true,
};

// DOMs
const char = document.querySelector("[data-char-box]");

window.onload = function () {
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && gameRunning == false) {
            gameRunning = true;
            render(); // Setup the game display
            runGame(); // Run the game
            isColliding(); // Check for collision
        } else if (e.code === "Space" && gameRunning == true && dino.isAlive) {
            dino.state = "jumping";
            jump();
        }
    });
};

function render() {
    // Add background sound
    const backgroudSound = new sound("assets/soundtrack/ome_robert.mp3");
    backgroudSound.play();
    // Loop sound after 137seconds (sound duration)
    setInterval(function () {
        backgroudSound.replay();
        console.log("test");
    }, 137000);
    // Change game to fullscreen
    document.querySelector("[data-game]").classList.add("game-fullscreen");
    // Make dino bigger
    char.classList.add("char-box-fullscreen");
    // Show score and remove start text
    document.querySelector(".scores").classList.remove("hide");
    document.querySelector("[data-start-text]").classList.add("hide");
    // Unhide obstacles
    const obstacles = document.querySelector("[data-obstacles]");
    setTimeout(function () {
        obstacles.classList.remove("hide");
    }, 2000);
    obstacles.innerHTML = `<img src="./assets/img/cactus.png" class="speed2" alt="cactus" data-obstacle/>`;
}

let counter = 0;
let i = 0;
function runAnimation() {
    counter += 1;
    const dinoImages = [
        '<img class="char char-fullscreen" id="char" src="./assets/img/dino.png" alt="dino" data-char />',
        '<img class="char char-fullscreen" id="char" src="./assets/img/dino1.png" alt="dino" data-char />',
        '<img class="char char-fullscreen" id="char" src="./assets/img/dino2.png" alt="dino" data-char />',
    ];

    // Alternate dino pictures every 5 frames
    if (counter % 5 === 0) {
        if (i > 2) {
            i = 0;
        }
        char.innerHTML = dinoImages[i];
        i++;
    }

    // Freeze image if jumping
    if (dino.state == "jumping") char.innerHTML = dinoImages[0];

    // Callback to keep game running
    runGame();
}

let score = 0;
function runGame() {
    const fps = 60;
    if (counter % 20 === 0) score += 1;

    // Scoring
    const _score = document.querySelector("[data-score]");
    const _highscore = document.querySelector("[data-high-score]");

    if (score <= 9) _score.innerHTML = `0000${score}`;
    else if (score >= 10 && score <= 99) _score.innerHTML = `000${score}`;
    else if (score >= 100 && score <= 999) _score.innerHTML = `00${score}`;
    else if (score >= 1000 && score <= 9999) _score.innerHTML = `0${score}`;
    else if (score >= 10000 && score <= 99999) _score.innerHTML = `${score}`;
    else if (score > 99999) _score.innerHTML = score;

    // Override high score
    const highscore = parseInt(document.querySelector("[data-high-score]").innerHTML);
    if (score > highscore) {
        if (score <= 9) _score.innerHTML = `0000${score}`;
        else if (score >= 10 && score <= 99) _highscore.innerHTML = `000${score}`;
        else if (score >= 100 && score <= 999) _highscore.innerHTML = `00${score}`;
        else if (score >= 1000 && score <= 9999) _highscore.innerHTML = `0${score}`;
        else if (score >= 10000 && score <= 99999) _highscore.innerHTML = `${score}`;
        else if (score > 99999) _highscore.innerHTML = score;
    }

    // Obstacle speed
    obstacleSpeed();

    // Check if dino is still alive
    if (dino.isAlive)
        setTimeout(function () {
            requestAnimationFrame(runAnimation);
        }, 1000 / fps);
    if (!dino.isAlive) {
        cancelAnimationFrame(runAnimation);
    }
}

function obstacleSpeed() {
    const obstacle = document.querySelector("[data-obstacle]");
    if (score <= 100) obstacle.classList.add("speed2");
    if (score >= 100 && score <= 1000) obstacle.classList.replace("speed2", "speed1_5");
    if (score >= 1000) obstacle.classList.replace("speed1_5", "speed1");
}

const jumpSound = new sound("assets/soundtrack/acidgo.mp3");
function jump() {
    if (!char.classList.contains("jump")) {
        jumpSound.replay();
        // Jump sound
        char.classList.add("jump");
        setTimeout(function () {
            char.classList.remove("jump");
            dino.state = "running";
        }, 500);
    }
}

function isColliding() {
    const obstacle = document.querySelector("[data-obstacle]");

    setInterval(function () {
        let charTop = parseInt(window.getComputedStyle(char).getPropertyValue("top")); // Get current dino Y position
        let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left")); // Get current cactus X positon
        // Detect collision
        if (obstacleLeft < 75 && obstacleLeft > 0 && charTop >= 160) {
            gameOver();
        }
    }, 10);
}

function gameOver() {
    dino.isAlive = false;
    // Hide obstacle
    const obstacle = document.querySelector("[data-obstacle]");
    obstacle.classList.add("paused");

    // Showing achieved score in popup
    const scoreElement = document.querySelector("[data-score-popup]");
    scoreElement.textContent = `Score: ${score}`;

    // Show popup
    const popup = document.querySelector("[data-popup]");
    popup.classList.add("active");
}
