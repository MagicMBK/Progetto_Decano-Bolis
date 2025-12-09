import { SnakeGame } from "../js/game.js";

test("il serpente parte con lunghezza 1", () => {
    const g = new SnakeGame();
    expect(g.serpente.length).toBe(1);
});

test("la direzione cambia correttamente", () => {
    const g = new SnakeGame();
    g.impostaDirezione({ x: 1, y: 0 });
    expect(g.direzione).toEqual({ x: 1, y: 0 });
});

test("quando il serpente mangia aumenta il punteggio", () => {
    const g = new SnakeGame();
    g.cibo = { x: g.serpente[0].x, y: g.serpente[0].y };
    const esito = g.aggiorna();
    expect(esito.mangiato).toBe(true);
    expect(g.punteggio).toBe(1);
});
