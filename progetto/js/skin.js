/**
 * @fileoverview Modulo per la gestione delle skin (temi colore) del serpente.
 * Permette agli utenti di personalizzare l'aspetto del serpente scegliendo
 * tra diverse combinazioni di colori. Include persistenza delle preferenze
 * in localStorage e validazione degli stati di gioco.
 * 
 * @module skin
 * @author Il tuo nome
 * @version 1.0.0
 * @since 2024-12-12
 * 
 * @requires localStorage - Browser Web Storage API per la persistenza
 */

/**
 * Array contenente tutte le skin disponibili.
 * Ogni skin corrisponde a una classe CSS body-skin-{nome}.
 * 
 * @constant {string[]}
 * @default
 */
export const SKINS = ["red", "blue", "green"];

/**
 * Chiave utilizzata per salvare la skin corrente in localStorage.
 * Il suffisso _v1 permette future migrazioni di formato dati.
 * 
 * @constant {string}
 * @private
 */
const SKIN_KEY = "snakeSkin_v1";

/**
 * Risultato di un tentativo di applicazione skin
 * @typedef {Object} SkinApplicationResult
 * @property {boolean} ok - True se la skin è stata applicata con successo
 * @property {string} [reason] - Motivo del fallimento se ok=false
 */

/**
 * Classe che gestisce il sistema di skin del serpente.
 * Responsabile di applicare classi CSS al body, salvare preferenze
 * e gestire la logica di validazione durante il gioco.
 * 
 * @class
 * @classdesc Gestisce tutte le operazioni relative alle skin del gioco
 * 
 * @example
 * // Inizializzazione base
 * const skinManager = new SkinManager();
 * 
 * @example
 * // Inizializzazione con elemento root custom
 * const container = document.querySelector('.game-container');
 * const skinManager = new SkinManager(container);
 */
export class SkinManager {
    /**
     * Crea una nuova istanza del gestore delle skin
     * 
     * @constructor
     * @param {HTMLElement} [root=document.body] - Elemento DOM su cui applicare le classi skin
     * 
     * @property {HTMLElement} root - Elemento DOM target per le classi CSS
     * @property {string} current - Nome della skin attualmente attiva
     * 
     * @example
     * const manager = new SkinManager(); // Usa document.body
     * console.log(manager.current); // "green" (default)
     */
    constructor(root = document.body) {
        /**
         * Elemento DOM su cui vengono applicate le classi CSS delle skin
         * @type {HTMLElement}
         * @private
         */
        this.root = root;
        
        /**
         * Nome della skin correntemente attiva.
         * Viene caricato da localStorage o impostato al default "green".
         * @type {string}
         * @public
         */
        this.current = localStorage.getItem(SKIN_KEY) || "green";
        
        // Applica immediatamente la skin salvata
        this.apply(this.current);
        
        console.log("[SkinManager] inizializzato con skin:", this.current);
    }

    /**
     * Applica una skin rimuovendo tutte le classi skin precedenti
     * e aggiungendo quella nuova. Salva la preferenza in localStorage.
     * 
     * La skin viene applicata tramite classe CSS: body-skin-{nome}
     * che attiva le CSS custom properties definite in styles-skin.css
     * 
     * @method
     * @param {string} skin - Nome della skin da applicare ("red", "blue", "green")
     * @returns {boolean} True se la skin è stata applicata, false se invalida
     * 
     * @example
     * skinManager.apply("red"); // Applica skin rossa
     * 
     * @example
     * if (skinManager.apply("invalid")) {
     *   console.log("Skin valida");
     * } else {
     *   console.log("Skin non esistente");
     * }
     */
    apply(skin) {
        // Validazione: controlla se la skin esiste
        if (!SKINS.includes(skin)) return false;
        
        // Rimuovi tutte le classi skin esistenti dal root
        SKINS.forEach(s => this.root.classList.remove(`body-skin-${s}`));
        
        // Aggiungi la nuova classe skin
        this.root.classList.add(`body-skin-${skin}`);
        
        // Aggiorna lo stato interno
        this.current = skin;
        
        // Salva in localStorage (con gestione errori)
        try { 
            localStorage.setItem(SKIN_KEY, skin); 
        } catch(e) {
            // Possibili errori:
            // - Quota exceeded (storage pieno)
            // - Private browsing mode (Safari/Firefox)
            // - localStorage disabilitato
            console.warn("[SkinManager] Impossibile salvare in localStorage:", e);
        }
        
        console.log("[SkinManager] skin applicata:", skin);
        return true;
    }

    /**
     * Tenta di applicare una skin solo se le condizioni lo permettono.
     * Previene il cambio skin durante una partita in corso per evitare
     * comportamenti imprevisti o distrazioni per il giocatore.
     * 
     * @method
     * @param {string} skin - Nome della skin da applicare
     * @param {boolean} gameInProgress - Flag che indica se il gioco è attivo
     * @returns {SkinApplicationResult} Oggetto con esito e motivo eventuale
     * 
     * @example
     * // Durante il gioco
     * const result = skinManager.applyIfAllowed("blue", true);
     * if (!result.ok) {
     *   console.log("Impossibile cambiare:", result.reason); 
     *   // "game_in_progress"
     * }
     * 
     * @example
     * // A gioco fermo
     * const result = skinManager.applyIfAllowed("blue", false);
     * if (result.ok) {
     *   console.log("Skin cambiata con successo!");
     * }
     */
    applyIfAllowed(skin, gameInProgress) {
        // Blocca il cambio skin se il gioco è in corso
        if (gameInProgress) {
            return { 
                ok: false, 
                reason: "game_in_progress" 
            };
        }
        
        // Tenta di applicare la skin
        const ok = this.apply(skin);
        
        return { 
            ok, 
            reason: ok ? undefined : "invalid_skin" 
        };
    }

    /**
     * Restituisce il nome della skin attualmente attiva.
     * Utile per sincronizzare l'UI (es. evidenziare il pulsante attivo).
     * 
     * @method
     * @returns {string} Nome della skin corrente ("red", "blue", "green")
     * 
     * @example
     * const currentSkin = skinManager.getCurrent();
     * document.querySelector(`[data-skin="${currentSkin}"]`)
     *   .classList.add('active');
     */
    getCurrent() { 
        return this.current; 
    }
}