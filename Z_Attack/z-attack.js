/*
  Base Assault - Prototype
  Luis Arias
  29-Marzo-26
*/

"use strict";

const canvasWidth  = 1000;
const canvasHeight = 750;
const PLAYER_SPEED = 6;
const PLAYER_DMG   = 100;

const OUTPOST_COUNT = 50;

let playerStats = {
    speedMod: 1.0,
    maxHp: 100,
    bonuses: [],
    level: 0,
    stage: 0,
    xp: 0
};

function getDifficultyMult(){
    const doublings = Math.floor(playerStats.level / 3);
    return Math.pow(2,doublings);
}

let ctx;
let game;

// ─────────────────────────────────────────────
// Player — a box controlled with WASD
// ─────────────────────────────────────────────
class Player {
    constructor(stats = { speedMod: 1.0, maxHp: 100 }) {
        this.width  = 28;
        this.height = 28;
        this.x = 0;
        this.y = 0;
        this.damage = PLAYER_DMG;
        this.color  = "#4af";
        this.keys   = { up: false, down: false, left: false, right: false };

        this.attackCooldown    = 0;
        this.attackCooldownMax = 20;
        this.speedMod          = 1;
        this.isAttacking       = false;
        this.targetHp          = null;

        this.maxHp = 100;
        this.hp    = this.maxHp;

        this.speedMod = stats.speedMod;
        this.maxHp = stats.maxHp;
        this.hp = this.maxHp;
    }

    update(walls) {
        const spd = PLAYER_SPEED * this.speedMod;
        let dx = 0, dy = 0;
        if (this.keys.up)    dy -= spd;
        if (this.keys.down)  dy += spd;
        if (this.keys.left)  dx -= spd;
        if (this.keys.right) dx += spd;

        this.x += dx;
        this.x = Math.max(0, Math.min(canvasWidth  - this.width,  this.x));
        for (const w of walls) if (w.alive && this.overlaps(w)) this.resolveX(w, dx);

        this.y += dy;
        this.y = Math.max(0, Math.min(canvasHeight - this.height, this.y));
        for (const w of walls) if (w.alive && this.overlaps(w)) this.resolveY(w, dy);

        if (this.attackCooldown > 0) this.attackCooldown--;
    }

    overlaps(rect) {
        return (
            this.x < rect.x + rect.width  &&
            this.x + this.width  > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y
        );
    }

    touches(rect, margin = 2) {
        return (
            this.x < rect.x + rect.width  + margin &&
            this.x + this.width  > rect.x - margin &&
            this.y < rect.y + rect.height + margin &&
            this.y + this.height > rect.y - margin
        );
    }

    resolveX(wall, dx) {
        if (dx > 0) this.x = wall.x - this.width;
        if (dx < 0) this.x = wall.x + wall.width;
    }

    resolveY(wall, dy) {
        if (dy > 0) this.y = wall.y - this.height;
        if (dy < 0) this.y = wall.y + wall.height;
    }

    tryAttack(target) {
        if (this.touches(target)) {
            this.isAttacking = true;
            this.targetHp    = target.hp;
            if (this.attackCooldown === 0) {
                target.hp -= this.damage;
                if (target.hp < 0) target.hp = 0;
                this.targetHp       = target.hp;
                this.attackCooldown = this.attackCooldownMax;
                return true;
            }
            return false;
        }
        return false;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

// ─────────────────────────────────────────────
// Bullet — fired by outposts and wall segments
// ─────────────────────────────────────────────
class Bullet {
    constructor(x, y, vx, vy, damage, color = "#f84") {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = 1;
        this.damage = damage;
        this.color = color;
        this.width = 6;
        this.height = 6;
        this.dead = false;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight)
            this.dead = true;
    }

    overlaps(rect) {
        return (
            this.x < rect.x + rect.width  &&
            this.x + this.width  > rect.x &&
            this.y < rect.y + rect.height &&
            this.y + this.height > rect.y
        );
    }

    draw(ctx) {
        if (this.dead) return;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// ─────────────────────────────────────────────
// WallSegment — one square tile of the main base wall
// ─────────────────────────────────────────────
class WallSegment {
    constructor(x, y, maxHp = 100) {
        this.x      = x;
        this.y      = y;
        this.width  = 32;
        this.height = 32;
        this.maxHp  = maxHp;
        this.hp     = maxHp; 
        const mult   = getDifficultyMult();
        const cdMin  = Math.max(Math.floor(60  / mult), 10);
        const cdMax  = Math.max(Math.floor(180 / mult), cdMin + 1);

        this.shootCooldownMax = Math.floor(Math.random() * (cdMax - cdMin + 1)) + cdMin;
        this.shootCooldown    = Math.floor(Math.random() * this.shootCooldownMax);        
        this.shootRange = 300;
        this.side = "top";
        
    }

    get alive() { return this.hp > 0; }

    tryShoot(player) {
        if (!this.alive) return null;

        const cx = this.x + this.width  / 2;
        const cy = this.y + this.height / 2;
        const px = player.x + player.width  / 2;
        const py = player.y + player.height / 2;
        const dist = Math.hypot(px - cx, py - cy);


        // Don't shoot if player is within one player-length
        if (dist < player.width) return null;
        if (dist > this.shootRange) return null;

        const outside = 
                this.side === "top" ? py < cy :
                this.side === "bottom" ? py > cy:
                this.side === "left" ? px < cx: 
                this.side === "right" ? px > cx: true;
        
        if(!outside) return null;

        if (this.shootCooldown > 0) { this.shootCooldown--; return null; }

        this.shootCooldown = this.shootCooldownMax;
        const speed = PLAYER_SPEED * 0.5;
        const nx = (px - cx) / dist;
        const ny = (py - cy) / dist;
        // 1/6 of player max HP
        return new Bullet(cx - 3, cy - 3, nx * speed, ny * speed, player.maxHp / 6, "#f44");
    }

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
// MainBase — hollow square formation of WallSegments
// ─────────────────────────────────────────────
class MainBase {
    constructor(cx, cy) {
        this.segments = [];
        this.cx = cx;
        this.cy = cy;
        this.buildWall(cx, cy);
    }

    buildWall(cx, cy) {
        const tileSize = 32;
        const gap      = 2;
        const step     = tileSize + gap;
        const cols     = 7;
        const rows     = 7;

        const totalW = cols * step - gap;
        const totalH = rows * step - gap;
        const startX = cx - totalW / 2;
        const startY = cy - totalH / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const isEdge = row === 0 || row === rows - 1 || col === 0 || col === cols - 1;
                if (!isEdge) continue;
                const x = startX + col * step;
                const y = startY + row * step;
                const seg = (new WallSegment(x, y, 100));

                
                if (row === 0)        seg.side = "top";
                if (row === rows - 1) seg.side = "bottom";
                if (col === 0)        seg.side = "left";
                if (col === cols - 1) seg.side = "right";

                this.segments.push(seg);
            }
        }
    }

    get living() { return this.segments.filter(s => s.alive); }

    get isDestroyed() { return this.segments.every(s => !s.alive); }

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
// Outpost — secondary base; fires 3 shots/sec
// ─────────────────────────────────────────────
class Outpost {
    constructor(x, y) {
        this.x      = x;
        this.y      = y;
        this.width  = 40;
        this.height = 40;
        this.maxHp  = 99;
        this.hp     = this.maxHp;
        const mult   = getDifficultyMult();
        const cdMin  = Math.max(Math.floor(60  / mult), 10);   // 60 → 30 → 15 → ...
        const cdMax  = Math.max(Math.floor(180 / mult), cdMin + 1); // 180 → 90 → 45 → ...

        this.shootCooldownMax = Math.floor(Math.random() * (cdMax - cdMin + 1)) + cdMin;
        this.shootCooldown    = Math.floor(Math.random() * this.shootCooldownMax);

        this.shootRange = 200;
    }

    get alive() { return this.hp > 0; }

    tryShoot(player) {
        if (!this.alive) return null;

        const cx = this.x + this.width  / 2;
        const cy = this.y + this.height / 2;
        const px = player.x + player.width  / 2;
        const py = player.y + player.height / 2;
        const dist = Math.hypot(px - cx, py - cy);

        // Don't shoot if player is within one player-length
        if (dist < player.width) return null;
        if (dist > this.shootRange) return null;

        if (this.shootCooldown > 0) { this.shootCooldown--; return null; }

        this.shootCooldown = this.shootCooldownMax;
        const speed = PLAYER_SPEED * 0.5;
        const nx = (px - cx) / dist;
        const ny = (py - cy) / dist;
        // 1/8 of player max HP
        return new Bullet(cx - 3, cy - 3, nx * speed, ny * speed, player.maxHp / 8, "#f84");
    }

    draw(ctx) {
        if (!this.alive) return;
        const ratio = this.hp / this.maxHp;
        ctx.fillStyle = `rgba(220, 80, 220, ${0.4 + 0.6 * ratio})`;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "#f0f";
        ctx.lineWidth   = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, this.y - 8, this.width, 5);
        ctx.fillStyle = "#f0f";
        ctx.fillRect(this.x, this.y - 8, this.width * ratio, 5);
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
        this.bullets  = [];
        this.won      = false;
        this.waiting  = true;
        this._died    = false;
        this.outpostCount = Math.floor(Math.random() * 11) + 10

        this.randomEventActive    = false;
        this.randomEventTriggered = false;
        this.notifTimer           = 0;
        this.notifDuration        = 180;

        this.spawnOutposts();
        this.spawnPlayer();
        this.createEventListeners();
        this._rewardGranted = false;
        this.lastReward = null;
    }

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

    spawnOutposts() {
    const margin  = 80;
    const cx = canvasWidth / 2, cy = canvasHeight / 2;

    // Main base bounding box with a padding buffer
    const basePad = 60;
    const baseW   = 7 * (32 + 2) - 2; // matches buildWall math
    const baseH   = baseW;
    const baseX   = cx - baseW / 2 - basePad;
    const baseY   = cy - baseH / 2 - basePad;
    const baseBW  = baseW + basePad * 2;
    const baseBH  = baseH + basePad * 2;

    const outW    = 40; // Outpost.width
    const outH    = 40; // Outpost.height
    const minGap  = 30; // minimum clearance between outpost edges

    const placed  = []; // list of { x, y, width, height } already accepted

    const overlaps = (ax, ay, aw, ah, bx, by, bw, bh, gap = 0) =>
        ax < bx + bw + gap &&
        ax + aw + gap > bx &&
        ay < by + bh + gap &&
        ay + ah + gap > by;

    const mult = getDifficultyMult();
    const count = Math.min(
        Math.floor((Math.floor(Math.random() * 11 ) + 10 ) * mult )
        ,60
    );

    for (let i = 0; i < this.outpostCount; i++) {
        let x, y, attempts = 0, valid = false;

        while (!valid && attempts < 200) {
            attempts++;
            x = margin + Math.random() * (canvasWidth  - margin * 2 - outW);
            y = margin + Math.random() * (canvasHeight - margin * 2 - outH);

            // Reject if overlapping the main base (with buffer)
            if (overlaps(x, y, outW, outH, baseX, baseY, baseBW, baseBH)) continue;

            // Reject if overlapping any already-placed outpost (with gap)
            if (placed.some(p => overlaps(x, y, outW, outH, p.x, p.y, p.width, p.height, minGap))) continue;

            valid = true;
        }

        if (valid) {
            placed.push({ x, y, width: outW, height: outH });
            this.outposts.push(new Outpost(x, y));
        }
        // if 200 attempts all fail (extremely rare on this canvas), skip that outpost
    }
}

    get outpostsCleared() { return this.outposts.every(o => !o.alive); }

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

    startOrRestart() {
        if (this.waiting || this.won) {
            this.player   = new Player(playerStats)
            this.mainBase = new MainBase(canvasWidth / 2, canvasHeight / 2);
            this.outposts = [];
            this.bullets  = [];
            this.won      = false;
            this.waiting  = false;
            this._died    = false;
            this.randomEventActive    = false;
            this.randomEventTriggered = false;
            this.notifTimer           = 0;
            this.spawnOutposts();
            this.spawnPlayer();
            this._rewardGranted = false;
            this.lastReward = false;
        }
    }

   
    grantReward() {
        if (this._rewardGranted) return;
        this._rewardGranted = true;

        playerStats.level += 1;
        playerStats.stage = Math.floor(playerStats.level / 3)

        if (playerStats.level % 3 === 0) {
            playerStats.xp += 300;
            this.lastStageReward = true;
        } else {
            this.lastStageReward = false;
        }

        const roll = Math.random();
        if (roll < 0.5) {
            // Speed reward — +15% per level
            const bonus = 0.15;
            playerStats.speedMod = +(playerStats.speedMod + bonus).toFixed(2);
            playerStats.bonuses.push(`Speed +15%  -> ${(playerStats.speedMod * 100).toFixed(0)}%`);
            this.lastReward = "SPEED +15%";
        } else {
            // HP reward — +25 max HP per level
            const bonus = 25;
            playerStats.maxHp += bonus;
            playerStats.bonuses.push(`Max HP +25   ->  ${playerStats.maxHp}`);
            this.lastReward = "MAX HP +25";
        }
    }

    update() {
        if (this.waiting || this.won) return;

        const solidWalls = this.mainBase.living;
        this.player.update(solidWalls);

        this.player.isAttacking = false;
        this.player.targetHp    = null;

        // Player attacks outposts
        for (const outpost of this.outposts) {
            if (outpost.alive) this.player.tryAttack(outpost);
        }

        // Player attacks main base only when outposts are cleared
        if (this.outpostsCleared) {
            for (const seg of this.mainBase.living) {
                this.player.tryAttack(seg);
            }
        }

        // Win condition — always open
        const iz = this.mainBase.innerZone;
        const playerInside = (
            this.player.x + this.player.width  > iz.x &&
            this.player.x                       < iz.x + iz.width  &&
            this.player.y + this.player.height  > iz.y &&
            this.player.y                       < iz.y + iz.height
        );
        if (playerInside){
            this.grantReward();
            this.won = true;
        }

        // Random event — fires once when any wall segment drops below 50% HP
        if (!this.randomEventTriggered && this.outpostsCleared) {
            const triggered = this.mainBase.segments.some(s => s.alive && s.hp < s.maxHp * 0.5);
            if (triggered) {
                this.randomEventTriggered = true;
                this.randomEventActive    = true;
                this.notifTimer           = this.notifDuration;
                this.player.speedMod          = 0.7;
                this.player.attackCooldownMax = 40;
            }
        }

        if (this.notifTimer > 0) this.notifTimer--;

        // Outposts shoot at player
        for (const outpost of this.outposts) {
            const b = outpost.tryShoot(this.player);
            if (b) this.bullets.push(b);
        }

        // Wall segments shoot at player
        for (const seg of this.mainBase.living) {
            const b = seg.tryShoot(this.player);
            if (b) this.bullets.push(b);
        }

        // Move bullets, check hits, cull dead ones
        for (const b of this.bullets) {
            b.update();
            if (!b.dead && b.overlaps(this.player)) {
                this.player.hp -= b.damage;
                if (this.player.hp < 0) this.player.hp = 0;
                b.dead = true;
            }
        }
        this.bullets = this.bullets.filter(b => !b.dead);

        // Game over when player HP hits 0
        if (this.player.hp <= 0) {
            playerStats = { speedMod: 1.0, maxHp: 100, bonuses: [], level: 0, stage:0, xp:0}; // wipe on death
            this.won     = false;
            this.waiting = true;
            this._died   = true;
        }

    }

    draw(ctx) {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        this.drawGrid(ctx);

        this.mainBase.draw(ctx);

        // Capture zone — always visible
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

        for (const outpost of this.outposts) outpost.draw(ctx);
        this.player.draw(ctx);
        for (const b of this.bullets) b.draw(ctx);

        this.drawHUD(ctx);

        if (this.notifTimer > 0) this.drawEventNotif(ctx);

        if (this.waiting && this._died) {
            this.drawDeathScreen();
        } else if (this.waiting) {
            this.drawOverlay("BASE ASSAULT", "PRESS SPACE TO START", "#4af");
        } else if (this.won) {
            this.drawOverlay("BASE DESTROYED", "PRESS SPACE TO PLAY AGAIN", "lime");
        }
    }

    drawGrid(ctx) {
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        for (let x = 20; x < canvasWidth; x += 40) {
            for (let y = 20; y < canvasHeight; y += 40) {
                ctx.fillRect(x, y, 1, 1);
            }
        }
    }

    drawHUD(ctx) {
        ctx.font      = "14px monospace";
        const mult = getDifficultyMult();  
        ctx.fillStyle = mult >= 4 ? "#f44" : mult >= 2 ? "#fa0" : "#aaa";  
        ctx.textAlign = "right";   
        ctx.fillText(`level ${playerStats.level + 1}   ×${mult} difficulty`, canvasWidth - 12, 22);
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

        
        if (this.randomEventActive) {
            ctx.fillStyle = "#fa0";
            ctx.fillText("RANDOM EVENT ACTIVE — Speed -30%  Attack rate -50%", 12, 86);
        }

        // Player HP bar
        const barW  = 160, barH = 12;
        const barX  = 12,  barY = canvasHeight - 28;
        const hpRatio = this.player.hp / this.player.maxHp;
        ctx.fillStyle = "#333";
        ctx.fillRect(barX, barY, barW, barH);
        ctx.fillStyle = hpRatio > 0.5 ? "lime" : hpRatio > 0.25 ? "#fa0" : "#f44";
        ctx.fillRect(barX, barY, barW * hpRatio, barH);
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.strokeRect(barX, barY, barW, barH);
        ctx.fillStyle = "#fff";
        ctx.font = "11px monospace";
        ctx.textAlign = "left";
        ctx.fillText(`HP  ${Math.ceil(this.player.hp)} / ${this.player.maxHp}`, barX, barY - 4);
    }

    drawEventNotif(ctx) {
        const alpha = Math.min(1, this.notifTimer / 30);
        ctx.fillStyle = `rgba(255, 140, 0, ${alpha * 0.85})`;
        ctx.fillRect(0, canvasHeight / 2 - 60, canvasWidth, 90);
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.font = "32px monospace";
        ctx.fillText("⚡ RANDOM EVENT ACTIVATED", canvasWidth / 2, canvasHeight / 2 - 18);
        ctx.font = "16px monospace";
        ctx.fillText("Player speed -30% and attack rate -50%", canvasWidth / 2, canvasHeight / 2 + 16);
    }

        drawDeathScreen() {
        ctx.fillStyle = "rgba(0,0,0,0.75)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.textAlign = "center";

        ctx.fillStyle = "#f44";
        ctx.font      = "56px monospace";
        ctx.fillText("YOU DIED", canvasWidth / 2, canvasHeight / 2 - 80);

        ctx.fillStyle = "#ffdd57";
        ctx.font      = "32px monospace";
        ctx.fillText(`TOTAL XP: ${playerStats.xp}`, canvasWidth / 2, canvasHeight / 2 - 20);

        ctx.fillStyle = "#aaa";
        ctx.font      = "18px monospace";
        ctx.fillText(`Reached Level ${playerStats.level}  —  Stage ${playerStats.stage}`, canvasWidth / 2, canvasHeight / 2 + 20);

        ctx.fillStyle = "#fff";
        ctx.font      = "22px monospace";
        ctx.fillText("PRESS SPACE TO TRY AGAIN", canvasWidth / 2, canvasHeight / 2 + 60);
    }

    drawOverlay(title, subtitle, color) {
        ctx.fillStyle = "rgba(0,0,0,0.65)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.textAlign = "center";
        ctx.fillStyle = color;
        ctx.font      = "56px monospace";
        ctx.fillText(title, canvasWidth / 2, canvasHeight / 2 - 60);

        if (this.won && this.lastReward) {
            ctx.fillStyle = "#ffdd57";
            ctx.font      = "28px monospace";
            ctx.fillText(`REWARD: ${this.lastReward}`, canvasWidth / 2, canvasHeight / 2 - 10);

            if (this.lastStageReward) {
                ctx.fillStyle = "#4f4";
                ctx.font      = "22px monospace";
                ctx.fillText(`STAGE COMPLETE — +300 XP  (total: ${playerStats.xp})`, canvasWidth / 2, canvasHeight / 2 + 24);
            }
        }

        ctx.fillStyle = "#fff";
        ctx.font      = "22px monospace";
        ctx.fillText(subtitle, canvasWidth / 2, canvasHeight / 2 + 60);
    }    
}

function main() {
    const canvas  = document.getElementById("canvas");
    canvas.width  = canvasWidth;
    canvas.height = canvasHeight;
    ctx  = canvas.getContext("2d");
    game = new Game();
    loop();
}

function loop() {
    game.update();
    game.draw(ctx);
    requestAnimationFrame(loop);
}

main();

