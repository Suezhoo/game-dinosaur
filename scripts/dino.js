export class Dinosaur {
    constructor() {
        this.isAlive = false;
        this.state = "still";
    }
    jump() {
        const dino = document.querySelector("[data-char-box]");
        if (!dino.classList.contains("jump")) {
            dino.classList.add("jump");
            this.state = "jumping";
            setTimeout(function () {
                dino.classList.remove("jump");
                this.state = "running";
            }, 500);
        }
    }
}
