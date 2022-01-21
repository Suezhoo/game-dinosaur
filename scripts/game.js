import { Dinosaur } from "./dino.js";
import * as leaderboard from "./leaderboard.js";
import * as m from "./main.js";

export class Game {
    constructor() {
        this.isRunning = false;
        this.score = 0;
        this.highScore = 0;
        this.fps = 60;
        this.iterator = 0;
        this.images = [
            '<img class="char" id="char" src="./assets/img/dino.png" alt="dino" data-char />',
            '<img class="char" id="char" src="./assets/img/dino1.png" alt="dino" data-char />',
            '<img class="char" id="char" src="./assets/img/dino2.png" alt="dino" data-char />',
        ];
        this.imageNumber = 0;
        this.dino = new Dinosaur();
    }
    prepareGame() {
        //
        console.log("Everything prepared for fullscreen");

        // Remove 'Press Space to play...'
        document.querySelector("[data-start-text]").classList.add("hide");
        // Game frame
        document.querySelector("[data-game]").classList.replace("game", "game-fullscreen");
        // Enlarge dino
        document.querySelector("[data-char-box]").classList.replace("char-box", "char-box-fullscreen");
        // Unhide score
        document.querySelector("[data-score]").classList.remove("hide");
        // Display high score if score != 0
        this.displayHighScore();
        // Set dino is alive to true
        this.dino.isAlive = true;
        // Set game state to true
        this.isRunning = true;
        // Initiate animation interval
        m.startInterval();
        // Unhide obstacles
        this.unhideObstacles();
    }
    unhideObstacles() {
        const obstacles = document.querySelector("[data-obstacles]");
        setTimeout(function () {
            obstacles.classList.remove("hide");
            document.querySelector("[data-obstacle]").classList.remove("paused");
        }, 2000);
    }
    animate() {
        // Dinosaur animation
        this.runningAnimation();
        // Calculate and display score
        this.displayScore();
        // Obstacle Speed
        // this.determineObstacleSpeed();
        // Check for collision
        this.isColliding();
    }
    startGame() {
        this.prepareGame();
        this.animate();
    }
    restartGame() {
        // Remove obstacle
        document.querySelector("[data-obstacles]").classList.add("hide");
        // Set dino alive to true
        this.dino.isAlive = true;
        // Set game running to true
        this.isRunning = true;
        // Start running animation interval
        m.startInterval();
        // Initalize Space
        m.initializeGame();
        // Unhide obstacle
        this.unhideObstacles();
    }
    runningAnimation() {
        // Running
        if (this.iterator % 5 === 0) {
            if (this.imageNumber == 3) this.imageNumber = 0;
            document.querySelector("[data-char-box").innerHTML = this.images[this.imageNumber];
            this.imageNumber++;
        }
        this.iterator++;
    }
    displayScore() {
        if (this.iterator % 20 === 0) this.score += 1;

        // Preparing DOMs
        let scoreText = document.querySelector("[data-score]");
        let highScoreText = document.querySelector("[data-high-score]");
        // Formatting
        // Score
        if (this.score <= 9) scoreText.textContent = `0000${this.score}`;
        else if (this.score >= 10 && this.score <= 99) scoreText.textContent = `000${this.score}`;
        else if (this.score >= 100 && this.score <= 999) scoreText.textContent = `00${this.score}`;
        else if (this.score >= 1000 && this.score <= 9999) scoreText.textContent = `0${this.score}`;
        else if (this.score >= 10000) scoreText.textContent = this.score;
        // If Current Score is higher than stored High Score
        if (this.score > this.highScore) {
            if (this.score < 9) highScoreText.textContent = `0000${this.score}`;
            else if (this.score >= 10 && this.score <= 99) highScoreText.textContent = `000${this.score}`;
            else if (this.score >= 100 && this.score <= 999) highScoreText.textContent = `00${this.score}`;
            else if (this.score >= 1000 && this.score <= 9999) highScoreText.textContent = `0${this.score}`;
            else if (this.score >= 10000) highScoreText.textContent = this.score;
        }
    }
    displayHighScore() {
        this.highScore = localStorage.getItem("highscore");
        if (this.highScore != null) {
            const highScoreText = document.querySelector("[data-high-score]");
            highScoreText.classList.remove("hide");
            // Formatting
            if (this.highScore < 9) highScoreText.textContent = `0000${this.highScore}`;
            else if (this.highScore >= 10 && this.highScore <= 99) highScoreText.textContent = `000${this.highScore}`;
            else if (this.highScore >= 100 && this.highScore <= 999) highScoreText.textContent = `00${this.highScore}`;
            else if (this.highScore >= 1000 && this.highScore <= 9999) highScoreText.textContent = `0${this.highScore}`;
            else if (this.highScore >= 10000) highScoreText.textContent = this.highScore;
        }
    }
    storeHighScore() {
        if (this.score > this.highScore) {
            localStorage.setItem("highscore", this.score);
        }
    }
    determineObstacleSpeed() {
        const obstacle = document.querySelector("[data-obstacle]");
        if (this.score <= 100) obstacle.classList = "speed2";
        if (this.score >= 100 && this.score <= 1000) obstacle.classList = "speed1_5";
        if (this.score >= 1000) obstacle.classList = "speed1";
    }
    isColliding() {
        // DOMs
        const char = document.querySelector("[data-char]");
        const obstacle = document.querySelector("[data-obstacle]");
        // Values
        const dinoBottom = char.getBoundingClientRect().bottom; // Bottom Y Dino
        const obstacleTop = obstacle.getBoundingClientRect().top; // Top Y Obstacle
        const obstacleLeft = parseInt(window.getComputedStyle(obstacle).getPropertyValue("left")); // Left X Obstacle
        const distanceY = dinoBottom - obstacleTop; // Distance between Bottom Y Dino and Top Y Obstacle
        if (obstacleLeft < 75 && obstacleLeft > 0 && distanceY >= 10) {
            this.dino.isAlive = false;
            this.isRunning = false;
            this.gameOver();
        }
    }
    gameOver() {
        console.log(this.dino.isAlive, this.isRunning);
        // Defaulting dino stance upon death
        if (!this.dino.isAlive) {
            document.querySelector("[data-char-box").innerHTML = this.images[0];
        }

        // Freeze obstacle
        const obstacle = document.querySelector("[data-obstacle]");
        obstacle.classList.add("paused");

        // Show popup
        const popup = document.querySelector("[data-popup]");
        popup.classList.add("active");

        // Showing achieved score in popup
        const scorePopup = document.querySelector("[data-score-popup]");
        scorePopup.textContent = `Score: ${this.score}`;

        // Store high score locally
        this.storeHighScore();

        m.stopInterval();
        m.removeEventListener();
    }
    initPopup() {
        // DOMs
        const p = document.querySelector("[data-popup]");
        const messageBox = document.querySelector("[data-message]");
        // Cross button
        const closeBtn = document.querySelector("[data-close]");
        closeBtn.addEventListener("click", (e) => {
            p.classList.remove("active");
            // Reset score saved status
            saveBtn.classList.remove("saved", "saving");
            // Defaulting button and error message
            messageBox.classList = "";
            messageBox.classList.add("message", "hide");
            saveBtn.textContent = "SAVE";
            this.revertToHomePage();
            // Reset score to 0
            this.score = 0;
        });
        // Exit button
        const exitBtn = document.querySelector("[data-exit-game]");
        exitBtn.addEventListener("click", (e) => {
            p.classList.remove("active");
            // Reset score saved status
            saveBtn.classList.remove("saved", "saving");
            // Defaulting button and error message
            messageBox.classList = "";
            messageBox.classList.add("message", "hide");
            saveBtn.textContent = "SAVE";
            this.revertToHomePage();
            // Reset score to 0
            this.score = 0;
        });
        // Play Again button
        const playAgainBtn = document.querySelector("[data-play-again]");
        playAgainBtn.addEventListener("click", () => {
            p.classList.remove("active");
            saveBtn.classList.remove("saved", "saving");
            // Defaulting button and error message
            messageBox.classList = "";
            messageBox.classList.add("message", "hide");
            saveBtn.textContent = "SAVE";
            this.restartGame();
            // Reset score to 0
            this.score = 0;
        });
        // Save score
        const saveBtn = document.querySelector("[data-save]");
        saveBtn.addEventListener("click", async () => {
            const name = document.querySelector("[data-username").value;
            // No name given
            if (!name) {
                messageBox.classList = "";
                messageBox.classList.add("message", "error");
                messageBox.textContent = "Enter a name before saving";
                return;
            }
            // Double entries
            if (saveBtn.classList.contains("saved")) {
                messageBox.classList = "";
                messageBox.classList.add("message", "error");
                messageBox.textContent = "Can not save the same run twice";
            }
            // Saving data
            saveBtn.classList.add("saving"); // Animation class
            saveBtn.textContent = "...";
            await fetch("https://suezhoo-dinosaur.herokuapp.com/score", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ score: this.score, name }),
            }).then((data) => {
                if (!data.ok) {
                    messageBox.classList.replace("hide", "error");
                    messageBox.textContent = "Something went wrong, try again later...";
                } else {
                    messageBox.classList = "";
                    messageBox.classList.add("message", "success");
                    messageBox.textContent = "Score successfully saved";
                    saveBtn.classList.replace("saving", "saved");
                    saveBtn.textContent = "DONE";
                }
            });
            // Reset score to 0
            this.score = 0;
            leaderboard.displayScores();
        });
    }
    revertToHomePage() {
        //
        console.log("Everything prepared for default screen");

        // Revert game screen to small
        document.querySelector("[data-game]").classList.replace("game-fullscreen", "game");
        // Revert dino size to small
        document.querySelector("[data-char-box").classList.replace("char-box-fullscreen", "char-box");
        // Hide score, show start text
        document.querySelector("[data-score]").classList.add("hide");
        document.querySelector("[data-high-score]").classList.add("hide");
        document.querySelector("[data-start-text").classList.remove("hide");
        // Hide obstacles
        document.querySelector("[data-obstacles").classList.add("hide");
        // Reset space eventlistener
        m.initializeGame();
    }
}
