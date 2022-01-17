"use strict";

window.onload = function () {
    let gameRunning = false;
    let char = document.querySelector("[data-char]");
    document.addEventListener("keyup", (e) => {
        if (e.code === "Space" && gameRunning == false) {
            console.log("Starting game");
            document.querySelector("[data-start-text]").classList.toggle("hide");
            document.querySelector("[data-game]").classList.toggle("game-fullscreen");
            char.classList.toggle("char-fullscreen");
        }
    });
};
