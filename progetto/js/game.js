// game.js

/**
 * Gestisce la logica del gioco Snake (stato, movimento, collisioni)
 */
export class SnakeGame {
    /**
     * @param {Object} config - Configurazione opzionale
     * @param {number} [config.dimensioneGriglia=20] - Lato della griglia
     * @param {number} [config.velocitaIniziale=150] - Delay tra gli update (ms)
     */
    constructor(config = {}) {
        this.dimensioneGriglia = config.dimensioneGriglia || 20;
        this.velocitaIniziale = config.velocitaIniziale || 150;
        this.reset();
    }

    /** Reimposta lo stato del gioco */
    reset() {
        const centro = Math.floor(this.dimensioneGriglia / 2);

        /** Corpo del serpente (testa = indice 0) */
        this.serpente = [{ x: centro, y: centro }];

        /** Direzione attuale di movimento */
        this.direzione = { x: 0, y: 0 };

        this.punteggio = 0;
        this.velocita = this.velocitaIniziale;
        this.inCorso = false;

        this.posizionaCibo();
    }

    /**
     * Imposta una nuova direzione se non è l'opposto di quella attuale.
     * @param {{x: number, y: number}} dir - Direzione richiesta
     */
    impostaDirezione(dir) {
        if (!dir) return;

        // Impedisce di invertire la direzione
        if (this.direzione.x !== 0 && dir.x === -this.direzione.x) return;
        if (this.direzione.y !== 0 && dir.y === -this.direzione.y) return;

        this.direzione = dir;

        // Avvia il gioco al primo movimento
        if (dir.x !== 0 || dir.y !== 0) this.inCorso = true;
    }

    /**
     * Genera una posizione casuale per il cibo, evitando il serpente.
     * @returns {{x: number, y: number}} posizione del cibo
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
     * Aggiorna lo stato del gioco: muove il serpente, controlla collisioni.
     * @returns {{morto: boolean, mangiato: boolean}}
     */
    aggiorna() {
        if (!this.inCorso) return { morto: false, mangiato: false };

        const testa = {
            x: this.serpente[0].x + this.direzione.x,
            y: this.serpente[0].y + this.direzione.y
        };

        // Collisione con muri o corpo
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

        // Avanza
        this.serpente.unshift(testa);

        // Controlla se ha mangiato
        if (testa.x === this.cibo.x && testa.y === this.cibo.y) {
            this.punteggio++;
            this.posizionaCibo();
            return { morto: false, mangiato: true };
        }

        // Muove eliminando la coda
        this.serpente.pop();
        return { morto: false, mangiato: false };
    }
}
