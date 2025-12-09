import { SnakeGame } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("scoreVal");
const highScoreEl = document.getElementById("highScoreVal");
const msg = document.getElementById("msg");

const gioco = new SnakeGame();

let intervallo = null;
let inPausa = false;

let highScore = Number(localStorage.getItem("snakeHighScore") || 0);
highScoreEl.innerText = highScore;

function disegnaCella(x, y, colore, raggio = 4) {
    ctx.fillStyle = colore;
    ctx.beginPath();
    ctx.roundRect(x * 20 + 1, y * 20 + 1, 20 - 2, 20 - 2, raggio);
    ctx.fill();
}

function disegna() {
    ctx.clearRect(0, 0, 400, 400);

    // Disegna la griglia
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < gioco.dimensioneGriglia; i++) {
        ctx.beginPath(); ctx.moveTo(i * 20, 0); ctx.lineTo(i * 20, 400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * 20); ctx.lineTo(400, i * 20); ctx.stroke();
    }

    // Disegna il cibo
    disegnaCella(gioco.cibo.x, gioco.cibo.y, "#ef4444", 8);
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.beginPath();
    ctx.arc(gioco.cibo.x * 20 + 6, gioco.cibo.y * 20 + 6, 2, 0, Math.PI * 2);
    ctx.fill();

    // Disegna il serpente
    gioco.serpente.forEach((p, i) => {
        disegnaCella(p.x, p.y, i === 0 ? "#10b981" : "#34d399", i === 0 ? 6 : 2);

        // Disegna gli occhi della testa
        if (i === 0) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(p.x * 20 + 6, p.y * 20 + 6, 2, 0, Math.PI * 2);
            ctx.arc(p.x * 20 + 14, p.y * 20 + 6, 2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(p.x * 20 + 6, p.y * 20 + 6, 1, 0, Math.PI * 2);
            ctx.arc(p.x * 20 + 14, p.y * 20 + 6, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // Punteggio
    scoreEl.innerText = gioco.punteggio;

    if (inPausa) {
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0, 0, 400, 400);
        ctx.fillStyle = "white";
        ctx.font = "28px Arial";
        ctx.fillText("PAUSA", 150, 200);
    }
}

function avviaTimer() {
    if (intervallo) return;

    intervallo = setInterval(() => {
        const esito = gioco.aggiorna();
        if (esito.morto) {
            clearInterval(intervallo);
            intervallo = null;
            if (gioco.punteggio > highScore) {
                highScore = gioco.punteggio;
                highScoreEl.innerText = highScore;
                localStorage.setItem("snakeHighScore", highScore);
            }
            msg.innerText = "Game Over! Premi una freccia per ripartire";
        }

        disegna();
    }, gioco.velocita);
}

document.addEventListener("keydown", e => {
    if (e.key === " ") {
        inPausa = !inPausa;
        disegna();
        return;
    }

    switch (e.key) {
        case "ArrowUp": gioco.impostaDirezione({ x: 0, y: -1 }); break;
        case "ArrowDown": gioco.impostaDirezione({ x: 0, y: 1 }); break;
        case "ArrowLeft": gioco.impostaDirezione({ x: -1, y: 0 }); break;
        case "ArrowRight": gioco.impostaDirezione({ x: 1, y: 0 }); break;
    }

    avviaTimer();
    msg.innerText = "";
});

disegna();
