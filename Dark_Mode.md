# Feature: Dark Mode 🌙

## Descrizione

Implementazione di una modalità tema scuro (dark mode) per il gioco Snake, con persistenza della preferenza utente e toggle animato.

---

## Funzionalità

- ✅ Toggle tra tema chiaro e scuro
- ✅ Pulsante animato con icona sole/luna
- ✅ Persistenza in `localStorage`
- ✅ Effetto neon sui punteggi in dark mode
- ✅ Transizioni fluide tra i temi
- ✅ Stile retro arcade con font "Press Start 2P"

---

## File Modificati/Aggiunti

| File | Tipo | Descrizione |
|------|------|-------------|
| `progetto/js/darkMode.js` | ➕ Nuovo | Logica toggle dark mode |
| `progetto/css/styles-dark.css` | ➕ Nuovo | Stili tema scuro |
| `progetto/css/styles.css` | ✏️ Modificato | Aggiunto font retro |
| `progetto/index.html` | ✏️ Modificato | Aggiunto pulsante toggle |

---

## Come Usare

1. Clicca il pulsante **🌙** in alto a destra
2. Il tema cambia in dark mode
3. L'icona diventa **☀️**
4. La preferenza viene salvata automaticamente

---

## Implementazione Tecnica

### LocalStorage
```javascript
// Salvataggio
localStorage.setItem('snakeTheme', 'dark');

// Caricamento
const tema = localStorage.getItem('snakeTheme');