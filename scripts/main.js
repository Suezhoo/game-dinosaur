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
    document.removeEventListener("touchstart", mobileTouch);
}

function initSpace(e) {
    console.log(e);
    if (e.code === "Space" && !game.isRunning) {
        game.startGame();
    } else if (e.code === "Space" && game.isRunning && game.dino.isAlive) {
        game.dino.jump();
    }
    if (e.touches && !game.isRunning) {
        game.startGame();
    } else if (e.touches && game.isRunning && game.dino.isAlive) {
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

// Interval to check if user is on landscape and screen height lower than 480
// If so, then stop the interval, and initialize touch listener
if (screen.orientation.type == "portrait-primary") {
    const checkForMobile = setInterval(() => {
        if (screen.orientation.type == "landscape-primary") {
            clearInterval(checkForMobile);
            onMobile();
        }
    }, 100);
} else if (screen.orientation.type == "landscape-primary") onMobile();

function onMobile() {
    if (screen.orientation.type == "landscape-primary") {
        if (screen.orientation.type == "landscape-primary" && screen.height <= 480) {
            document.addEventListener("touchstart", mobileTouch);
        }
    }
}

function mobileTouch(e) {
    if (e.target == document.body || (e.target.className == "game" && !e.target.className == "leaderboard")) {
        document.addEventListener("touchstart", initSpace);
    }
}
// Block spacebar input when on mobile sizes
