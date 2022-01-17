"use strict";

//dino character
const char = document.getElementById("char");

window.onload = function () {
    let gameRunning = false;
    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && gameRunning == false) {
            gameRunning = true;
            console.log("Gamerunning:", gameRunning);
            render();
        } else if (e.code === "Space" && gameRunning == true) {
            jump();
        }
    });
};

function render() {
    console.log(char);
    console.log("Rendering game");
    document.querySelector("[data-start-text]").classList.toggle("hide");
    document.querySelector("[data-game]").classList.toggle("game-fullscreen");
    document.querySelector(".scores").classList.toggle("hide");
    char.classList.toggle("char-fullscreen");
}

function jump() {
    if (!char.classList.contains("jump")) {
        char.classList.add("jump");
        setTimeout(function () {
            char.classList.remove("jump");
        }, 500);
    }
}
