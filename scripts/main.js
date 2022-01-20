"use strict";
import * as leaderboard from "./leaderboard.js";
import { sound } from "./sound.js";

// Game state
let gameRunning = false;

// dino character
let dino = {
    state: "running",
    isAlive: false,
};

// Interval to log alive and gamerunning values every 0.1 sec
// setInterval(() => {
//     console.log(`Interval: Alive: ${dino.isAlive}, Game running: ${gameRunning}`);
// }, 100);

// DOMs
const char = document.querySelector("[data-char-box]");

window.onload = function () {
    document.addEventListener("keyup", (e) => {
        console.log(e);
        console.log("Gamerunning keypress: ", gameRunning);
        if (e.code === "Space" && gameRunning == false) {
            gameRunning = true;
            displayHighScore();
            startGame();
        }
        // else if (e.code === "Space" && gameRunning == true && dino.isAlive)
        else {
            console.log("Spel is nog bezig");
            dino.state = "jumping";
            jump();
        }
    });
};

const backgroudSound = new sound("assets/soundtrack/ome_robert.mp3");
function render() {
    // Add background sound
    backgroudSound.replay();
    // Loop sound after 137seconds (sound duration)
    setInterval(function () {
        backgroudSound.replay();
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
    // Render hidescore if != 0
}

let counter = 0;
let i = 0;
function runAnimation() {
    counter += 1;
    const dinoImages = [
        '<img class="char" id="char" src="./assets/img/dino.png" alt="dino" data-char />',
        '<img class="char" id="char" src="./assets/img/dino1.png" alt="dino" data-char />',
        '<img class="char" id="char" src="./assets/img/dino2.png" alt="dino" data-char />',
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
        else if (score >= 10000) _highscore.innerHTML = `${score}`;
    }

    // Obstacle speed
    obstacleSpeed();

    isColliding();

    // Check if dino is still alive
    if (dino.isAlive)
        setTimeout(function () {
            requestAnimationFrame(runAnimation);
        }, 1000 / fps);
    if (!dino.isAlive) {
        cancelAnimationFrame(runAnimation);
        // console.log("Logging from animation scope", dino.isAlive, gameRunning);
        gameOver();
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

    let charTop = parseInt(window.getComputedStyle(char).getPropertyValue("top")); // Get current dino Y position
    let obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left")); // Get current cactus X positon
    // Detect collision
    if (obstacleLeft < 75 && obstacleLeft > 0 && charTop >= 160) {
        dino.isAlive = false;
    }
}

function gameOver() {
    // Hide obstacle
    const obstacle = document.querySelector("[data-obstacle]");
    obstacle.classList.add("paused");

    // Showing achieved score in popup
    const scoreElement = document.querySelector("[data-score-popup]");
    scoreElement.textContent = `Score: ${score}`;

    // Show popup
    const popup = document.querySelector("[data-popup]");
    popup.classList.add("active");

    // Save score locally
    saveHighScore(score);
}

function saveHighScore(scr) {
    const hiScore = localStorage.getItem("highscore");
    const newScore = scr;
    // Check to see if new score is higher than old score
    if (newScore > hiScore) localStorage.setItem("highscore", newScore);
    displayHighScore();
}

function displayHighScore() {
    const hiScoreElement = document.querySelector("[data-high-score]");
    const hiScoreStorage = localStorage.getItem("highscore");

    // Hide if highscore is 0 || null (Default value if never played)
    if (hiScoreStorage == null || hiScoreStorage == 0) hiScoreElement.classList.add("hide");
    else if (hiScoreStorage != 0) {
        hiScoreElement.classList.remove("hide");
        if (hiScoreStorage <= 9) hiScoreElement.textContent = `0000${hiScoreStorage}`;
        else if (hiScoreStorage >= 10 && hiScoreStorage <= 99) hiScoreElement.textContent = `000${hiScoreStorage}`;
        else if (hiScoreStorage >= 100 && hiScoreStorage <= 999) hiScoreElement.textContent = `00${hiScoreStorage}`;
        else if (hiScoreStorage >= 1000 && hiScoreStorage <= 9999) hiScoreElement.textContent = `0${hiScoreStorage}`;
        else if (hiScoreStorage >= 10000) hiScoreElement.textContent = hiScoreStorage;
    }
}

function startGame() {
    dino.isAlive = true;
    console.log("Spel gestart", dino.isAlive, gameRunning);
    render();
    const obstacles = document.querySelector("[data-obstacles]");
    obstacles.classList.add("hide");
    score = 0;
    runGame();
    isColliding();
}

function returnHome() {
    // Revert to small screen
    document.querySelector("[data-game]").classList.remove("game-fullscreen");
    // Revert dino
    char.classList.remove("char-box-fullscreen");
    // Remove score and show start text
    document.querySelector(".scores").classList.add("hide");
    document.querySelector("[data-start-text]").classList.remove("hide");
    // Hide obstacle
    document.querySelector("[data-obstacles]").classList.add("hide");
    // Default dino
    document.querySelector(["[data-char-box"]).innerHTML = `<img class="char" id="char" src="./assets/img/dino.png" alt="dino" data-char/>`;
    // Stop sound
    backgroudSound.stop();
}

(function initPopup() {
    const popup = document.querySelector("[data-popup");

    const close = document.querySelector("[data-close]");
    close.addEventListener("click", () => {
        gameRunning = false;
        console.log(`gamerunning: ${gameRunning}, dino alive: ${dino.isAlive}`);
        popup.classList.remove("active");
        // Reset saved status
        save.classList.remove("saved");
        returnHome();
    });
    const save = document.querySelector("[data-save]");
    save.addEventListener("click", async () => {
        console.log(`gamerunning: ${gameRunning},dino alive: ${dino.isAlive}`);
        const username = document.querySelector("[data-username]").value;
        const messageBox = document.querySelector("[data-message]");
        if (!username) {
            messageBox.classList = "";
            messageBox.classList.add("message", "error");
            messageBox.textContent = "Enter a name before saving.";
            return;
        }
        if (save.classList.contains("saved")) {
            messageBox.classList = "";
            messageBox.classList.add("message", "error");
            messageBox.textContent = "Can not save same run twice";
            return;
        }
        save.classList.add("saving");
        save.textContent = "...";
        await fetch("https://suezhoo-dinosaur.herokuapp.com/score", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: document.querySelector("[data-username]").value, score }),
        }).then((data) => {
            if (!data.ok) {
                messageBox.classList.replace("hide", "error");
                messageBox.textContent = "Something went wrong, try again later...";
            } else {
                messageBox.classList = "";
                messageBox.classList.add("message", "success");
                messageBox.textContent = "Score successfully saved";
                save.classList.replace("saving", "saved");
                save.textContent = "DONE";
            }
        });
        leaderboard.displayScores();
    });
    const playAgain = document.querySelector("[data-play-again]");
    playAgain.addEventListener("click", () => {
        // console.log(`gamerunning: ${gameRunning},dino alive: ${dino.isAlive}`);
        popup.classList.remove("active");
        // Reset saved status
        save.classList.remove("saved");
        startGame();
    });
    const exit = document.querySelector("[data-exit-game");
    exit.addEventListener("click", () => {
        gameRunning = false;
        console.log(`gamerunning: ${gameRunning},dino alive: ${dino.isAlive}`);
        popup.classList.remove("active");
        // Reset saved status
        save.classList.remove("saved");
        returnHome();
    });
})();

(function () {
    leaderboard.displayScores();
    setInterval(() => leaderboard.displayScores(), 5000);
})();
