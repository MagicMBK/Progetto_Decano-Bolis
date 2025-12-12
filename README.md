# 🐍 Snake Game - Ultimate Edition

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6+-yellow.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

**Il classico Snake con Dark Mode e Skin RGB** 🎮

[Demo Live](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ✨ Features

- 🎨 **3 Skin RGB** - Scegli tra Green, Red e Blue
- 🌓 **Dark Mode** - Toggle light/dark con persistenza
- 💾 **LocalStorage** - Salva preferenze e high score
- ⚡ **Performance** - 60 FPS smooth gameplay
- 🎮 **Controlli Premium** - Frecce + WASD + Pausa (SPAZIO)
- 📊 **High Score** - Batti il tuo record personale

---

## 🚀 Quick Start

```bash
# Clone e apri
git clone https://github.com/tuousername/snake-game.git
cd snake-game
open index.html
# Usare Live Server per il corretto funzionamento
```
---

## 🎮 Controlli

| Azione | Tasti |
|--------|-------|
| Movimento | `↑ ↓ ← →` o `WASD` |
| Pausa | `SPAZIO` |
| Dark Mode | Click 🌙 |
| Cambia Skin | Click sui cubi colorati |

---

## 📂 Struttura

```
snake-game/
├── index.html          # Entry point
├── styles-skin.css     # Sistema skin RGB
├── styles-dark.css     # Dark mode styles
└── js/
    ├── main.js         # Game loop & rendering
    ├── game.js         # Core logic
    ├── skin.js         # Skin manager
    └── darkMode.js     # Theme manager
```

---

## 🎨 Skin Disponibili

```css
🟢 Green Viper  → #10b981 (default)
🔴 Red Python   → #ef4444 
🔵 Blue Cobra   → #3b82f6
```

Cambia skin **solo quando il gioco è fermo** - vengono salvate automaticamente!

---

## 🌓 Dark Mode

**Light Mode**: Background crema/panna, perfetto per il giorno  
**Dark Mode**: Background blu navy, ideale per la notte

Toggle con il pulsante 🌙/☀️ in alto a destra. La preferenza è **salvata** tra sessioni.

---

## 🛠️ Tecnologie

- **HTML5 Canvas** - Rendering grafico
- **JavaScript ES6+** - Logica modulare
- **CSS3 Variables** - Theming dinamico
- **LocalStorage API** - Persistenza dati
- **TailwindCSS** - Utility classes

---

## ⚡ Performance

- **60 FPS** costanti
- **< 100ms** tempo di caricamento
- **~25KB** dimensione totale
- **100%** compatibilità browser moderni

---

## 🧪 Browser Support

| Browser | Versione | Status |
|---------|----------|--------|
| Chrome | 90+ | ✅ |
| Firefox | 88+ | ✅ |
| Safari | 14+ | ✅ |
| Edge | 90+ | ✅ |

---

## 📖 Documentazione JSDoc

Ogni modulo è **completamente documentato** con JSDoc:

```javascript
/**
 * Applica una skin al serpente
 * @param {string} skin - Nome della skin ("red", "blue", "green")
 * @returns {boolean} True se applicata con successo
 */
apply(skin) { ... }
```

Genera la documentazione con: `npm run docs` (opzionale)

---

## 🤝 Contribuire

1. Fork il progetto
2. Crea il tuo branch (`git checkout -b feature/CoolFeature`)
3. Commit (`git commit -m 'Add CoolFeature'`)
4. Push (`git push origin feature/CoolFeature`)

---

## 📜 Changelog

**v2.0.0** (2024-12-12)
- ✨ Sistema Dark Mode
- ✨ Skin RGB (3 temi)
- 🎨 Grafica migliorata con effetti luminosi
- 📚 Documentazione JSDoc completa

**v1.0.0** (2024-11-XX)
- 🎮 Release iniziale

---

## 📄 License

MIT License - vedi [LICENSE](LICENSE) per dettagli.

---

## 👤 Autore

**[Decano Niccolo]**
**[Bolis Lorenzo]**
---

<div align="center">

⭐ Lascia una star se ti piace il progetto!

</div>
