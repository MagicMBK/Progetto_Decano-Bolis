// main.js
import { SnakeGame } from "./game.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("scoreVal");
const highScoreEl = document.getElementById("highScoreVal");
const msg = document.getElementById("msg");

const gioco = new SnakeGame();

let intervallo = null;
let inPausa = false;
let highScore = 0;
let bufferDirezione = [];

highScoreEl.innerText = highScore;

function disegnaCella(x, y, colore, raggio = 4) {
    const size = 20;
    const padding = 1;
    const cellSize = size - padding * 2;
    
    ctx.fillStyle = colore;
    ctx.beginPath();
    
    const px = x * size + padding;
    const py = y * size + padding;
    
    ctx.moveTo(px + raggio, py);
    ctx.lineTo(px + cellSize - raggio, py);
    ctx.quadraticCurveTo(px + cellSize, py, px + cellSize, py + raggio);
    ctx.lineTo(px + cellSize, py + cellSize - raggio);
    ctx.quadraticCurveTo(px + cellSize, py + cellSize, px + cellSize - raggio, py + cellSize);
    ctx.lineTo(px + raggio, py + cellSize);
    ctx.quadraticCurveTo(px, py + cellSize, px, py + cellSize - raggio);
    ctx.lineTo(px, py + raggio);
    ctx.quadraticCurveTo(px, py, px + raggio, py);
    ctx.closePath();
    
    ctx.fill();
}

function disegna() {
    ctx.clearRect(0, 0, 400, 400);

    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < gioco.dimensioneGriglia; i++) {
        ctx.beginPath(); ctx.moveTo(i * 20, 0); ctx.lineTo(i * 20, 400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * 20); ctx.lineTo(400, i * 20); ctx.stroke();
    }

    disegnaCella(gioco.cibo.x, gioco.cibo.y, "#ef4444", 8);
    
    const ciboX = gioco.cibo.x * 20 + 10;
    const ciboY = gioco.cibo.y * 20 + 10;
    const gradient = ctx.createRadialGradient(ciboX, ciboY, 2, ciboX, ciboY, 8);
    gradient.addColorStop(0, "rgba(255,255,255,0.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ciboX, ciboY, 8, 0, Math.PI * 2);
    ctx.fill();

    gioco.serpente.forEach((p, i) => {
        const isHead = i === 0;
        const color = isHead ? "#10b981" : `rgba(52, 211, 153, ${1 - (i / gioco.serpente.length) * 0.3})`;
        disegnaCella(p.x, p.y, color, isHead ? 6 : 3);

        if (isHead) {
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(p.x * 20 + 7, p.y * 20 + 7, 2.5, 0, Math.PI * 2);
            ctx.arc(p.x * 20 + 13, p.y * 20 + 7, 2.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#1a1a1a";
            ctx.beginPath();
            ctx.arc(p.x * 20 + 7, p.y * 20 + 7, 1.2, 0, Math.PI * 2);
            ctx.arc(p.x * 20 + 13, p.y * 20 + 7, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    scoreEl.innerText = gioco.punteggio;

    if (inPausa) {
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, 400, 400);
        ctx.fillStyle = "white";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSA", 200, 200);
    }
}

function avviaTimer() {
    if (intervallo) return;

    intervallo = setInterval(() => {
        if (inPausa) return;
        
        if (bufferDirezione.length > 0) {
            gioco.impostaDirezione(bufferDirezione.shift());
        }
        
        const esito = gioco.aggiorna();
        if (esito.morto) {
            clearInterval(intervallo);
            intervallo = null;
            bufferDirezione = [];
            if (gioco.punteggio > highScore) {
                highScore = gioco.punteggio;
                highScoreEl.innerText = highScore;
            }
            msg.innerText = "Game Over! Premi una freccia per ripartire";
        }

        disegna();
    }, gioco.velocita);
}

document.addEventListener("keydown", e => {
    if (e.key === " ") {
        e.preventDefault();
        if (gioco.inCorso) {
            inPausa = !inPausa;
            disegna();
        }
        return;
    }

    let nuovaDir = null;
    
    switch (e.key) {
        case "ArrowUp": 
        case "w":
        case "W":
            e.preventDefault(); 
            nuovaDir = { x: 0, y: -1 }; 
            break;
        case "ArrowDown":
        case "s":
        case "S":
            e.preventDefault(); 
            nuovaDir = { x: 0, y: 1 }; 
            break;
        case "ArrowLeft":
        case "a":
        case "A":
            e.preventDefault(); 
            nuovaDir = { x: -1, y: 0 }; 
            break;
        case "ArrowRight":
        case "d":
        case "D":
            e.preventDefault(); 
            nuovaDir = { x: 1, y: 0 }; 
            break;
    }

    if (nuovaDir) {
        if (!gioco.inCorso) {
            gioco.reset();
            bufferDirezione = [];
            msg.innerText = "";
            gioco.impostaDirezione(nuovaDir);
            avviaTimer();
        } else if (bufferDirezione.length < 2) {
            bufferDirezione.push(nuovaDir);
        }
    }
});

disegna();