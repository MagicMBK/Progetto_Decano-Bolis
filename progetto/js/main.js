/**
 * @fileoverview Modulo principale che gestisce il rendering, l'input dell'utente e il game loop.
 * 
 * Questo file coordina l'interazione tra la logica di gioco (SnakeGame) e l'interfaccia utente.
 * Si occupa di:
 * - Disegnare il gioco sul canvas HTML
 * - Gestire l'input da tastiera
 * - Gestire il timer del game loop
 * - Gestire la pausa
 * - Salvare e mostrare l'high score
 * 
 * @module main
 * @requires ./game.js
 * @author Il tuo nome
 * @version 1.0.0
 */

import { SnakeGame } from "./game.js";

// ============================================================================
// RIFERIMENTI AGLI ELEMENTI DOM
// ============================================================================

/**
 * Riferimento all'elemento canvas HTML dove viene disegnato il gioco.
 * @type {HTMLCanvasElement}
 * @const
 */
const canvas = document.getElementById("gameCanvas");

/**
 * Contesto 2D del canvas, usato per tutte le operazioni di disegno.
 * @type {CanvasRenderingContext2D}
 * @const
 */
const ctx = canvas.getContext("2d");

/**
 * Elemento DOM che mostra il punteggio corrente.
 * @type {HTMLElement|null}
 * @const
 */
const scoreEl = document.getElementById("scoreVal");

/**
 * Elemento DOM che mostra il record personale (high score).
 * @type {HTMLElement|null}
 * @const
 */
const highScoreEl = document.getElementById("highScoreVal");

/**
 * Elemento DOM che mostra messaggi di stato all'utente.
 * @type {HTMLElement}
 * @const
 */
const msg = document.getElementById("msg");

// ============================================================================
// STATO DEL GIOCO
// ============================================================================

/**
 * Istanza principale del gioco Snake.
 * Gestisce tutta la logica di gioco.
 * @type {SnakeGame}
 * @const
 */
const gioco = new SnakeGame();

/**
 * ID dell'intervallo del game loop.
 * Usato per fermare e riavviare il timer.
 * @type {number|null}
 */
let intervallo = null;

/**
 * Indica se il gioco è attualmente in pausa.
 * @type {boolean}
 * @default false
 */
let inPausa = false;

/**
 * Punteggio più alto raggiunto dall'utente nella sessione corrente.
 * Viene aggiornato ogni volta che l'utente supera il record precedente.
 * @type {number}
 * @default 0
 */
let highScore = 0;

/**
 * Buffer che memorizza le direzioni impostate dall'utente.
 * Serve a gestire input multipli rapidi tra un frame e l'altro.
 * 
 * @type {Array<{x: number, y: number}>}
 * @description
 * Limita l'inserimento a massimo 2 direzioni per evitare
 * che il serpente possa invertire direzione troppo velocemente.
 * 
 * Il buffer viene svuotato:
 * - Una direzione per frame durante il game loop
 * - Completamente al Game Over
 */
let bufferDirezione = [];

// Inizializza il display dell'high score
highScoreEl && (highScoreEl.innerText = highScore);

// ============================================================================
// COSTANTI DI RENDERING
// ============================================================================

/**
 * Dimensione in pixel di ogni cella della griglia.
 * @type {number}
 * @const
 * @default 20
 */
const CELL_SIZE = 20;

/**
 * Padding in pixel tra il bordo della cella e il suo contenuto.
 * @type {number}
 * @const
 * @default 1
 */
const CELL_PADDING = 1;

/**
 * Dimensioni del canvas in pixel.
 * @type {number}
 * @const
 * @default 400
 */
const CANVAS_SIZE = 400;

// ============================================================================
// FUNZIONI DI RENDERING
// ============================================================================

/**
 * Disegna una singola cella del gioco con angoli arrotondati.
 * 
 * @function
 * @param {number} x - Coordinata X nella griglia (0-based)
 * @param {number} y - Coordinata Y nella griglia (0-based)
 * @param {string} colore - Colore di riempimento (formato CSS: "#rrggbb" o "rgba(r,g,b,a)")
 * @param {number} [raggio=4] - Raggio degli angoli arrotondati in pixel
 * @returns {void}
 * 
 * @description
 * Questa funzione disegna una cella utilizzando quadraticCurveTo per creare
 * angoli arrotondati. Il path viene costruito in senso orario partendo dall'angolo
 * superiore sinistro.
 * 
 * Le dimensioni effettive della cella tengono conto del padding per creare
 * uno spazio visivo tra le celle adiacenti.
 * 
 * @example
 * // Disegna una cella verde con angoli molto arrotondati
 * disegnaCella(5, 10, "#10b981", 8);
 * 
 * @example
 * // Disegna una cella rossa con angoli leggermente arrotondati
 * disegnaCella(3, 7, "#ef4444", 2);
 */
function disegnaCella(x, y, colore, raggio = 4) {
    const size = CELL_SIZE;
    const padding = CELL_PADDING;
    const cellSize = size - padding * 2;

    ctx.fillStyle = colore;
    ctx.beginPath();

    const px = x * size + padding;
    const py = y * size + padding;

    // Costruisce il path con angoli arrotondati (senso orario)
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

/**
 * Renderizza l'intero frame di gioco sul canvas.
 * 
 * @function
 * @returns {void}
 * 
 * @description
 * Questa funzione è responsabile del rendering completo del gioco.
 * Esegue le seguenti operazioni in ordine:
 * 
 * 1. Pulisce il canvas
 * 2. Disegna la griglia di riferimento (linee grigie sottili)
 * 3. Disegna il cibo con un effetto luminoso radiale
 * 4. Disegna il serpente:
 *    - La testa in verde brillante con occhi
 *    - Il corpo con gradient di trasparenza crescente verso la coda
 * 5. Aggiorna il punteggio nel DOM
 * 6. Se il gioco è in pausa, mostra l'overlay scuro con scritta "PAUSA"
 * 
 * Questa funzione si occupa SOLO del rendering, non modifica lo stato del gioco.
 * 
 * @example
 * // Chiamare manualmente la funzione di disegno
 * disegna();
 * 
 * @example
 * // Tipicamente chiamata nel game loop
 * setInterval(() => {
 *   gioco.aggiorna();
 *   disegna();
 * }, 150);
 */
function disegna() {
    // Pulisce il canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // ========================================================================
    // GRIGLIA DI RIFERIMENTO
    // ========================================================================
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 0.5;
    for (let i = 0; i < gioco.dimensioneGriglia; i++) {
        // Linee verticali
        ctx.beginPath();
        ctx.moveTo(i * CELL_SIZE, 0);
        ctx.lineTo(i * CELL_SIZE, CANVAS_SIZE);
        ctx.stroke();
        
        // Linee orizzontali
        ctx.beginPath();
        ctx.moveTo(0, i * CELL_SIZE);
        ctx.lineTo(CANVAS_SIZE, i * CELL_SIZE);
        ctx.stroke();
    }

    // ========================================================================
    // CIBO
    // ========================================================================
    disegnaCella(gioco.cibo.x, gioco.cibo.y, "#ef4444", 8);

    // Effetto luminoso radiale sul cibo (decorativo)
    const ciboX = gioco.cibo.x * CELL_SIZE + CELL_SIZE / 2;
    const ciboY = gioco.cibo.y * CELL_SIZE + CELL_SIZE / 2;
    const gradient = ctx.createRadialGradient(ciboX, ciboY, 2, ciboX, ciboY, 8);
    gradient.addColorStop(0, "rgba(255,255,255,0.8)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ciboX, ciboY, 8, 0, Math.PI * 2);
    ctx.fill();

    // ========================================================================
    // SERPENTE
    // ========================================================================
    gioco.serpente.forEach((p, i) => {
        const isHead = i === 0;
        
        // Colore: testa verde brillante, corpo con fade graduale
        const color = isHead
            ? "#10b981"
            : `rgba(52, 211, 153, ${1 - (i / gioco.serpente.length) * 0.3})`;

        disegnaCella(p.x, p.y, color, isHead ? 6 : 3);

        // Disegna gli occhi sulla testa
        if (isHead) {
            // Sclera (parte bianca)
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(p.x * CELL_SIZE + 7, p.y * CELL_SIZE + 7, 2.5, 0, Math.PI * 2);
            ctx.arc(p.x * CELL_SIZE + 13, p.y * CELL_SIZE + 7, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Pupille
            ctx.fillStyle = "#1a1a1a";
            ctx.beginPath();
            ctx.arc(p.x * CELL_SIZE + 7, p.y * CELL_SIZE + 7, 1.2, 0, Math.PI * 2);
            ctx.arc(p.x * CELL_SIZE + 13, p.y * CELL_SIZE + 7, 1.2, 0, Math.PI * 2);
            ctx.fill();
        }
    });

    // ========================================================================
    // UI - PUNTEGGIO
    // ========================================================================
    scoreEl && (scoreEl.innerText = gioco.punteggio);

    // ========================================================================
    // OVERLAY DI PAUSA
    // ========================================================================
    if (inPausa) {
        // Overlay scuro semitrasparente
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        
        // Scritta "PAUSA"
        ctx.fillStyle = "white";
        ctx.font = "bold 32px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PAUSA", CANVAS_SIZE / 2, CANVAS_SIZE / 2);
    }
}

// ============================================================================
// GAME LOOP
// ============================================================================

/**
 * Avvia il ciclo di aggiornamento del gioco (game loop).
 * 
 * @function
 * @returns {void}
 * 
 * @description
 * Questa funzione crea un intervallo che aggiorna il gioco a una frequenza
 * determinata da `gioco.velocita`. Ogni frame:
 * 
 * 1. Controlla se il gioco è in pausa (se sì, salta l'aggiornamento)
 * 2. Processa la prossima direzione dal buffer (se disponibile)
 * 3. Chiama `gioco.aggiorna()` per far avanzare la logica
 * 4. Se il serpente muore:
 *    - Ferma l'intervallo
 *    - Svuota il buffer delle direzioni
 *    - Aggiorna l'high score se necessario
 *    - Mostra il messaggio di Game Over
 * 5. Ridisegna il frame
 * 
 * La funzione previene automaticamente la creazione di intervalli duplicati
 * controllando se `intervallo` è già attivo.
 * 
 * @example
 * // Avvio manuale del timer (normalmente fatto automaticamente dal primo input)
 * avviaTimer();
 */
function avviaTimer() {
    // Previene doppi avvii
    if (intervallo) return;

    intervallo = setInterval(() => {
        // Salta l'aggiornamento se in pausa
        if (inPausa) return;

        // Processa la prossima direzione dal buffer
        if (bufferDirezione.length > 0) {
            gioco.impostaDirezione(bufferDirezione.shift());
        }

        // Aggiorna la logica di gioco
        const esito = gioco.aggiorna();

        // Gestione Game Over
        if (esito.morto) {
            clearInterval(intervallo);
            intervallo = null;
            bufferDirezione = [];

            // Aggiorna high score se necessario
            if (gioco.punteggio > highScore) {
                highScore = gioco.punteggio;
                highScoreEl && (highScoreEl.innerText = highScore);
            }

            msg.innerText = "Game Over! Premi una freccia per ripartire";
        }

        // Rendering del frame
        disegna();
    }, gioco.velocita);
}

// ============================================================================
// GESTIONE INPUT
// ============================================================================

/**
 * Mappa dei tasti supportati per il controllo del serpente.
 * 
 * @constant
 * @type {Object<string, {x: number, y: number}>}
 * @description
 * Supporta sia le frecce direzionali che i tasti WASD (maiuscoli e minuscoli).
 * 
 * Mappatura:
 * - ArrowUp, W, w → su
 * - ArrowDown, S, s → giù
 * - ArrowLeft, A, a → sinistra
 * - ArrowRight, D, d → destra
 */
const KEY_MAP = {
    "ArrowUp": { x: 0, y: -1 },
    "w": { x: 0, y: -1 },
    "W": { x: 0, y: -1 },
    "ArrowDown": { x: 0, y: 1 },
    "s": { x: 0, y: 1 },
    "S": { x: 0, y: 1 },
    "ArrowLeft": { x: -1, y: 0 },
    "a": { x: -1, y: 0 },
    "A": { x: -1, y: 0 },
    "ArrowRight": { x: 1, y: 0 },
    "d": { x: 1, y: 0 },
    "D": { x: 1, y: 0 }
};

/**
 * Event listener per la gestione dell'input da tastiera.
 * 
 * @function
 * @param {KeyboardEvent} e - Evento tastiera
 * @returns {void}
 * 
 * @description
 * Gestisce due tipi di input:
 * 
 * 1. **Barra spaziatrice** - Mette in pausa/riprende il gioco (solo se già avviato)
 * 2. **Tasti direzionali** - Controlla il movimento del serpente
 * 
 * ### Comportamento con tasti direzionali:
 * 
 * - **Se il gioco NON è avviato:**
 *   - Resetta il gioco
 *   - Inizializza il buffer con la direzione premuta
 *   - Avvia il timer
 *   - Nasconde il messaggio
 * 
 * - **Se il gioco è GIÀ avviato:**
 *   - Aggiunge la direzione al buffer (max 2 direzioni)
 *   - Il buffer previene input troppo rapidi che potrebbero causare inversioni
 * 
 * @example
 * // L'event listener è registrato automaticamente
 * // L'utente preme la freccia destra per iniziare
 * // Poi preme freccia su mentre il serpente si muove
 * // La seconda direzione viene messa in buffer e applicata nel prossimo frame
 */
document.addEventListener("keydown", e => {
    // ========================================================================
    // GESTIONE PAUSA (Barra Spaziatrice)
    // ========================================================================
    if (e.key === " ") {
        e.preventDefault(); // Previene lo scroll della pagina
        
        // Pausa/riprendi solo se il gioco è già avviato
        if (gioco.inCorso) {
            inPausa = !inPausa;
            disegna(); // Ridisegna per mostrare/nascondere l'overlay di pausa
        }
        return;
    }

    // ========================================================================
    // GESTIONE MOVIMENTO
    // ========================================================================
    let nuovaDir = null;

    // Determina la direzione dal tasto premuto usando lo switch
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

    // Se è stato premuto un tasto valido
    if (nuovaDir) {
        if (!gioco.inCorso) {
            // ================================================================
            // AVVIO DEL GIOCO
            // ================================================================
            gioco.reset();
            bufferDirezione = [nuovaDir]; // Prima direzione nel buffer
            msg.innerText = ""; // Nasconde il messaggio "premi una freccia"
            inPausa = false;
            avviaTimer();
        } else if (bufferDirezione.length < 2) {
            // ================================================================
            // GIOCO IN CORSO - Aggiungi al buffer (max 2 direzioni)
            // ================================================================
            bufferDirezione.push(nuovaDir);
        }
    }
});

// ============================================================================
// INIZIALIZZAZIONE
// ============================================================================

/**
 * Esegue il primo rendering del gioco (stato iniziale, serpente fermo).
 * Questo permette all'utente di vedere la griglia e il serpente prima di iniziare.
 */
disegna();