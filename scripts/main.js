"use strict";

import { Game } from "./game.js";

// Game instance
const game = new Game();

// Initialize Button to start the game
window.onload = function () {
    initializeGame();
};

export function initializeGame() {
    document.addEventListener("keydown", initSpace);
}

export function removeEventListener() {
    document.removeEventListener("keydown", initSpace);
}

function initSpace(e) {
    if (e.code === "Space" && !game.isRunning) {
        console.log("start");
        prepare();
    } else if (e.code === "Space" && game.isRunning && game.dino.isAlive) {
        console.log("jump");
        game.dino.jump();
    }
}

function prepare() {
    game.prepareGame();
    game.animate();
}

export function stopInterval() {
    clearInterval(animationInterval);
}

let animationInterval;
export function startInterval() {
    animationInterval = setInterval(() => {
        console.log(game.isRunning, game.dino.isAlive);
        if (game.isRunning && game.dino.isAlive) {
            game.animate();
        }
    }, 1000 / game.fps); // 60 frames per second
}

// Running animation

game.initPopup();
