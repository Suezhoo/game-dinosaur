"use strict";

export async function displayScores() {
    await fetch("https://suezhoo-dinosaur.herokuapp.com/scores", { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
            // Sort high to low
            data.sort(function (a, b) {
                return b.score - a.score;
            });
            const positions = document.getElementsByClassName("positions");
            for (let i = 0; i < positions.length; i++) {
                if (i <= 4) positions[i].textContent = `${data[i].score} - ${data[i].name}`;
                else positions[i].textContent = `${data[i].name} - ${data[i].score}`;
            }
            console.log("test");
        });
}
