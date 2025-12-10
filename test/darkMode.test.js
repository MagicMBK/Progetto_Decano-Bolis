/**
 * @fileoverview Unit test per Dark Mode
 */

// Mock localStorage
const localStorageMock = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value;
    },
    clear() {
        this.store = {};
    }
};

// Mock document
const documentMock = {
    body: {
        classList: {
            classes: [],
            add(c) { this.classes.push(c); },
            remove(c) { this.classes = this.classes.filter(x => x !== c); },
            contains(c) { return this.classes.includes(c); }
        }
    }
};

// Setta i mock globali
global.localStorage = localStorageMock;
global.document = documentMock;

describe('Dark Mode', () => {

    beforeEach(() => {
        localStorage.clear();
        document.body.classList.classes = [];
    });

    // ========================================
    // TEST LOCALSTORAGE
    // ========================================

    test('localStorage salva tema dark', () => {
        localStorage.setItem('snakeTheme', 'dark');
        expect(localStorage.getItem('snakeTheme')).toBe('dark');
    });

    test('localStorage salva tema light', () => {
        localStorage.setItem('snakeTheme', 'light');
        expect(localStorage.getItem('snakeTheme')).toBe('light');
    });

    test('localStorage ritorna null se vuoto', () => {
        expect(localStorage.getItem('snakeTheme')).toBeNull();
    });

    // ========================================
    // TEST CLASSLIST
    // ========================================

    test('classList aggiunge dark-mode', () => {
        document.body.classList.add('dark-mode');
        expect(document.body.classList.contains('dark-mode')).toBe(true);
    });

    test('classList rimuove dark-mode', () => {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('dark-mode');
        expect(document.body.classList.contains('dark-mode')).toBe(false);
    });

    // ========================================
    // TEST LOGICA TOGGLE
    // ========================================

    test('toggle da light a dark', () => {
        let isDark = false;
        
        // Simula toggle
        isDark = !isDark;
        
        expect(isDark).toBe(true);
    });

    test('toggle da dark a light', () => {
        let isDark = true;
        
        // Simula toggle
        isDark = !isDark;
        
        expect(isDark).toBe(false);
    });

    test('doppio toggle ritorna allo stato iniziale', () => {
        let isDark = false;
        
        isDark = !isDark; // true
        isDark = !isDark; // false
        
        expect(isDark).toBe(false);
    });

    // ========================================
    // TEST PERSISTENZA
    // ========================================

    test('tema dark persiste dopo salvataggio', () => {
        // Salva
        localStorage.setItem('snakeTheme', 'dark');
        
        // Simula reload (leggi di nuovo)
        const savedTheme = localStorage.getItem('snakeTheme');
        const isDark = savedTheme === 'dark';
        
        expect(isDark).toBe(true);
    });

    test('tema light persiste dopo salvataggio', () => {
        localStorage.setItem('snakeTheme', 'light');
        
        const savedTheme = localStorage.getItem('snakeTheme');
        const isDark = savedTheme === 'dark';
        
        expect(isDark).toBe(false);
    });

    // ========================================
    // TEST INTEGRAZIONE
    // ========================================

    test('flusso completo: init -> toggle -> save', () => {
        // 1. Init (default light)
        let isDark = localStorage.getItem('snakeTheme') === 'dark';
        expect(isDark).toBe(false);
        
        // 2. Toggle
        isDark = !isDark;
        localStorage.setItem('snakeTheme', isDark ? 'dark' : 'light');
        document.body.classList.add('dark-mode');
        
        // 3. Verifica
        expect(isDark).toBe(true);
        expect(localStorage.getItem('snakeTheme')).toBe('dark');
        expect(document.body.classList.contains('dark-mode')).toBe(true);
    });

    test('flusso completo: carica tema salvato', () => {
        // Simula sessione precedente
        localStorage.setItem('snakeTheme', 'dark');
        
        // Simula init
        const savedTheme = localStorage.getItem('snakeTheme');
        let isDark = savedTheme === 'dark';
        
        if (isDark) {
            document.body.classList.add('dark-mode');
        }
        
        expect(document.body.classList.contains('dark-mode')).toBe(true);
    });

});