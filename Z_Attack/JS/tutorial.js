(function applySettings() {
    const brightness = localStorage.getItem('brightness') ?? 100;
    const colorblind = localStorage.getItem('colorblind') || 'none';

    document.body.style.filter = `brightness(${brightness}%)`;

    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (colorblind !== 'none') document.body.classList.add(colorblind);
})();

//Game Z_ATTACK — Tutorial
//By: Luis Jaime Arias Sarabia, Adolfo Hernández Sánchez and Alonso Arechiga Mendoza

"use strict";

const canvasWidth  = 1000;
const canvasHeight = 750;
const PLAYER_SPEED = 6;
const PLAYER_DMG   = 100;

let playerStats = {
    speedMod:     1.0,
    maxHp:        100,
    level:        0,
    xp:           0,
    dmgReduction: 0,
    deck:         createStarterDeck()
};

function getDifficultyMult() {
    const doublings = Math.floor(playerStats.level / 3);
    return Math.pow(2, doublings);
}

let ctx;
let game;

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
        this.speedMod          = stats.speedMod;
        this.isAttacking       = false;
        this.targetHp          = null;

        this.maxHp = stats.maxHp;
        this.hp    = 50;
    }

    update(walls) {
        if (game.tutorial.active) return;
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

class Bullet {
    constructor(x, y, vx, vy, damage, color = "#f84") {
        this.x      = x;
        this.y      = y;
        this.vx     = vx;
        this.vy     = vy;
        this.damage = damage;
        this.color  = color;
        this.width  = 6;
        this.height = 6;
        this.dead   = false;
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

class WallSegment {
    constructor(x, y, maxHp = 100) {
        this.x      = x;
        this.y      = y;
        this.width  = 32;
        this.height = 32;
        this.maxHp  = maxHp;
        this.hp     = maxHp;

        const mult  = getDifficultyMult();
        const cdMin = Math.max(Math.floor(60  / mult), 10);
        const cdMax = Math.max(Math.floor(180 / mult), cdMin + 1);
        this.shootCooldownMax = Math.floor(Math.random() * (cdMax - cdMin + 1)) + cdMin;
        this.shootCooldown    = Math.floor(Math.random() * this.shootCooldownMax);

        this.shootRange = 300;
        this.side       = "top";
    }

    get alive() { return this.hp > 0; }

    tryShoot(player) {
        if (!this.alive) return null;

        const cx = this.x + this.width  / 2;
        const cy = this.y + this.height / 2;
        const px = player.x + player.width  / 2;
        const py = player.y + player.height / 2;
        const dist = Math.hypot(px - cx, py - cy);

        if (dist < player.width)    return null;
        if (dist > this.shootRange) return null;

        const outside =
            this.side === "top"    ? py < cy :
            this.side === "bottom" ? py > cy :
            this.side === "left"   ? px < cx :
            this.side === "right"  ? px > cx : true;

        if (!outside) return null;

        if (this.shootCooldown > 0) { this.shootCooldown--; return null; }

        this.shootCooldown = this.shootCooldownMax;
        const speed = 4;
        const nx = (px - cx) / dist;
        const ny = (py - cy) / dist;
        return new Bullet(cx - 3, cy - 3, nx * speed, ny * speed, 5, "#f44");
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
        const totalW   = cols * step - gap;
        const totalH   = rows * step - gap;
        const startX   = cx - totalW / 2;
        const startY   = cy - totalH / 2;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const isEdge = row === 0 || row === rows - 1 || col === 0 || col === cols - 1;
                if (!isEdge) continue;
                const x   = startX + col * step;
                const y   = startY + row * step;
                const seg = new WallSegment(x, y, 100);
                if (row === 0)        seg.side = "top";
                if (row === rows - 1) seg.side = "bottom";
                if (col === 0)        seg.side = "left";
                if (col === cols - 1) seg.side = "right";
                this.segments.push(seg);
            }
        }
    }

    get living() { return this.segments.filter(s => s.alive); }

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

class Outpost {
    constructor(x, y) {
        this.x      = x;
        this.y      = y;
        this.width  = 40;
        this.height = 40;
        this.maxHp  = 99;
        this.hp     = this.maxHp;

        const mult  = getDifficultyMult();
        const cdMin = Math.max(Math.floor(60  / mult), 10);
        const cdMax = Math.max(Math.floor(180 / mult), cdMin + 1);
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

        if (dist < player.width)    return null;
        if (dist > this.shootRange) return null;

        if (this.shootCooldown > 0) { this.shootCooldown--; return null; }

        this.shootCooldown = this.shootCooldownMax;
        const speed = 3;
        const nx = (px - cx) / dist;
        const ny = (py - cy) / dist;
        return new Bullet(cx - 3, cy - 3, nx * speed, ny * speed, 5, "#f84");
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

class Tutorial {
    constructor(game) {
        this.game = game;
        this.active = true;
        this.step = 0;

        this.steps = [
            "Use WASD to move",
            "This is an OUTPOST (touch to attack)",
            "Attack the MAIN BASE",
            "Enter the GREEN zone to win",
            "Health Bar",
            "HUD",
            "Level",
            "Cards explain",
            "Low life",
            "Use a card",
            "Heal",
            "End"
        ];
    }

    next() {
        this.step++;
        if (this.step >= this.steps.length) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.fillStyle = "rgba(0,0,0,0.7)";
        ctx.fillRect(0, canvasHeight - 80, canvasWidth, 80);

        ctx.fillStyle = "#0ff";
        ctx.font = "20px monospace";
        ctx.textAlign = "center";
        ctx.fillText(this.steps[this.step], canvasWidth / 2, canvasHeight - 40);

        ctx.font = "14px monospace";
        ctx.fillText("Press SPACE to continue", canvasWidth / 2, canvasHeight - 15);
    }
}

class Game {
    constructor() {
        this.player   = new Player();
        this.mainBase = new MainBase(canvasWidth / 2, canvasHeight / 2);
        this.outposts = [];
        this.bullets  = [];
        this.won      = false;
        this.waiting  = true;
        this._died    = false;
        this.tutorial = new Tutorial(this);
        this.tutorial.active = false;
        this.instructionsScreen = false;

        this.randomEventActive    = false;
        this.randomEventTriggered = false;
        this.notifTimer           = 0;
        this.notifDuration        = 180;

        this.targetingMode      = null;
        this.draftChoices       = null;
        this._pendingTargetCard = null;

        this.mouseX = 0;
        this.mouseY = 0;

        this.spawnOutposts();
        this.spawnPlayer();
        this.createEventListeners();
        this._rewardGranted = false;
        this.lastReward     = null;
    }

    spawnPlayer() {
        this.player.x = 900;
        this.player.y = 200;
    }

    spawnOutposts() {
        this.outposts.push(new Outpost(200, 200));
        this.outposts.push(new Outpost(700, 500));
    }

    get outpostsCleared() { return this.outposts.every(o => !o.alive); }

    createEventListeners() {
        window.addEventListener("keydown", (e) => {
            if (this.won && this.draftChoices) return;

            if (this.targetingMode && e.code === "KeyE") {
                if (this._pendingTargetCard) {
                    playerStats.deck.push(this._pendingTargetCard);
                    this._pendingTargetCard = null;
                }
                this.targetingMode = null;
                return;
            }

            if (!this.waiting && !this.won && !this.targetingMode &&
                ["Digit1","Digit2","Digit3","Digit4","Digit5"].includes(e.code)) {
                if (this.tutorial.active && this.tutorial.step != 8) return;
                const idx = parseInt(e.code.slice(-1), 10) - 1;
                if (idx >= 0 && idx < playerStats.deck.length) {
                    const card = playerStats.deck.splice(idx, 1)[0];
                    if (this.tutorial.active && this.tutorial.step == 8 && idx == 0) {
                        this.tutorial.next();
                    }
                    if (card.targeting) this._pendingTargetCard = card;
                    card.apply(this);
                }
                return;
            }

            if (e.code === "Space") {
                if (this.won && !this.instructionsScreen && !this.draftChoices) return;
                if (this.won && this.instructionsScreen) {
                    this.instructionsScreen = false;
                    this.draftChoices = getDraftChoices();
                    return;
                }
                if (this.waiting) {
                    this.waiting = false;
                    this.tutorial.active = true;
                    return;
                }
                if (this.tutorial && this.tutorial.active) {
                    if (this.tutorial.step != 8) this.tutorial.next();
                    if (!this.tutorial.active) this.startOrRestart();
                    return;
                }
                this.startOrRestart();
            }

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

        const canvas = document.getElementById("canvas");
        if (canvas) {
            canvas.addEventListener("mousemove", (e) => {
                const rect = canvas.getBoundingClientRect();
                this.mouseX = (e.clientX - rect.left) * (canvasWidth  / rect.width);
                this.mouseY = (e.clientY - rect.top)  * (canvasHeight / rect.height);
            });
            canvas.addEventListener("mousedown", (e) => {
                const rect = canvas.getBoundingClientRect();
                const mx = (e.clientX - rect.left) * (canvasWidth  / rect.width);
                const my = (e.clientY - rect.top)  * (canvasHeight / rect.height);

                if (this.targetingMode === "destroy_outpost") {
                    for (const o of this.outposts) {
                        if (o.alive &&
                            mx >= o.x && mx <= o.x + o.width &&
                            my >= o.y && my <= o.y + o.height) {
                            o.hp = 0;
                            this.targetingMode      = null;
                            this._pendingTargetCard = null;
                            break;
                        }
                    }
                    return;
                }

                if (this.won && this.draftChoices) {
                    const cardW = 220, cardH = 280, gap = 30;
                    const startX = (canvasWidth - (3 * cardW + 2 * gap)) / 2;
                    const cardY  = 200;
                    for (let i = 0; i < this.draftChoices.length; i++) {
                        const cx = startX + i * (cardW + gap);
                        if (mx >= cx && mx <= cx + cardW && my >= cardY && my <= cardY + cardH) {
                            playerStats.deck.push(this.draftChoices[i]);
                            this.draftChoices = null;
                            break;
                        }
                    }
                }
            });
        }
    }

    startOrRestart() {
        if (this.won && this.draftChoices) return;
        if (this.waiting || this.won) {
            this.targetingMode      = null;
            this._pendingTargetCard = null;
            this.player   = new Player(playerStats);
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
            this.lastReward     = false;
        }
    }

    grantReward() {
        if (this._rewardGranted) return;
        this._rewardGranted = true;
        playerStats.level += 1;
        playerStats.xp    += playerStats.level % 3 === 0 ? 300 : 0;
        this.lastStageReward    = playerStats.level % 3 === 0;
        this.lastReward         = null;
        this.draftChoices       = null;
        this.instructionsScreen = true;
    }

    update() {
        if (this.waiting || this.won) return;

        const solidWalls = this.mainBase.living;
        this.player.update(solidWalls);

        this.player.isAttacking = false;
        this.player.targetHp    = null;

        for (const outpost of this.outposts) {
            if (outpost.alive) this.player.tryAttack(outpost);
        }

        if (this.outpostsCleared) {
            for (const seg of this.mainBase.living) {
                this.player.tryAttack(seg);
            }
        }

        const iz = this.mainBase.innerZone;
        const playerInside = (
            this.player.x + this.player.width  > iz.x &&
            this.player.x                       < iz.x + iz.width  &&
            this.player.y + this.player.height  > iz.y &&
            this.player.y                       < iz.y + iz.height
        );
        if (playerInside) {
            this.grantReward();
            this.won = true;
        }

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

        for (const outpost of this.outposts) {
            const b = outpost.tryShoot(this.player);
            if (b) this.bullets.push(b);
        }

        for (const seg of this.mainBase.living) {
            const b = seg.tryShoot(this.player);
            if (b) this.bullets.push(b);
        }

        for (const b of this.bullets) {
            b.update();
            if (!b.dead && b.overlaps(this.player)) {
                const dmg = Math.max(1, b.damage - (playerStats.dmgReduction || 0));
                this.player.hp -= dmg;
                if (this.player.hp < 0) this.player.hp = 0;
                b.dead = true;
            }
        }
        this.bullets = this.bullets.filter(b => !b.dead);

        if (this.player.hp <= 0) {
            this._deathXP    = playerStats.xp;
            this._deathLevel = playerStats.level;
            playerStats = { speedMod: 1.0, maxHp: 100, level: 0, xp: 0, dmgReduction: 0, deck: createStarterDeck() };
            this.draftChoices       = null;
            this.targetingMode      = null;
            this._pendingTargetCard = null;
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
        if (this.tutorial.active) this.drawTutorialHUD(ctx);

        if (this.notifTimer > 0) this.drawEventNotif(ctx);
        if (this.targetingMode)  this.drawTargeting(ctx);

        if (this.waiting && this._died) {
            this.drawDeathScreen();
        } else if (this.waiting && !this.tutorial.active) {
            this.drawOverlay("WELCOME TO TUTORIAL", "PRESS SPACE TO START", "#4af");
        } else if (this.won) {
            if (this.instructionsScreen) {
                this.drawOverlay("GREAT JOB", "Now, when you beat a level, you will be able to select one card for next rounds", "lime");
            } else if (this.draftChoices) {
                this.drawDraft(ctx);
            } else {
                this.drawOverlay("TUTORIAL COMPLETED", "YOU ARE NOW READY TO TAKE OVER THE WORLD", "lime");
                document.getElementById("backBtn").style.display = "block";
            }
        }
    }

    drawTargeting(ctx) {
        ctx.fillStyle = "rgba(255, 200, 0, 0.08)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.strokeStyle = "#ff0";
        ctx.lineWidth = 3;
        for (const o of this.outposts) {
            if (o.alive) ctx.strokeRect(o.x - 2, o.y - 2, o.width + 4, o.height + 4);
        }
        ctx.strokeStyle = "rgba(255,255,0,0.8)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.mouseX - 10, this.mouseY); ctx.lineTo(this.mouseX + 10, this.mouseY);
        ctx.moveTo(this.mouseX, this.mouseY - 10); ctx.lineTo(this.mouseX, this.mouseY + 10);
        ctx.stroke();
        ctx.textAlign = "center";
        ctx.fillStyle = "#ff0";
        ctx.font = "18px monospace";
        ctx.fillText("TARGETING — Click an outpost", canvasWidth / 2, 24);
        ctx.fillStyle = "#fff";
        ctx.font = "14px monospace";
        ctx.fillText("Press E to exit targeting mode", canvasWidth / 2, 46);
    }

    drawDraft(ctx) {
        ctx.fillStyle = "rgba(0,0,0,0.78)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.textAlign = "center";
        ctx.fillStyle = "lime";
        ctx.font = "44px monospace";
        ctx.fillText("BASE DESTROYED", canvasWidth / 2, 90);
        ctx.fillStyle = "#ffdd57";
        ctx.font = "24px monospace";
        ctx.fillText("CLICK A CARD TO SELECT", canvasWidth / 2, 140);

        if (this.lastStageReward) {
            ctx.fillStyle = "#4f4";
            ctx.font = "16px monospace";
            ctx.fillText(`STAGE COMPLETE — +300 XP  (total: ${playerStats.xp})`, canvasWidth / 2, 168);
        }

        const cardW = 220, cardH = 280, gap = 30;
        const startX = (canvasWidth - (3 * cardW + 2 * gap)) / 2;
        const y = 200;
        ctx.textAlign = "left";
        for (let i = 0; i < this.draftChoices.length; i++) {
            const c = this.draftChoices[i];
            const x = startX + i * (cardW + gap);
            const hovered = this.mouseX >= x && this.mouseX <= x + cardW &&
                            this.mouseY >= y  && this.mouseY <= y  + cardH;
            ctx.fillStyle = "rgba(20,20,20,0.95)";
            ctx.fillRect(x, y, cardW, cardH);
            if (hovered) {
                ctx.fillStyle = "rgba(255,255,255,0.07)";
                ctx.fillRect(x, y, cardW, cardH);
            }
            ctx.strokeStyle = hovered ? "#fff" : (c.color || "#fff");
            ctx.lineWidth = hovered ? 5 : 3;
            ctx.strokeRect(x, y, cardW, cardH);
            ctx.fillStyle = c.color || "#fff";
            ctx.font = "18px monospace";
            ctx.fillText(c.name, x + 12, y + 32);
            ctx.fillStyle = "#888";
            ctx.font = "12px monospace";
            ctx.fillText(c.type, x + 12, y + 56);
            ctx.fillStyle = "#ddd";
            ctx.font = "13px monospace";
            const words = c.description.split(" ");
            let line = "", ly = y + 86;
            for (const w of words) {
                const test = line ? line + " " + w : w;
                if (test.length > 22) {
                    ctx.fillText(line, x + 12, ly);
                    ly += 18;
                    line = w;
                } else line = test;
            }
            if (line) ctx.fillText(line, x + 12, ly);
        }
        ctx.textAlign = "center";
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
        ctx.font = "14px monospace";
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

        const barW    = 160, barH = 12;
        const barX    = 12,  barY = canvasHeight - 28;
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

        if (playerStats.dmgReduction > 0) {
            ctx.fillStyle = "#aaa";
            ctx.fillText(`DR ${playerStats.dmgReduction}`, barX + 170, barY + 9);
        }

        this.drawHand(ctx);
    }

    drawTutorialHUD(ctx) {
        ctx.save();

        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.strokeStyle = "#0ff";
        ctx.fillStyle   = "#0ff";
        ctx.lineWidth   = 2;
        ctx.font        = "14px monospace";

        if (this.tutorial.step == 0) {
            ctx.beginPath();
            ctx.moveTo(this.player.x, this.player.y);
            ctx.lineTo(this.player.x - 80, this.player.y - 80);
            ctx.stroke();
            ctx.fillText("YOU (WASD to move)", this.player.x - 180, this.player.y - 90);
        }

        if (this.tutorial.step == 1) {
            const o = this.outposts[0];
            if (o) {
                ctx.beginPath();
                ctx.moveTo(o.x + o.width / 2, o.y + o.height / 2);
                ctx.lineTo(o.x + 100, o.y - 60);
                ctx.stroke();
                ctx.fillText("OUTPOST (touch to attack and lookout from bullets)", o.x + 110, o.y - 70);
            }
        }

        if (this.tutorial.step == 2) {
            const base = this.mainBase;
            ctx.beginPath();
            ctx.moveTo(base.cx, base.cy);
            ctx.lineTo(base.cx + 120, base.cy);
            ctx.stroke();
            ctx.fillText("MAIN BASE (destroy all outposts first)", base.cx + 130, base.cy + 5);
        }

        if (this.tutorial.step == 3) {
            const iz = this.mainBase.innerZone;
            ctx.beginPath();
            ctx.moveTo(iz.x + iz.width / 2, iz.y + iz.height / 2);
            ctx.lineTo(iz.x + iz.width / 2, iz.y - 60);
            ctx.stroke();
            ctx.fillText("ENTER HERE TO WIN, YOU DON'T NEED TO DESTROY ALL WALLS", iz.x + iz.width / 2 - 170, iz.y - 70);
        }

        if (this.tutorial.step == 4) {
            ctx.beginPath();
            ctx.moveTo(100, canvasHeight - 40);
            ctx.lineTo(200, canvasHeight - 100);
            ctx.stroke();
            ctx.fillText("HP (your health)", 210, canvasHeight - 110);
        }

        if (this.tutorial.step == 5) {
            ctx.beginPath();
            ctx.moveTo(220, 140);
            ctx.lineTo(60, 40);
            ctx.stroke();
            ctx.fillText("HUD: Outposts left, current objective, and wall segments", 230, 150);
        }

        if (this.tutorial.step == 6) {
            ctx.beginPath();
            ctx.moveTo(canvasWidth - 120, 20);
            ctx.lineTo(canvasWidth - 300, 100);
            ctx.stroke();
            ctx.fillText("This shows your LEVEL", canvasWidth - 470, 120);
            ctx.fillText("and current DIFFICULTY", canvasWidth - 470, 140);
        }

        if (this.tutorial.step == 7) {
            ctx.beginPath();
            ctx.moveTo(canvasWidth / 2, canvasHeight - 30);
            ctx.lineTo(canvasWidth / 2, canvasHeight - 120);
            ctx.stroke();
            ctx.fillText("CARDS (press 1-5)", canvasWidth / 2 - 70, canvasHeight - 130);
        }

        if (this.tutorial.step == 8) {
            ctx.beginPath();
            ctx.moveTo(100, canvasHeight - 40);
            ctx.lineTo(200, canvasHeight - 100);
            ctx.stroke();
            ctx.fillText("Looks like your HP is kind of low...", 210, canvasHeight - 110);

            ctx.beginPath();
            ctx.moveTo(canvasWidth / 2, canvasHeight - 70);
            ctx.lineTo(canvasWidth / 2, canvasHeight - 120);
            ctx.stroke();
            ctx.fillText("Try using the healing card to fix that (KEY 1)", canvasWidth / 2 - 70, canvasHeight - 130);
        }

        if (this.tutorial.step == 9) {
            ctx.beginPath();
            ctx.moveTo(100, canvasHeight - 40);
            ctx.lineTo(200, canvasHeight - 100);
            ctx.stroke();
            ctx.fillText("You healed up! Thats a card effect", 210, canvasHeight - 110);
        }

        if (this.tutorial.step == 10) {
            ctx.beginPath();
            ctx.moveTo(canvasWidth / 2, canvasHeight - 30);
            ctx.lineTo(canvasWidth / 2, canvasHeight - 120);
            ctx.stroke();
            ctx.fillText("Keep playing to find new cards and new effects", canvasWidth / 2 - 180, canvasHeight - 130);
        }

        if (this.tutorial.step == 11) {
            ctx.fillText("Now try to beat the level with what you have learned!", canvasWidth / 2 - 190, canvasHeight - 600);
        }

        ctx.fillStyle = "#fff";
        ctx.font = "18px monospace";
        ctx.textAlign = "center";
        ctx.fillText("FOLLOW THE TUTORIAL STEPS", canvasWidth / 2, 40);
        ctx.fillText("PRESS SPACE TO CONTINUE THRU STEPS", canvasWidth / 2, 60);
        ctx.restore();
    }

    drawHand(ctx) {
        const deck = playerStats.deck || [];
        const cardW = 130, cardH = 60, gap = 10;
        const totalW = deck.length * cardW + Math.max(0, deck.length - 1) * gap;
        const startX = (canvasWidth - totalW) / 2;
        const y = canvasHeight - cardH - 8;
        ctx.textAlign = "left";
        for (let i = 0; i < deck.length; i++) {
            const c = deck[i];
            const x = startX + i * (cardW + gap);
            ctx.fillStyle = "rgba(0,0,0,0.75)";
            ctx.fillRect(x, y, cardW, cardH);
            ctx.strokeStyle = c.color || "#fff";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, cardW, cardH);
            ctx.fillStyle = c.color || "#fff";
            ctx.font = "12px monospace";
            ctx.fillText(`[${i+1}] ${c.name}`, x + 6, y + 16);
            ctx.fillStyle = "#ccc";
            ctx.font = "10px monospace";
            const desc = c.description;
            const maxChars = 20;
            let line1 = desc, line2 = "";
            if (desc.length > maxChars) {
                const cut = desc.lastIndexOf(" ", maxChars);
                line1 = desc.slice(0, cut);
                line2 = desc.slice(cut + 1);
            }
            ctx.fillText(line1, x + 6, y + 34);
            if (line2) ctx.fillText(line2, x + 6, y + 48);
        }
    }

    drawEventNotif(ctx) {
        const alpha = Math.min(1, this.notifTimer / 30);
        ctx.fillStyle = `rgba(255, 140, 0, ${alpha * 0.85})`;
        ctx.fillRect(0, canvasHeight / 2 - 60, canvasWidth, 90);
        ctx.textAlign = "center";
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.font = "32px monospace";
        ctx.fillText("RANDOM EVENT ACTIVATED", canvasWidth / 2, canvasHeight / 2 - 18);
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
        ctx.fillText(`TOTAL XP: ${this._deathXP}`, canvasWidth / 2, canvasHeight / 2 - 20);
        ctx.fillStyle = "#aaa";
        ctx.font      = "18px monospace";
        ctx.fillText(`Reached Level ${this._deathLevel}`, canvasWidth / 2, canvasHeight / 2 + 20);
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