# 📄 Riepilogo del Lavoro di Gruppo

## 👥 Membri del Team
- **Decano Niccolò**
- **Bolis Lorenzo**

---

## 🧩 Suddivisione dei Compiti

### **Decano Niccolò**
- Implementazione della feature **Dark Mode** (branch: `feature_dark_mode`)
- Documentazione JSDoc di `game.js` e `main.js`
- Stesura del README specifico per la Dark Mode
- Implementazione degli **unit test** per:
  - logica di movimento
  - collisioni
  - posizionamento cibo
  - aggiornamento del punteggio
- Configurazione finale degli script npm per la generazione automatica della documentazione

### **Bolis Lorenzo**
- Implementazione della feature **Skin RGB del serpente** (branch: `feature_skin`)
- Stesura del README specifico per la Skin RGB
- Testing manuale del gioco (movimento, UI, dark mode, skin)
- Preparazione iniziale della configurazione npm
- Supporto nella documentazione

---

## 🛠️ Modalità di Collaborazione

- Ogni feature sviluppata in un **branch dedicato**
- Commit frequenti e messaggi chiari
- Revisione reciproca delle modifiche
- Merge dei branch `feature_skin` e `feature_dark_mode` nel `main`
- Pair programming su alcuni passaggi critici

---

## 📚 Documentazione

- Commenti **JSDoc** integrati nel codice
- Documentazione generata con **JSDoc** nella cartella `docs`
- README aggiornati per entrambe le feature
- Script npm dedicato alla generazione automatica:

`npm run docs`

---

## 🧪 Testing

### **Unit Test (Decano Niccolò)**
- Test del movimento del serpente
- Test delle collisioni
- Test della funzione `posizionaCibo()`
- Test sul punteggio e consumo cibo

### **Testing Manuale (Bolis Lorenzo)**
- Verifica fluidità del movimento
- Controllo corretto cambio skin (RGB)
- Testing Dark Mode
- Test input da tastiera, reset e UI

---

## 🔚 Considerazioni Finali

Il progetto è stato svolto con una suddivisione chiara e collaborativa del lavoro.  
La gestione tramite branch, documentazione accurata e testing ha permesso un workflow simile a quello di un team reale.

