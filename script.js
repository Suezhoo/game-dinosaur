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
            console.log("Gamerunning:", gameRunning);
            render();
        } else if (e.code === "Space" && gameRunning == true) {
            dino.state = "jumping";
            jump();
        }
        if (gameRunning == true) runAnimation();
    });
};

function render() {
    // Add obstacles
    document.querySelector("[data-obstacles]").classList.remove("hide");
    addObstacle();
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
    const fps = 60;
    counter += 1;
    // console.log(`%cFPS Count: %c${counter % fps}`, "font-weight: bold", "color: limegreen");
    // console.log((counter % fps) % 11);
    // console.log(counter);
    const dinoImages = [
        '<img class="char char-fullscreen" id="char" src="./assets/img/dino.png" alt="dino" data-char />',
        '<img class="char char-fullscreen" id="char" src="./assets/img/dino1.png" alt="dino" data-char />',
        '<img class="char char-fullscreen" id="char" src="./assets/img/dino2.png" alt="dino" data-char />',
    ];

    if (counter % 5 === 0) {
        if (i > 2) {
            i = 0;
        }
        char.innerHTML = dinoImages[i];
        i++;
    }

    if (dino.state == "jumping") char.innerHTML = dinoImages[0];

    if (dino.isAlive && dino.state == "running")
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
            runAnimation();
        }, 500);
    }
}
