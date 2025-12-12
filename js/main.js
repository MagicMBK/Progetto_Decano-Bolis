/**
 * @fileoverview Modulo principale che gestisce il rendering, l'input e il game loop.
 * @module main
 * @version 1.0.0
 */

import { SnakeGame } from "./game.js";
import { SkinManager } from "./skin.js";
import { ThemeManager } from "./darkMode.js";

// ============================================================================
// RIFERIMENTI AGLI ELEMENTI DOM
// ============================================================================

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("scoreVal");
const highScoreEl = document.getElementById("highScoreVal");
const msg = document.getElementById("msg");
const skinCubes = document.querySelectorAll(".skinCube");

// ============================================================================
// STATO DEL GIOCO
// ============================================================================

const gioco = new SnakeGame();
const skinManager = new SkinManager(document.body);
const themeManager = new ThemeManager();

let intervallo = null;
let inPausa = false;
let highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
let bufferDirezione = [];

highScoreEl.innerText = highScore;

// ============================================================================
// COSTANTI DI RENDERING
// ============================================================================

const CELL_SIZE = 20;
const CELL_PADDING = 1;
const CANVAS_SIZE = 400;

// ============================================================================
// SKIN UI
// ============================================================================

function aggiornaStatoSkinUI() {
    const applyDisabled = gioco.inCorso;
    skinCubes.forEach(c => {
        c.disabled = applyDisabled;
        c.classList.toggle("selected", c.dataset.skin === skinManager.getCurrent());
    });
}
aggiornaStatoSkinUI();

skinCubes.forEach(c => {
    c.addEventListener("click", () => {
        const scelta = c.dataset.skin;
        const res = skinManager.applyIfAllowed(scelta, gioco.inCorso);
        if (!res.ok) {
            if (res.reason === "game_in_progress") {
                msg.innerText = "⚠️ Non puoi cambiare skin durante la partita!";
                setTimeout(() => { 
                    if (!gioco.inCorso) msg.innerText = "Premi una freccia per iniziare"; 
                }, 1500);
            }
            return;
        }
        aggiornaStatoSkinUI();
        disegna();
    });
});

// ============================================================================
// FUNZIONI DI RENDERING
// ============================================================================

function disegnaCella(x, y, colore, raggio = 4) {
    const size = CELL_SIZE;
    const padding = CELL_PADDING;
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
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Leggi colori dalla skin (variabili CSS)
    const bodyStyle = getComputedStyle(document.body);
    const colorHead = bodyStyle.getPropertyValue('--cell-head').trim() || "#10b981";
    const colorBodyBase = bodyStyle.getPropertyValue('--cell-body').trim() || "rgba(16,185,129,0.6)";
    const foodColor = bodyStyle.getPropertyValue('--food-color').trim() || "#ef4444";

    // Griglia
    const isDark = document.body.classList.contains('dark-mode');
    ctx.strokeStyle = isDark ? "#2a3a5a" : "#e2e8f0";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gioco.dimensioneGriglia; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
        ctx.stroke();
    }

    // Cibo
    disegnaCella(gioco.cibo.x, gioco.cibo.y, foodColor, 8);

    // Effetto luminoso sul cibo
    const ciboX = gioco.cibo.x * CELL_SIZE + CELL_SIZE / 2;
    const ciboY = gioco.cibo.y * CELL_SIZE + CELL_SIZE / 2;
    const gradient = ctx.createRadialGradient(ciboX, ciboY, 2, ciboX, ciboY, 10);
    gradient.addColorStop(0, "rgba(255,255,255,0.9)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ciboX, ciboY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Serpente
    gioco.serpente.forEach((p, i) => {
        const isHead = i === 0;
        const color = isHead ? colorHead : colorBodyBase;
        disegnaCella(p.x, p.y, color, isHead ? 6 : 3);

        if (isHead) {
            // Occhi
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(p.x * CELL_SIZE + 7, p.y * CELL_SIZE + 8, 3, 0, Math.PI * 2);
            ctx.arc(p.x * CELL_SIZE + 13, p.y * CELL_SIZE + 8, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = "#1a1a1a";
            ctx.beginPath();
            ctx.arc(p.x * CELL_SIZE + 7, p.y * CELL_SIZE + 8, 1.5, 0, Math.PI * 2);
            ctx.arc(p.x * CELL_SIZE + 13, p.y * CELL_SIZE + 8, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    scoreEl.innerText = gioco.punteggio;

    // Overlay pausa
    if (inPausa) {
        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        ctx.fillStyle = "white";
        ctx.font = "bold 32px 'Press Start 2P', Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSA", CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }
}

// ============================================================================
// GAME LOOP
// ============================================================================

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
                localStorage.setItem('snakeHighScore', highScore);
            }

            msg.innerText = "💀 Game Over! Premi una freccia per ripartire";
            aggiornaStatoSkinUI();
        }

        disegna();
    }, gioco.velocita);
}

// ============================================================================
// GESTIONE INPUT
// ============================================================================

document.addEventListener("keydown", e => {
    if (e.key === " ") {
        e.preventDefault();
        if (gioco.inCorso) {
            inPausa = !inPausa;
            msg.innerText = inPausa ? "⏸️ In pausa - Premi SPAZIO per continuare" : "";
            disegna();
        }
        return;
    }

    let nuovaDir = null;

    switch (e.key) {
        case "ArrowUp": case "w": case "W":
            nuovaDir = { x: 0, y: -1 };
            break;
        case "ArrowDown": case "s": case "S":
            nuovaDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft": case "a": case "A":
            nuovaDir = { x: -1, y: 0 };
            break;
        case "ArrowRight": case "d": case "D":
            nuovaDir = { x: 1, y: 0 };
            break;
    }

    if (nuovaDir) {
        e.preventDefault();
        
        if (!gioco.inCorso) {
            gioco.reset();
            bufferDirezione = [nuovaDir];
            msg.innerText = "";
            inPausa = false;
            avviaTimer();
            aggiornaStatoSkinUI();
        } else if (bufferDirezione.length < 2) {
            bufferDirezione.push(nuovaDir);
        }
    }
});

// ============================================================================
// INIZIALIZZAZIONE
// ============================================================================

disegna();
