window.onload = function () {
    // DOMs
    const p = document.querySelector("[data-popup]");
    // Cross button
    const closeBtn = document.querySelector("[data-close]");
    closeBtn.addEventListener("click", () => {
        p.classList.remove("active");
        // Reset score saved status
        saveBtn.classList.remove("saved");
        window.location.href = "http://127.0.0.1:5500";
    });
    // Exit button
    const exitBtn = document.querySelector("[data-exit-game]");
    exitBtn.addEventListener("click", () => {
        p.classList.remove("active");
        // Reset score saved status
        saveBtn.classList.remove("saved");
        window.location.href = "http://127.0.0.1:5500";
    });
    // Play Again button
    const playAgainBtn = document.querySelector("[data-play-again]");
    playAgainBtn.addEventListener("click", () => {
        console.log("click play again");
    });
    // Save score
    const saveBtn = document.querySelector("[data-save]");
    saveBtn.addEventListener("click", async () => {
        const name = document.querySelector("[data-username").value;
        const messageBox = document.querySelector("[data-message]");
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
        leaderboard.displayScores();
    });
};
