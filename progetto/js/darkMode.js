/**
 * @fileoverview Modulo per gestire la modalità dark theme del gioco Snake.
 * Gestisce il toggle tra light e dark mode con persistenza in localStorage,
 * creazione dinamica del pulsante UI e applicazione delle classi CSS.
 * 
 * @module darkMode
 * @author Il tuo nome
 * @version 1.0.0
 * @since 2024-12-12
 * 
 * @requires localStorage - Browser Web Storage API per la persistenza
 * @requires styles-dark.css - Stylesheet con le regole per .dark-mode
 */

/**
 * Chiave usata per salvare la preferenza del tema nel localStorage.
 * Identifica univocamente la preferenza di questo gioco.
 * 
 * @constant {string}
 * @private
 * @default "snakeGameTheme"
 */
const STORAGE_KEY = 'snakeGameTheme';

/**
 * Classe che gestisce il tema (light/dark) dell'applicazione.
 * Responsabile di caricare/salvare preferenze, gestire il pulsante toggle,
 * e applicare le classi CSS corrette al documento.
 * 
 * @class
 * @classdesc Gestore completo del sistema di temi light/dark
 * 
 * @example
 * // Inizializzazione automatica all'avvio del gioco
 * const themeManager = new ThemeManager();
 * // Carica automaticamente la preferenza salvata e crea il pulsante
 * 
 * @example
 * // Toggle programmatico del tema
 * const themeManager = new ThemeManager();
 * themeManager.toggle(); // Passa da light a dark (o viceversa)
 * console.log(themeManager.getCurrentTheme()); // "dark" o "light"
 */
export class ThemeManager {
    /**
     * Crea una nuova istanza del ThemeManager.
     * All'istanziazione carica automaticamente la preferenza salvata,
     * crea il pulsante toggle nel DOM, e applica il tema corrente.
     * 
     * @constructor
     * 
     * @property {boolean} isDark - Indica se il tema dark è attualmente attivo
     * @property {HTMLButtonElement|null} toggleButton - Riferimento al pulsante toggle
     * 
     * @example
     * const manager = new ThemeManager();
     * // Il tema viene caricato automaticamente da localStorage
     * // Il pulsante viene creato e aggiunto al body
     */
    constructor() {
        /**
         * Flag che indica se il tema dark è attualmente attivo.
         * True = dark mode, False = light mode.
         * 
         * @type {boolean}
         * @private
         */
        this.isDark = false;
        
        /**
         * Riferimento al pulsante HTML di toggle.
         * Viene creato dinamicamente in createToggleButton().
         * 
         * @type {HTMLButtonElement|null}
         * @private
         */
        this.toggleButton = null;
        
        // Esegue l'inizializzazione completa
        this.init();
    }

    /**
     * Inizializza il theme manager eseguendo tutte le operazioni di setup.
     * Chiamato automaticamente dal constructor.
     * 
     * Sequenza di inizializzazione:
     * 1. Carica tema salvato da localStorage
     * 2. Crea pulsante toggle nel DOM
     * 3. Applica il tema caricato
     * 
     * @method
     * @private
     * @returns {void}
     */
    init() {
        this.loadTheme();
        this.createToggleButton();
        this.applyTheme();
    }

    /**
     * Carica la preferenza del tema dal localStorage.
     * Se non esiste una preferenza salvata, usa il default (light mode).
     * 
     * @method
     * @private
     * @returns {void}
     * 
     * @example
     * // Chiamato automaticamente da init()
     * this.loadTheme();
     * // this.isDark sarà true se localStorage contiene "dark"
     */
    loadTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);
        // Imposta isDark a true solo se è esplicitamente salvato "dark"
        this.isDark = saved === 'dark';
    }

    /**
     * Salva la preferenza del tema corrente nel localStorage.
     * Permette di mantenere la scelta dell'utente tra sessioni browser.
     * 
     * @method
     * @private
     * @returns {void}
     * 
     * @throws {Error} Se localStorage non è disponibile o quota ecceduta
     * 
     * @example
     * // Chiamato automaticamente da toggle()
     * this.saveTheme(); 
     * // Salva "dark" o "light" in localStorage
     */
    saveTheme() {
        localStorage.setItem(STORAGE_KEY, this.isDark ? 'dark' : 'light');
    }

    /**
     * Crea il pulsante di toggle e lo aggiunge al DOM.
     * Il pulsante viene posizionato fixed in alto a destra.
     * 
     * Caratteristiche del pulsante:
     * - Classe CSS: "theme-toggle"
     * - Posizione: fixed top-right (20px, 20px)
     * - Icona: 🌙 per light mode, ☀️ per dark mode
     * - Accessibile: aria-label per screen readers
     * - Evento click: chiama this.toggle()
     * 
     * @method
     * @private
     * @returns {void}
     * 
     * @example
     * // Chiamato automaticamente da init()
     * this.createToggleButton();
     * // Crea: <button class="theme-toggle" aria-label="Toggle dark mode">🌙</button>
     */
    createToggleButton() {
        // Crea elemento button
        this.toggleButton = document.createElement('button');
        
        // Applica classe CSS per lo styling
        this.toggleButton.className = 'theme-toggle';
        
        // Accessibilità: descrizione per screen readers
        this.toggleButton.setAttribute('aria-label', 'Toggle dark mode');
        
        // Imposta icona iniziale basata sul tema corrente
        this.toggleButton.innerHTML = this.isDark ? '☀️' : '🌙';
        
        // Aggiungi event listener per il click
        this.toggleButton.addEventListener('click', () => this.toggle());
        
        // Aggiungi il pulsante al DOM (body)
        document.body.appendChild(this.toggleButton);
    }

    /**
     * Applica il tema corrente al documento.
     * Aggiunge o rimuove la classe 'dark-mode' dal body
     * e aggiorna l'icona del pulsante toggle.
     * 
     * La classe 'dark-mode' attiva tutte le regole CSS definite
     * in styles-dark.css per la modalità scura.
     * 
     * @method
     * @private
     * @returns {void}
     * 
     * @example
     * // Chiamato automaticamente da init() e toggle()
     * this.applyTheme();
     * // Se isDark=true: body.classList contiene 'dark-mode'
     * // Se isDark=false: body.classList NON contiene 'dark-mode'
     */
    applyTheme() {
        // Gestisci la classe CSS sul body
        if (this.isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Aggiorna icona del pulsante se esiste
        if (this.toggleButton) {
            // 🌙 per light mode (clicca per andare in dark)
            // ☀️ per dark mode (clicca per andare in light)
            this.toggleButton.innerHTML = this.isDark ? '☀️' : '🌙';
        }
    }

    /**
     * Alterna tra tema chiaro e scuro.
     * Questa è la funzione principale chiamata quando l'utente
     * clicca il pulsante toggle.
     * 
     * Sequenza operazioni:
     * 1. Inverte lo stato di isDark
     * 2. Salva la nuova preferenza in localStorage
     * 3. Applica il nuovo tema al documento
     * 
     * @method
     * @public
     * @returns {void}
     * 
     * @fires ThemeManager#themeChanged - Potrebbe emettere evento custom (future impl.)
     * 
     * @example
     * // Click sul pulsante
     * themeManager.toggle(); 
     * // Light -> Dark o Dark -> Light
     * 
     * @example
     * // Toggle programmatico (es. da menu settings)
     * if (userPreference === 'dark') {
     *   if (!themeManager.isDark) {
     *     themeManager.toggle();
     *   }
     * }
     */
    toggle() {
        // Inverti lo stato
        this.isDark = !this.isDark;
        
        // Salva la nuova preferenza
        this.saveTheme();
        
        // Applica il nuovo tema
        this.applyTheme();
    }

    /**
     * Restituisce il tema corrente come stringa.
     * Utile per debug, logging, o sincronizzazione UI.
     * 
     * @method
     * @public
     * @returns {string} 'dark' se dark mode attiva, 'light' altrimenti
     * 
     * @example
     * console.log("Tema attuale:", themeManager.getCurrentTheme());
     * // Output: "Tema attuale: dark" oppure "Tema attuale: light"
     * 
     * @example
     * // Sincronizza con un menu dropdown
     * const dropdown = document.querySelector('#theme-select');
     * dropdown.value = themeManager.getCurrentTheme();
     */
    getCurrentTheme() {
        return this.isDark ? 'dark' : 'light';
    }
}