/**
 * @fileoverview Modulo per gestire le skin del serpente
 * @module skin
 * @version 1.0.0
 */

export const SKINS = ["red", "blue", "green"];
const SKIN_KEY = "snakeSkin_v1";

/**
 * Classe che gestisce le skin del gioco
 * @class
 */
export class SkinManager {
    /**
     * Crea una nuova istanza del SkinManager
     * @constructor
     * @param {HTMLElement} root - Elemento root a cui applicare le classi skin
     */
    constructor(root = document.body) {
        this.root = root;
        this.current = localStorage.getItem(SKIN_KEY) || "green";
        this.apply(this.current);
        console.log("[SkinManager] inizializzato con skin:", this.current);
    }

    /**
     * Applica una skin
     * @param {string} skin - Nome della skin da applicare
     * @returns {boolean} true se applicata con successo
     */
    apply(skin) {
        if (!SKINS.includes(skin)) return false;
        
        // Rimuovi tutte le classi skin esistenti
        SKINS.forEach(s => this.root.classList.remove(`body-skin-${s}`));
        
        // Aggiungi la nuova classe skin
        this.root.classList.add(`body-skin-${skin}`);
        this.current = skin;
        
        try { 
            localStorage.setItem(SKIN_KEY, skin); 
        } catch(e) {
            console.warn("[SkinManager] Impossibile salvare in localStorage");
        }
        
        console.log("[SkinManager] skin applicata:", skin);
        return true;
    }

    /**
     * Applica una skin solo se il gioco non è in corso
     * @param {string} skin - Nome della skin da applicare
     * @param {boolean} gameInProgress - Se il gioco è in corso
     * @returns {Object} Risultato dell'operazione
     */
    applyIfAllowed(skin, gameInProgress) {
        if (gameInProgress) {
            return { ok: false, reason: "game_in_progress" };
        }
        const ok = this.apply(skin);
        return { ok, reason: ok ? undefined : "invalid_skin" };
    }

    /**
     * Restituisce la skin corrente
     * @returns {string} Nome della skin corrente
     */
    getCurrent() { 
        return this.current; 
    }
}
