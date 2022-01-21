import { Sound } from "./sound.js";

export class Dinosaur {
    constructor() {
        this.isAlive = false;
        this.state = "still";
        this.jumpSound = new Sound("assets/soundtrack/acidgo.mp3");
    }
    jump() {
        const dino = document.querySelector("[data-char-box]");
        if (!dino.classList.contains("jump")) {
            this.jumpSound.replay();
            dino.classList.add("jump");
            this.state = "jumping";
            setTimeout(function () {
                dino.classList.remove("jump");
                this.state = "running";
            }, 500);
        }
    }
}
