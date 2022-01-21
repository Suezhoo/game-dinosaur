"use strict";

import { Game } from "./game.js";
import * as leaderboard from "./leaderboard.js";

// Game instance
const game = new Game();

// Initialize Button to start the game
window.onload = function () {
    //  Block scrolling with spacebar
    window.addEventListener("keydown", function (e) {
        if (e.code === "Space") {
            document.body.style.overflow = "hidden";
        }
    });
    window.addEventListener("keyup", function (e) {
        if (e.code === "Space") {
            document.body.style.overflow = "auto";
        }
    });

    initializeGame();
    game.initPopup();
};

export function initializeGame() {
    document.addEventListener("keydown", initSpace);
}

export function removeEventListener() {
    document.removeEventListener("keydown", initSpace);
}

function initSpace(e) {
    if (e.code === "Space" && !game.isRunning) {
        game.startGame();
    } else if (e.code === "Space" && game.isRunning && game.dino.isAlive) {
        game.dino.jump();
    }
}

export function stopInterval() {
    clearInterval(animationInterval);
}

let animationInterval;
export function startInterval() {
    animationInterval = setInterval(() => {
        if (game.isRunning && game.dino.isAlive) {
            game.animate();
        }
    }, 1000 / game.fps); // 60 frames per second
}

// Update leaderboard every 10seconds
(function updateLeaderboard() {
    leaderboard.displayScores();
    let leaderboardUpdate = setInterval(() => {
        leaderboard.displayScores();
    }, 10000);
})();
