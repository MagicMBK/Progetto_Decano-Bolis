# 🐍 Feature: Nuova Skin RGB per il Serpente

Questo branch introduce una nuova personalizzazione grafica per il serpente nel gioco **Snake**, aggiungendo una skin basata su colori **Rosso, Verde e Blu (RGB)**.

---

## 🎯 Obiettivo della Feature

Migliorare l’estetica del serpente rendendolo più moderno e visivamente gradevole.  
La nuova skin RGB:

- applica tre varianti di colore: **rosso**, **verde**, **blu**
- mantiene la distinzione chiara tra testa e corpo
- non modifica la logica o le meccaniche del gioco

---

## 🛠️ Modifiche Apportate

### ✔️ 1. Rendering aggiornato
Il sistema di disegno del serpente in `main.js` è stato modificato per applicare i colori RGB in base alla skin selezionata.

### ✔️ 2. Skin configurabile
Aggiunta una proprietà/variabile che permette di selezionare la skin attiva:

- `"red"`
- `"green"`
- `"blue"`

### ✔️ 3. Nessun impatto sulla logica
La feature è puramente grafica:  
non sono stati modificati movimento, collisioni, punteggio o comportamento del gioco.

---

## 📁 File Modificati

js/main.js → aggiornato collegamento a funzione RGB su skin.js
js/game.js → nessuna modifica funzionale
js/skin.js → funzionamento base della skin RGB
index.html → (eventuale) aggiunta selettore skin


---

## 🧪 Testing

Verificato che:

- la testa del serpente resta distinguibile
- il corpo cambia colore correttamente secondo la skin scelta
- tutte le skin risultano ben visibili sulla griglia
- nessun effetto collaterale al gameplay

---
