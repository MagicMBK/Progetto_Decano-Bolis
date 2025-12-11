/**
 * @fileoverview Modulo per gestire la modalità dark theme
 * @module darkMode
 * @version 1.0.0
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
        this.isDark = localStorage.getItem(STORAGE_KEY) === 'dark';
        this.toggleButton = document.getElementById('themeToggle');
        this.applyTheme();
        
        if (this.toggleButton) {
            this.toggleButton.addEventListener('click', () => this.toggle());
        }
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
     */
    toggle() {
        this.isDark = !this.isDark;
        localStorage.setItem(STORAGE_KEY, this.isDark ? 'dark' : 'light');
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
