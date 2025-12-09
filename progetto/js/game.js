export class SnakeGame {
    constructor(config = {}) {
        this.dimensioneGriglia = config.dimensioneGriglia || 20;
        this.velocitaIniziale = config.velocitaIniziale || 100;
        this.reset();
    }

    reset() {
        const centro = Math.floor(this.dimensioneGriglia / 2);
        this.serpente = [{ x: centro, y: centro }];
        this.direzione = { x: 0, y: 0 };
        this.punteggio = 0;
        this.velocita = this.velocitaIniziale;
        this.inCorso = false;
        this.posizionaCibo();
    }

    impostaDirezione(dir) {
        if (!dir) return;
        if (this.direzione.x !== 0 && dir.x === -this.direzione.x) return;
        if (this.direzione.y !== 0 && dir.y === -this.direzione.y) return;

        this.direzione = dir;
        if (dir.x !== 0 || dir.y !== 0) this.inCorso = true;
    }

    posizionaCibo() {
        let pos;
        do {
            pos = {
                x: Math.floor(Math.random() * this.dimensioneGriglia),
                y: Math.floor(Math.random() * this.dimensioneGriglia),
            };
        } while (this.serpente.some(s => s.x === pos.x && s.y === pos.y));
        this.cibo = pos;
        return pos;
    }

    aggiorna() {
        if (!this.inCorso) return { morto: false, mangiato: false };

        const testa = {
            x: this.serpente[0].x + this.direzione.x,
            y: this.serpente[0].y + this.direzione.y
        };

        if (testa.x < 0 || testa.x >= this.dimensioneGriglia || testa.y < 0 || testa.y >= this.dimensioneGriglia || this.serpente.some(s => s.x === testa.x && s.y === testa.y)) {
            this.inCorso = false;
            return { morto: true, mangiato: false };
        }

        this.serpente.unshift(testa);

        if (testa.x === this.cibo.x && testa.y === this.cibo.y) {
            this.punteggio++;
            this.posizionaCibo();
            return { morto: false, mangiato: true };
        }

        this.serpente.pop();
        return { morto: false, mangiato: false };
    }
}
