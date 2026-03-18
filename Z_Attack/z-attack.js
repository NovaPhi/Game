/*
  Base Assault - Prototype
  Luis Arias
  15-Marzo-26
*/

"use strict";

const canvasWidth  = 1000;
const canvasHeight = 750;
const PLAYER_SPEED = 4;
const PLAYER_DMG   = 11; // 20-frame cooldown = 3 ticks/sec; 11 dmg * 9 ticks ≈ 99 → ~3s on 100hp wall

// Number of outpost (secondary base) boxes scattered around the map
const OUTPOST_COUNT = 5;

let ctx;
let game;

// ─────────────────────────────────────────────
// Player — a box controlled with WASD
// Has a damage value used when attacking walls/outposts
// ─────────────────────────────────────────────
class Player {
    constructor() {
        this.width  = 28;
        this.height = 28;
        this.x = 0;
        this.y = 0;
        this.damage = PLAYER_DMG;
        this.color  = "#4af";
        this.keys   = { up: false, down: false, left: false, right: false };

        // Attack cooldown so holding a key doesn't drain health every frame
        this.attackCooldown    = 0;
        this.attackCooldownMax = 20; // frames between hits; 3 ticks/sec at 60fps → 3s TTK on 99-100hp targets
        this.speedMod          = 1;  // multiplier applied to PLAYER_SPEED; set <1 by events
        this.isAttacking       = false; // true this frame if overlapping any target
        this.targetHp          = null;  // hp of the target currently being attacked
    }

    // Moves the player with WASD, prevents phasing through canvas edges
    update(walls) {
        const spd = PLAYER_SPEED * this.speedMod;
        let dx = 0, dy = 0;
        if (this.keys.up)    dy -= spd;
        if (this.keys.down)  dy += spd;
        if (this.keys.left)  dx -= spd;
        if (this.keys.right) dx += spd;

        // Try horizontal movement, resolve wall collisions axis by axis
        this.x += dx;
        this.x = Math.max(0, Math.min(canvasWidth  - this.width,  this.x));
        for (const w of walls) if (w.alive && this.overlaps(w)) this.resolveX(w, dx);

        this.y += dy;
        this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y));
        for (const w of walls) if (w.alive && this.overlaps(w)) this.resolveY(w, dy);

        if (this.attackCooldown > 0) this.attackCooldown--;
    }

    // Returns true if this player box overlaps a given rect object
    overlaps(rect) {
        return (
            this.x < rect.x + rect.width  &&
            this.x + this.width  > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y
        );
    }

    // Pushes the player out of a wall horizontally based on movement direction
    resolveX(wall, dx) {
        if (dx > 0) this.x = wall.x - this.width;
        if (dx < 0) this.x = wall.x + wall.width;
    }

    // Pushes the player out of a wall vertically based on movement direction
    resolveY(wall, dy) {
        if (dy > 0) this.y = wall.y - this.height;
        if (dy < 0) this.y = wall.y + wall.height;
    }

    // Deals damage to a target wall segment if cooldown has expired
    tryAttack(target) {
        if (this.overlaps(target)) {
            this.isAttacking = true;
            this.targetHp    = target.hp;
            if (this.attackCooldown === 0) {
                target.hp -= this.damage;
                if (target.hp < 0) target.hp = 0;
                this.targetHp        = target.hp;
                this.attackCooldown  = this.attackCooldownMax;
                return true;
            }
            return false;
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Small outline so the player reads clearly on any background
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

// ─────────────────────────────────────────────
// WallSegment — one square tile of the main base wall
// Each tile has its own HP; when HP hits 0 it is destroyed
// ─────────────────────────────────────────────
class WallSegment {
    constructor(x, y, maxHp = 100) {
        this.x      = x;
        this.y      = y;
        this.width  = 32;
        this.height = 32;
        this.maxHp  = maxHp;
        this.hp     = maxHp;
    }

    // Alive as long as any HP remains
    get alive() { return this.hp > 0; }

    draw(ctx) {
        if (!this.alive) return;

        ctx.fillStyle = "#e8e8e8";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

// ─────────────────────────────────────────────
// MainBase — the hollow square formation made of WallSegment instances
// Built with a for loop; holds the trigger condition for the win screen
// ─────────────────────────────────────────────
class MainBase {
    constructor(cx, cy) {
        this.segments = [];
        this.cx = cx;
        this.cy = cy;
        this.buildWall(cx, cy);
    }

    // Creates a hollow square ring of WallSegments around the center point
    buildWall(cx, cy) {
        const tileSize = 32;
        const gap      = 2;   // visual gap between tiles
        const step     = tileSize + gap;
        const cols     = 7;   // tiles across and down
        const rows     = 7;

        // Total pixel width of the formation, used to center it
        const totalW = cols * step - gap;
        const totalH = rows * step - gap;
        const startX = cx - totalW / 2;
        const startY = cy - totalH / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                // Only place tiles on the perimeter (hollow square)
                const isEdge = row === 0 || row === rows - 1 || col === 0 || col === cols - 1;
                if (!isEdge) continue;

                const x = startX + col * step;
                const y = startY + row * step;
                this.segments.push(new WallSegment(x, y, 100));
            }
        }
    }

    // Returns all living segments (used for collision and attack checks)
    get living() { return this.segments.filter(s => s.alive); }

    // Win condition — true when every wall tile has been destroyed
    get isDestroyed() { return this.segments.every(s => !s.alive); }

    // The hollow interior rect — used for the win trigger and spawn exclusion
    get innerZone() {
        const tileSize = 32;
        const gap      = 2;
        const step     = tileSize + gap;
        const cols     = 7;
        const rows     = 7;
        const totalW   = cols * step - gap;
        const totalH   = rows * step - gap;
        const startX   = this.cx - totalW / 2;
        const startY   = this.cy - totalH / 2;
        // Interior starts one tile in from each edge
        return {
            x:      startX + step,
            y:      startY + step,
            width:  totalW - step * 2,
            height: totalH - step * 2,
        };
    }

    draw(ctx) {
        for (const seg of this.segments) seg.draw(ctx);
    }
}

// ─────────────────────────────────────────────
// Outpost — a small secondary base box the player must destroy first
// While any outpost lives, the main base cannot be damaged
// ─────────────────────────────────────────────
class Outpost {
    constructor(x, y) {
        this.x      = x;
        this.y      = y;
        this.width  = 40;
        this.height = 40;
        this.maxHp  = 99;  // 11 dmg * 9 ticks (3s at 20-frame cooldown) = 99
        this.hp     = this.maxHp;
    }

    get alive() { return this.hp > 0; }

    draw(ctx) {
        if (!this.alive) return;

        const ratio = this.hp / this.maxHp;
        ctx.fillStyle = `rgba(220, 80, 220, ${0.4 + 0.6 * ratio})`;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        ctx.strokeStyle = "#f0f";
        ctx.lineWidth   = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);

        // HP bar
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, this.y - 8, this.width, 5);
        ctx.fillStyle = "#f0f";
        ctx.fillRect(this.x, this.y - 8, this.width * ratio, 5);

        // Label
        ctx.fillStyle = "#fff";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("OUTPOST", this.x + this.width / 2, this.y + this.height / 2 + 4);
    }
}

// ─────────────────────────────────────────────
// Game — owns all objects, handles input, drives the loop
// ─────────────────────────────────────────────
class Game {
    constructor() {
        this.player   = new Player();
        this.mainBase = new MainBase(canvasWidth / 2, canvasHeight / 2);
        this.outposts = [];
        this.won      = false;
        this.waiting  = true;

        // Random event — triggers once when wall HP drops below 50%
        this.randomEventActive  = false;
        this.randomEventTriggered = false; // so it only fires once per run
        this.notifTimer         = 0;       // frames to show the notification banner
        this.notifDuration      = 180;     // ~3 seconds at 60fps

        this.spawnOutposts();
        this.spawnPlayer();
        this.createEventListeners();
    }

    // Places the player at a random position guaranteed to be outside the wall zone
    spawnPlayer() {
        const iz     = this.mainBase.innerZone;
        const margin = 20;
        let x, y;
        do {
            x = margin + Math.random() * (canvasWidth  - margin * 2 - this.player.width);
            y = margin + Math.random() * (canvasHeight - margin * 2 - this.player.height);
        } while (
            x + this.player.width  > iz.x - 40 &&
            x                      < iz.x + iz.width  + 40 &&
            y + this.player.height > iz.y - 40 &&
            y                      < iz.y + iz.height + 40
        );
        this.player.x = x;
        this.player.y = y;
    }

    // Places OUTPOST_COUNT outpost boxes at random positions away from the center
    spawnOutposts() {
        const margin  = 80;
        const safeRad = 160; // don't spawn inside the main base area
        const cx = canvasWidth / 2, cy = canvasHeight / 2;

        for (let i = 0; i < OUTPOST_COUNT; i++) {
            let x, y;
            let attempts = 0;

            // Keep re-rolling until the position is outside the safe zone
            do {
                x = margin + Math.random() * (canvasWidth  - margin * 2 - 40);
                y = margin + Math.random() * (canvasHeight - margin * 2 - 40);
                attempts++;
            } while (
                Math.hypot(x - cx, y - cy) < safeRad && attempts < 100
            );

            this.outposts.push(new Outpost(x, y));
        }
    }

    // Returns true when all outposts have been cleared
    get outpostsCleared() { return this.outposts.every(o => !o.alive); }

    // Registers WASD movement keys and SPACE to start/restart
    createEventListeners() {
        window.addEventListener("keydown", (e) => {
            if (e.code === "Space") this.startOrRestart();
            if (e.code === "KeyW") this.player.keys.up    = true;
            if (e.code === "KeyS") this.player.keys.down  = true;
            if (e.code === "KeyA") this.player.keys.left  = true;
            if (e.code === "KeyD") this.player.keys.right = true;
        });
        window.addEventListener("keyup", (e) => {
            if (e.code === "KeyW") this.player.keys.up    = false;
            if (e.code === "KeyS") this.player.keys.down  = false;
            if (e.code === "KeyA") this.player.keys.left  = false;
            if (e.code === "KeyD") this.player.keys.right = false;
        });
    }

    // Starts the game from the title screen, or resets everything after a win
    startOrRestart() {
        if (this.waiting) {
            this.waiting = false;
        } else if (this.won) {
            this.player   = new Player();
            this.mainBase = new MainBase(canvasWidth / 2, canvasHeight / 2);
            this.outposts = [];
            this.won      = false;
            this.waiting  = false;
            this.randomEventActive    = false;
            this.randomEventTriggered = false;
            this.notifTimer           = 0;
            this.spawnOutposts();
            this.spawnPlayer();
        }
    }

    // Updates all game objects, handles all attack interactions
    update() {
        if (this.waiting || this.won) return;

        // Collect only wall segments as solid blockers — outposts are attackable, not solid
        const solidWalls = this.mainBase.living;

        this.player.update(solidWalls);

        // Reset attack state each frame before collision checks
        this.player.isAttacking = false;
        this.player.targetHp    = null;

        // Player attacks outposts freely (outposts are not solid so overlap check works)
        for (const outpost of this.outposts) {
            if (outpost.alive) this.player.tryAttack(outpost);
        }

        // Player can only damage the main base when all outposts are gone
        if (this.outpostsCleared) {
            for (const seg of this.mainBase.living) {
                this.player.tryAttack(seg);
            }
        }

        // Win condition — wall must be fully down AND player steps inside the inner zone
        if (this.mainBase.isDestroyed) {
            const iz = this.mainBase.innerZone;
            const playerInside = (
                this.player.x + this.player.width  > iz.x &&
                this.player.x                       < iz.x + iz.width  &&
                this.player.y + this.player.height  > iz.y &&
                this.player.y                       < iz.y + iz.height
            );
            if (playerInside) this.won = true;
        }

        // Random event — fires once when total wall HP falls below 50%
        if (!this.randomEventTriggered && this.outpostsCleared) {
            const totalHp    = this.mainBase.segments.reduce((sum, s) => sum + s.maxHp, 0);
            const currentHp  = this.mainBase.segments.reduce((sum, s) => sum + s.hp,    0);
            if (currentHp / totalHp < 0.5) {
                this.randomEventTriggered = true;
                this.randomEventActive    = true;
                this.notifTimer           = this.notifDuration;
                // Double the attack cooldown (3s → 6s TTK), keep damage the same
                this.player.speedMod = 0.7;                              // -30% speed
                this.player.attackCooldownMax = 40;                      // 20 → 40 frames = 6s TTK
            }
        }

        // Count down the notification banner
        if (this.notifTimer > 0) this.notifTimer--;
    }

    // Draws everything — background, objects, HUD, and overlays
    draw(ctx) {
        // Dark grid background
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        this.drawGrid(ctx);

        this.mainBase.draw(ctx);

        // When the wall is down, show the capture zone inside
        if (this.mainBase.isDestroyed) {
            const iz = this.mainBase.innerZone;
            ctx.fillStyle = "rgba(0, 255, 100, 0.25)";
            ctx.fillRect(iz.x, iz.y, iz.width, iz.height);
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 2;
            ctx.strokeRect(iz.x, iz.y, iz.width, iz.height);
            ctx.fillStyle = "lime";
            ctx.font = "11px monospace";
            ctx.textAlign = "center";
            ctx.fillText("ENTER", iz.x + iz.width / 2, iz.y + iz.height / 2 + 4);
        }
        for (const outpost of this.outposts) outpost.draw(ctx);
        this.player.draw(ctx);

        this.drawHUD(ctx);

        // Notification banner — shown for notifDuration frames after the event fires
        if (this.notifTimer > 0) this.drawEventNotif(ctx);

        if (this.waiting) {
            this.drawOverlay("BASE ASSAULT", "PRESS SPACE TO START", "#4af");
        } else if (this.won) {
            this.drawOverlay("BASE DESTROYED", "PRESS SPACE TO PLAY AGAIN", "lime");
        }
    }

    // Draws a subtle dot grid for visual depth
    drawGrid(ctx) {
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        for (let x = 20; x < canvasWidth; x += 40) {
            for (let y = 20; y < canvasHeight; y += 40) {
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }

    // Draws the top-left status panel
    drawHUD(ctx) {
        ctx.font      = "14px monospace";
        ctx.textAlign = "left";

        const outpostsLeft = this.outposts.filter(o => o.alive).length;
        const wallsLeft    = this.mainBase.living.length;

        ctx.fillStyle = "#aaa";
        ctx.fillText(`Outposts remaining : ${outpostsLeft}`, 12, 22);
        ctx.fillText(`Wall segments left : ${wallsLeft}`,    12, 42);

        if (!this.outpostsCleared) {
            ctx.fillStyle = "#f88";
            ctx.fillText("⚠  Destroy all outposts to damage the main base", 12, 64);
        } else {
            ctx.fillStyle = "lime";
            ctx.fillText("✓  Outposts cleared — attack the main base!", 12, 64);
        }

        // ── top-right debug panel ──────────────────────────────
        const dps        = (this.player.damage / this.player.attackCooldownMax * 60).toFixed(1);
        const attacking  = this.player.isAttacking;
        const targetHp   = this.player.targetHp !== null ? this.player.targetHp : "—";
        const panelX     = canvasWidth - 200;
        const lineH      = 22;

        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.fillRect(panelX - 8, 8, 196, 78);

        ctx.font      = "13px monospace";
        ctx.textAlign = "left";

        ctx.fillStyle = "#888";
        ctx.fillText("attacking :",  panelX, 28);
        ctx.fillText("dps       :",  panelX, 28 + lineH);
        ctx.fillText("target hp :",  panelX, 28 + lineH * 2);

        ctx.fillStyle = attacking ? "lime" : "#f66";
        ctx.fillText(`${attacking}`, panelX + 100, 28);
        ctx.fillStyle = "#fff";
        ctx.fillText(`${dps}`,       panelX + 100, 28 + lineH);
        ctx.fillText(`${targetHp}`,  panelX + 100, 28 + lineH * 2);

        // Show active debuff reminder in HUD once the random event has triggered
        if (this.randomEventActive) {
            ctx.fillStyle = "#fa0";
            ctx.fillText("⚡ RANDOM EVENT ACTIVE — Speed -30%  Attack rate -50%", 12, 86);
        }
    }

    // Draws the full-width notification banner that appears when the random event fires
    drawEventNotif(ctx) {
        const alpha = Math.min(1, this.notifTimer / 30); // fade in/out at edges
        ctx.fillStyle = `rgba(255, 140, 0, ${alpha * 0.85})`;
        ctx.fillRect(0, canvasHeight / 2 - 60, canvasWidth, 90);

        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.font = "32px monospace";
        ctx.fillText("⚡ RANDOM EVENT ACTIVATED", canvasWidth / 2, canvasHeight / 2 - 18);
        ctx.font = "16px monospace";
        ctx.fillText("Player speed -30% and attack rate -50%", canvasWidth / 2, canvasHeight / 2 + 16);
    }

    // Draws a semi-transparent centered overlay with title and subtitle
    drawOverlay(title, subtitle, color) {
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.textAlign = "center";
        ctx.fillStyle = color;
        ctx.font      = "56px monospace";
        ctx.fillText(title, canvasWidth / 2, canvasHeight / 2 - 20);
        ctx.fillStyle = "#fff";
        ctx.font      = "22px monospace";
        ctx.fillText(subtitle, canvasWidth / 2, canvasHeight / 2 + 30);
    }
}

// Initializes the canvas and kicks off the game loop
function main() {
    const canvas  = document.getElementById("canvas");
    canvas.width  = canvasWidth;
    canvas.height = canvasHeight;
    ctx  = canvas.getContext("2d");
    game = new Game();
    loop();
}

// Main loop — called every frame via requestAnimationFrame
function loop() {
    game.update();
    game.draw(ctx);
    requestAnimationFrame(loop);
}

main();