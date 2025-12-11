/**
 * @fileoverview Modulo che gestisce la logica del gioco Snake.
 * @module game
 * @version 1.0.0
 */

/**
 * Classe principale che gestisce tutta la logica del gioco Snake.
 * @class
 */
export class SnakeGame {
    /**
     * Crea una nuova istanza del gioco Snake.
     * @constructor
     * @param {Object} [config={}] - Oggetto di configurazione opzionale
     * @param {number} [config.dimensioneGriglia=20] - Dimensione della griglia (NxN celle)
     * @param {number} [config.velocitaIniziale=150] - Velocità iniziale in ms tra gli aggiornamenti
     */
    constructor(config = {}) {
        this.dimensioneGriglia = config.dimensioneGriglia || 20;
        this.velocitaIniziale = config.velocitaIniziale || 150;
        this.reset();
    }

    /**
     * Reimposta completamente lo stato del gioco ai valori iniziali.
     * @returns {void}
     */
    reset() {
        const centro = Math.floor(this.dimensioneGriglia / 2);
        this.serpente = [{ x: centro, y: centro }];
        this.direzione = { x: 0, y: 0 };
        this.punteggio = 0;
        this.velocita = this.velocitaIniziale;
        this.inCorso = false;
        this.posizionaCibo();
    }

    /**
     * Imposta una nuova direzione di movimento per il serpente.
     * @param {Object} dir - La nuova direzione desiderata
     * @returns {void}
     */
    impostaDirezione(dir) {
        if (!dir) return;

        // Previene l'inversione a 180°
        if (this.direzione.x !== 0 && dir.x === -this.direzione.x) return;
        if (this.direzione.y !== 0 && dir.y === -this.direzione.y) return;

        this.direzione = dir;

        // Avvia il gioco alla prima direzione valida
        if (dir.x !== 0 || dir.y !== 0) this.inCorso = true;
    }

    /**
     * Genera una posizione casuale per il cibo.
     * @returns {Object} La nuova posizione del cibo
     */
    posizionaCibo() {
        let pos;
        do {
            pos = {
                x: Math.floor(Math.random() * this.dimensioneGriglia),
                y: Math.floor(Math.random() * this.dimensioneGriglia),
            };
        } while (this.serpente.some(s => s.x === pos.x && s.y === pos.y));

        this.cibo = pos;
        return pos;
    }

    /**
     * Aggiorna lo stato del gioco per un singolo frame.
     * @returns {Object} Oggetto che descrive l'esito dell'aggiornamento
     */
    aggiorna() {
        if (!this.inCorso) return { morto: false, mangiato: false };

        const testa = {
            x: this.serpente[0].x + this.direzione.x,
            y: this.serpente[0].y + this.direzione.y
        };

        // Controlla collisioni con i bordi e con il corpo
        const collisione =
            testa.x < 0 ||
            testa.x >= this.dimensioneGriglia ||
            testa.y < 0 ||
            testa.y >= this.dimensioneGriglia ||
            this.serpente.some(s => s.x === testa.x && s.y === testa.y);

        if (collisione) {
            this.inCorso = false;
            return { morto: true, mangiato: false };
        }

        this.serpente.unshift(testa);

        // Controlla se ha mangiato il cibo
        if (testa.x === this.cibo.x && testa.y === this.cibo.y) {
            this.punteggio++;
            this.posizionaCibo();
            return { morto: false, mangiato: true };
        }

        this.serpente.pop();
        return { morto: false, mangiato: false };
    }
}
