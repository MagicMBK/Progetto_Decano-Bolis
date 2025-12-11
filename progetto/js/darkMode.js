/**
 * @fileoverview Modulo per gestire la modalità dark theme
 * Gestisce il toggle tra light e dark mode con persistenza in localStorage
 * 
 * @module darkMode
 * @author Il tuo nome
 * @version 1.0.0
 */

/**
 * Chiave usata per salvare la preferenza nel localStorage
 * @constant {string}
 */
const STORAGE_KEY = 'snakeGameTheme';

/**
 * Classe che gestisce il tema dell'applicazione
 * @class
 */
export class ThemeManager {
    /**
     * Crea una nuova istanza del ThemeManager
     * @constructor
     */
    constructor() {
        /**
         * Indica se il tema dark è attualmente attivo
         * @type {boolean}
         * @private
         */
        this.isDark = false;
        
        /**
         * Riferimento al pulsante di toggle
         * @type {HTMLButtonElement|null}
         * @private
         */
        this.toggleButton = null;
        
        this.init();
    }

    /**
     * Inizializza il theme manager
     * @private
     * @returns {void}
     */
    init() {
        this.loadTheme();
        this.createToggleButton();
        this.applyTheme();
    }

    /**
     * Carica la preferenza del tema dal localStorage
     * @private
     * @returns {void}
     */
    loadTheme() {
        const saved = localStorage.getItem(STORAGE_KEY);
        this.isDark = saved === 'dark';
    }

    /**
     * Salva la preferenza del tema nel localStorage
     * @private
     * @returns {void}
     */
    saveTheme() {
        localStorage.setItem(STORAGE_KEY, this.isDark ? 'dark' : 'light');
    }

    /**
     * Crea il pulsante di toggle e lo aggiunge al DOM
     * @private
     * @returns {void}
     */
    createToggleButton() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'theme-toggle';
        this.toggleButton.setAttribute('aria-label', 'Toggle dark mode');
        this.toggleButton.innerHTML = this.isDark ? '☀️' : '🌙';
        
        this.toggleButton.addEventListener('click', () => this.toggle());
        
        document.body.appendChild(this.toggleButton);
    }

    /**
     * Applica il tema corrente al documento
     * @private
     * @returns {void}
     */
    applyTheme() {
        if (this.isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        if (this.toggleButton) {
            this.toggleButton.innerHTML = this.isDark ? '☀️' : '🌙';
        }
    }

    /**
     * Alterna tra tema chiaro e scuro
     * @public
     * @returns {void}
     * 
     * @example
     * const themeManager = new ThemeManager();
     * themeManager.toggle(); // Passa da light a dark o viceversa
     */
    toggle() {
        this.isDark = !this.isDark;
        this.saveTheme();
        this.applyTheme();
    }

    /**
     * Restituisce il tema corrente
     * @public
     * @returns {string} 'dark' o 'light'
     */
    getCurrentTheme() {
        return this.isDark ? 'dark' : 'light';
    }
}