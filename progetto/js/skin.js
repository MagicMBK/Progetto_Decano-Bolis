/**
 * @fileoverview Modulo per gestire le skin del serpente
 * @module skin
 * @version 1.0.0
 */

export const SKINS = ["red", "blue", "green"];
const SKIN_KEY = "snakeSkin_v1";

export class SkinManager {
    constructor(root = document.body) {
        this.root = root;
        this.current = localStorage.getItem(SKIN_KEY) || "green";
        this.apply(this.current);
        console.log("[SkinManager] inizializzato con skin:", this.current);
    }

    apply(skin) {
        if (!SKINS.includes(skin)) return false;
        SKINS.forEach(s => this.root.classList.remove(`body-skin-${s}`));
        this.root.classList.add(`body-skin-${skin}`);
        this.current = skin;
        try { 
            localStorage.setItem(SKIN_KEY, skin); 
        } catch(e) {
            console.warn("[SkinManager] Impossibile salvare in localStorage");
        }
        console.log("[SkinManager] skin applicata:", skin);
        return true;
    }

    applyIfAllowed(skin, gameInProgress) {
        if (gameInProgress) {
            return { ok: false, reason: "game_in_progress" };
        }
        const ok = this.apply(skin);
        return { ok, reason: ok ? undefined : "invalid_skin" };
    }

    getCurrent() { 
        return this.current; 
    }
}