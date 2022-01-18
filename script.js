"use strict";

// Game state
let gameRunning = false;

// dino character
let dino = {
    state: "running",
    isAlive: true,
};

// Dino dom
const char = document.querySelector("[data-char-box]");

window.onload = function () {
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && gameRunning == false) {
            gameRunning = true;
            render();
            runGame();
        } else if (e.code === "Space" && gameRunning == true) {
            dino.state = "jumping";
            jump();
        }
    });
};

function render() {
    // Add obstacles
    document.querySelector("[data-obstacles]").classList.remove("hide");
    // addObstacle();
    // Change game to fullscreen
    document.querySelector("[data-game]").classList.add("game-fullscreen");
    // Make dino bigger
    char.classList.add("char-box-fullscreen");
    // Show score and remove start text
    document.querySelector(".scores").classList.remove("hide");
    document.querySelector("[data-start-text]").classList.add("hide");
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

    // Callback to keep animation running
    runGame();
}

let score = 0;
function runGame() {
    const fps = 60;
    if (counter % 20 === 0) {
        score += 1;
    }

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

    if (dino.isAlive)
        setTimeout(function () {
            requestAnimationFrame(runAnimation);
        }, 1000 / fps);
    if (!dino.isAlive) {
        cancelAnimationFrame(runAnimation);
    }
}

function addObstacle() {
    document.querySelector("[data-obstacles]").innerHTML = '<img src="./assets/img/cactus.png" alt="cactus" />';
}

function jump() {
    if (!char.classList.contains("jump")) {
        char.classList.add("jump");
        setTimeout(function () {
            char.classList.remove("jump");
            dino.state = "running";
        }, 500);
    }
}
