🐍 Feature: Nuova Skin RGB per il Serpente

Questo branch introduce una nuova personalizzazione grafica per il serpente nel gioco Snake, aggiungendo una skin dinamica basata su colori Rosso, Verde e Blu (RGB).

🎯 Obiettivo della Feature

Migliorare l’estetica del serpente rendendolo più moderno e visivamente gradevole.
La nuova skin RGB:

applica tre varianti di colore: red, green, blue

può essere configurata facilmente nel codice

mantiene la distinzione della testa del serpente

non altera la logica di gioco

🛠️ Modifiche Apportate
✔️ 1. Aggiornamento della funzione di disegno

Il rendering del serpente è stato modificato per applicare una palette RGB ciclica o selezionabile.

✔️ 2. Introduzione di un selettore colore (opzionale)

Aggiunta una proprietà/variabile per selezionare la skin attiva:

"red"

"green"

"blue"

✔️ 3. Nessuna modifica alla logica di gioco

La feature è completamente isolata alla parte grafica/rendering, senza influire su:

movimento

punteggio

collisioni

velocità

📁 File Modificati
js/main.js     → aggiornato il rendering del serpente
js/game.js     → nessuna modifica alla logica
index.html     → (eventuale) aggiunta opzione selezione skin

🧪 Testing

È stato verificato che:

il serpente mantiene la forma corretta

la testa rimane distinguibile anche con la skin RGB

nessun impatto su collisioni e logica interna

il colore del cibo rimane invariato

il gradiente visivo funziona correttamente con le nuove palette

📝 Note

Questa feature è pensata per essere estendibile.
In futuro sarà possibile aggiungere:

skin animate

skin sbloccabili

skin basate sul punteggio

skin selezionabili dal giocatore
