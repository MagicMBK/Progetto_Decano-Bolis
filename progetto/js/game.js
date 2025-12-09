/**
 * @fileoverview Modulo che gestisce la logica del gioco Snake.
 * Contiene la classe principale SnakeGame che gestisce lo stato del gioco,
 * il movimento del serpente, le collisioni e il punteggio.
 * 
 * @module game
 * @requires Nessuna dipendenza esterna
 * @author Il tuo nome
 * @version 1.0.0
 */

/**
 * @typedef {Object} Posizione
 * @property {number} x - Coordinata X nella griglia (0-based)
 * @property {number} y - Coordinata Y nella griglia (0-based)
 * @description Rappresenta una posizione in una griglia bidimensionale.
 */

/**
 * @typedef {Object} Direzione
 * @property {number} x - Componente orizzontale (-1, 0, o 1)
 * @property {number} y - Componente verticale (-1, 0, o 1)
 * @description Rappresenta una direzione di movimento.
 * Valori validi: {x:1,y:0} destra, {x:-1,y:0} sinistra, 
 * {x:0,y:1} giù, {x:0,y:-1} su, {x:0,y:0} fermo
 */

/**
 * @typedef {Object} ConfigurazioneGioco
 * @property {number} [dimensioneGriglia=20] - Numero di celle per lato della griglia quadrata
 * @property {number} [velocitaIniziale=150] - Intervallo in millisecondi tra un aggiornamento e l'altro
 * @description Oggetto di configurazione opzionale per personalizzare il gioco.
 */

/**
 * @typedef {Object} EsitoAggiornamento
 * @property {boolean} morto - Indica se il serpente è morto (collisione)
 * @property {boolean} mangiato - Indica se il serpente ha mangiato il cibo
 * @description Oggetto restituito dal metodo aggiorna() per comunicare gli eventi del frame.
 */

/**
 * Classe principale che gestisce tutta la logica del gioco Snake.
 * 
 * Responsabilità:
 * - Gestione dello stato del gioco (serpente, cibo, punteggio)
 * - Validazione e applicazione dei movimenti
 * - Rilevamento delle collisioni
 * - Generazione casuale del cibo
 * - Calcolo del punteggio
 * 
 * @class
 * @example
 * // Creare un gioco con configurazione predefinita
 * const gioco = new SnakeGame();
 * 
 * @example
 * // Creare un gioco con configurazione personalizzata
 * const gioco = new SnakeGame({
 *   dimensioneGriglia: 30,
 *   velocitaIniziale: 100
 * });
 * 
 * // Impostare direzione e aggiornare
 * gioco.impostaDirezione({ x: 1, y: 0 });
 * const risultato = gioco.aggiorna();
 * if (risultato.morto) {
 *   console.log("Game Over!");
 * }
 */
export class SnakeGame {
    /**
     * Crea una nuova istanza del gioco Snake.
     * 
     * @constructor
     * @param {ConfigurazioneGioco} [config={}] - Oggetto di configurazione opzionale
     * @param {number} [config.dimensioneGriglia=20] - Dimensione della griglia (NxN celle)
     * @param {number} [config.velocitaIniziale=150] - Velocità iniziale in ms tra gli aggiornamenti
     * 
     * @description
     * Il costruttore inizializza il gioco con i parametri forniti o con i valori predefiniti.
     * Chiama automaticamente il metodo reset() per impostare lo stato iniziale.
     */
    constructor(config = {}) {
        /**
         * Numero di celle per lato della griglia di gioco (griglia quadrata NxN).
         * @type {number}
         * @default 20
         */
        this.dimensioneGriglia = config.dimensioneGriglia || 20;

        /**
         * Intervallo iniziale in millisecondi tra un aggiornamento e l'altro.
         * Può essere modificato durante il gioco per aumentare la difficoltà.
         * @type {number}
         * @default 150
         */
        this.velocitaIniziale = config.velocitaIniziale || 150;

        this.reset();
    }

    /**
     * Reimposta completamente lo stato del gioco ai valori iniziali.
     * 
     * @method
     * @returns {void}
     * 
     * @description
     * Questo metodo:
     * - Posiziona il serpente al centro della griglia con lunghezza 1
     * - Imposta la direzione a {x:0, y:0} (fermo)
     * - Azzera il punteggio
     * - Ripristina la velocità iniziale
     * - Imposta inCorso a false (il gioco non è ancora iniziato)
     * - Genera una nuova posizione per il cibo
     * 
     * @example
     * // Resettare il gioco dopo un Game Over
     * if (risultato.morto) {
     *   gioco.reset();
     * }
     */
    reset() {
        const centro = Math.floor(this.dimensioneGriglia / 2);

        /**
         * Array che rappresenta il corpo del serpente.
         * Ogni elemento è un oggetto Posizione {x, y}.
         * L'elemento all'indice 0 è la testa, gli altri sono il corpo.
         * 
         * @type {Posizione[]}
         * @description La lunghezza dell'array determina la lunghezza del serpente.
         * Il serpente cresce quando mangia il cibo (non viene rimossa la coda).
         */
        this.serpente = [{ x: centro, y: centro }];

        /**
         * Direzione corrente di movimento del serpente.
         * 
         * @type {Direzione}
         * @default {x: 0, y: 0}
         * @description
         * - {x:0, y:0} = fermo (stato iniziale)
         * - {x:1, y:0} = destra
         * - {x:-1, y:0} = sinistra
         * - {x:0, y:1} = giù
         * - {x:0, y:-1} = su
         */
        this.direzione = { x: 0, y: 0 };

        /**
         * Punteggio attuale del giocatore.
         * Incrementa di 1 ogni volta che il serpente mangia il cibo.
         * 
         * @type {number}
         * @default 0
         */
        this.punteggio = 0;

        /**
         * Velocità corrente del gioco in millisecondi.
         * Può essere diminuita durante il gioco per aumentare la difficoltà.
         * 
         * @type {number}
         */
        this.velocita = this.velocitaIniziale;

        /**
         * Indica se il gioco è attualmente in corso.
         * Diventa true quando il giocatore fa la prima mossa.
         * Diventa false in caso di collisione (Game Over).
         * 
         * @type {boolean}
         * @default false
         */
        this.inCorso = false;

        this.posizionaCibo();
    }

    /**
     * Imposta una nuova direzione di movimento per il serpente.
     * 
     * @method
     * @param {Direzione} dir - La nuova direzione desiderata
     * @returns {void}
     * 
     * @description
     * Questa funzione implementa la logica di prevenzione dell'inversione a 180°:
     * il serpente non può invertire completamente la direzione in un solo frame
     * (es. se va a destra non può andare immediatamente a sinistra).
     * 
     * Il gioco viene avviato (inCorso = true) quando viene impostata la prima
     * direzione diversa da {x:0, y:0}.
     * 
     * @example
     * // Tentativo di movimento valido
     * gioco.direzione = { x: 1, y: 0 }; // destra
     * gioco.impostaDirezione({ x: 0, y: 1 }); // giù - OK
     * 
     * @example
     * // Tentativo di inversione (ignorato)
     * gioco.direzione = { x: 1, y: 0 }; // destra
     * gioco.impostaDirezione({ x: -1, y: 0 }); // sinistra - IGNORATO
     */
    impostaDirezione(dir) {
        if (!dir) return;

        // Previene l'inversione a 180° sull'asse X
        if (this.direzione.x !== 0 && dir.x === -this.direzione.x) return;
        
        // Previene l'inversione a 180° sull'asse Y
        if (this.direzione.y !== 0 && dir.y === -this.direzione.y) return;

        this.direzione = dir;

        // Avvia il gioco alla prima direzione valida
        if (dir.x !== 0 || dir.y !== 0) this.inCorso = true;
    }

    /**
     * Genera una posizione casuale per il cibo, garantendo che non si sovrapponga al serpente.
     * 
     * @method
     * @returns {Posizione} La nuova posizione del cibo
     * 
     * @description
     * Questa funzione usa un ciclo do-while per generare posizioni casuali finché
     * non ne trova una che non sia occupata dal corpo del serpente.
     * 
     * La posizione generata viene salvata nella proprietà this.cibo.
     * 
     * @example
     * // Generare una nuova posizione per il cibo
     * const nuovaPosizione = gioco.posizionaCibo();
     * console.log(`Cibo a x:${nuovaPosizione.x}, y:${nuovaPosizione.y}`);
     */
    posizionaCibo() {
        let pos;
        do {
            pos = {
                x: Math.floor(Math.random() * this.dimensioneGriglia),
                y: Math.floor(Math.random() * this.dimensioneGriglia),
            };
        } while (this.serpente.some(s => s.x === pos.x && s.y === pos.y));

        /**
         * Posizione corrente del cibo nella griglia.
         * 
         * @type {Posizione}
         * @description Viene aggiornata ogni volta che il serpente mangia il cibo.
         */
        this.cibo = pos;
        return pos;
    }

    /**
     * Aggiorna lo stato del gioco per un singolo frame: muove il serpente e controlla le collisioni.
     * 
     * @method
     * @returns {EsitoAggiornamento} Oggetto che descrive l'esito dell'aggiornamento
     * 
     * @description
     * Questa è la funzione principale del game loop. Esegue le seguenti operazioni:
     * 
     * 1. Se il gioco non è in corso, ritorna immediatamente senza fare nulla
     * 2. Calcola la nuova posizione della testa in base alla direzione corrente
     * 3. Controlla se c'è una collisione con:
     *    - I bordi della griglia
     *    - Il corpo del serpente stesso
     * 4. Se c'è collisione, ferma il gioco e ritorna {morto: true, mangiato: false}
     * 5. Aggiunge la nuova testa al serpente
     * 6. Controlla se la testa è sulla posizione del cibo:
     *    - Se sì: incrementa il punteggio, genera nuovo cibo, ritorna {morto: false, mangiato: true}
     *    - Se no: rimuove la coda (il serpente si muove ma non cresce), ritorna {morto: false, mangiato: false}
     * 
     * @example
     * // Esempio di utilizzo nel game loop
     * setInterval(() => {
     *   const esito = gioco.aggiorna();
     *   
     *   if (esito.morto) {
     *     console.log("Game Over!");
     *     // Fermare il timer, mostrare schermata Game Over
     *   }
     *   
     *   if (esito.mangiato) {
     *     console.log("Cibo mangiato! Punteggio:", gioco.punteggio);
     *     // Riprodurre suono, aumentare velocità, ecc.
     *   }
     *   
     *   ridisegnaGioco();
     * }, gioco.velocita);
     */
    aggiorna() {
        // Non aggiorna se il gioco non è iniziato
        if (!this.inCorso) return { morto: false, mangiato: false };

        // Calcola la nuova posizione della testa
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

        // Aggiunge la nuova testa
        this.serpente.unshift(testa);

        // Controlla se ha mangiato il cibo
        if (testa.x === this.cibo.x && testa.y === this.cibo.y) {
            this.punteggio++;
            this.posizionaCibo();
            return { morto: false, mangiato: true };
        }

        // Rimuove la coda (il serpente si muove senza crescere)
        this.serpente.pop();
        return { morto: false, mangiato: false };
    }
}