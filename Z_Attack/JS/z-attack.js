//Game Z_ATTACK
//By: Luis Jaime Arias Sarabia, Adolfo Hernández Sánchez and Alonso Arechiga Mendoza

"use strict";

const canvasWidth  = 1000;
const canvasHeight = 750;
const PLAYER_SPEED = 6; // Player base movement speed
const PLAYER_DMG   = 100; // Player base melee damage per hit

const OUTPOST_COUNT = 50;

let playerStats = {
    heroId: null,
    speedMod: 1.0, // Speed multiplier
    maxHp: 100, // Player maximum HP
    bonuses: [], 
    level: 0, // Current level
    stage: 0, // Current stage (advances every 3 levels)
    xp: 0, // Total accumulated experience points
    dmgReduction: 0, //Flat damage reduction applied to incoming hits
    deck: createStarterDeck() //Player's current card hand

};

// Applies a hero's base stats onto playerStats (called at selection and on death-reset)
function applyHeroStats(heroId) {
    const hero = getHeroById(heroId);
    if (!hero) return;
    playerStats.heroId       = hero.id;
    playerStats.speedMod     = hero.speedMod;
    playerStats.maxHp        = hero.maxHp;
    playerStats.dmgReduction = hero.dmgReduction; // dmgMult is read directly from the hero definition at attack time
}


// Calculates the difficulty multiplier based on the current level (temp)
function getDifficultyMult(){
    const doublings = Math.floor(playerStats.level / 3);
    return Math.pow(2,doublings);
}

let ctx;
let game;

// Represents the character. Handles movement, wall collisions, melee attacks, and rendering
class Player {
    constructor(stats = { speedMod: 1.0, maxHp: 100 }) {
        this.width  = 28;
        this.height = 28;
        this.x = 0;
        this.y = 0;
        const hero   = getHeroById(stats.heroId);
        const mult   = hero ? hero.dmgMult : 1.0;
        this.damage = (PLAYER_DMG*mult);
        this.color = hero ? hero.color : "#4af";
        this.keys   = { up: false, down: false, left: false, right: false };

        this.attackCooldown    = 0;  // Attack cooldown prevents dealing damage every single frame
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

    // Moves the player and makes wall collisions
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

    // Does an attack on a target if the player is touching it and the cooldown has expired
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

// Class form projectiles fired by outposts or wall segments
class Bullet {
    constructor(x, y, vx, vy, damage, color = "#f84") {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = 1;
        this.damage = damage;  // Damage dealt to the player on impact
        this.color = color;
        this.width = 6;
        this.height = 6;
        this.dead = false; // Flag for bullet if still active
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

// Class for the tiles of the main base wall
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

        // Logic for scaling the shoot cooldown
        this.shootCooldownMax = Math.floor(Math.random() * (cdMax - cdMin + 1)) + cdMin;
        this.shootCooldown    = Math.floor(Math.random() * this.shootCooldownMax); // Random so they don't all fire simultaneously        
        this.shootRange = 300;
        this.side = "top";
        
    }

    get alive() { return this.hp > 0; }

    // Fires a bullet at the player if they are within range and on the correct side of the wall
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
        const speed = 4;
        const nx = (px - cx) / dist;
        const ny = (py - cy) / dist;
        // 1/6 of player max HP
        return new Bullet(cx - 3, cy - 3, nx * speed, ny * speed, 5 ,"#f44");
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

// Class for the main base of the level
class MainBase {
    constructor(cx, cy) {
        this.segments = []; // All wall segments
        this.cx = cx;
        this.cy = cy;
        this.buildWall(cx, cy);
    }

    // Places WallSegment tiles only on the outer edge
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

                 // Assign side so it knows in which direction it is allowed to shoot
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

//Class for all the enemy outposts scattered thru the map
class Outpost {
    constructor(x, y) {
        this.x      = x;
        this.y      = y;
        this.width  = 40;
        this.height = 40;
        this.maxHp  = 99;
        this.hp     = this.maxHp;

        // Shoot cooldown scaled by difficulty
        const mult   = getDifficultyMult();
        const cdMin  = Math.max(Math.floor(60  / mult), 10);   // 60 → 30 → 15 → ...
        const cdMax  = Math.max(Math.floor(180 / mult), cdMin + 1); // 180 → 90 → 45 → ...
        this.shootCooldownMax = Math.floor(Math.random() * (cdMax - cdMin + 1)) + cdMin;
        this.shootCooldown    = Math.floor(Math.random() * this.shootCooldownMax);

        this.shootRange = 200; // Detection range
    }

    get alive() { return this.hp > 0; }

    // Fires at the player if they are in range
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
        const speed = 3;
        const nx = (px - cx) / dist;
        const ny = (py - cy) / dist;
        // 1/8 of player max HP
        return new Bullet(cx - 3, cy - 3, nx * speed, ny * speed, 5 ,    "#f84");
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

// Class for the hero selection
class HeroSelect {
    constructor() {
        this.active   = true; // True while the selection screen is showing
        this.hoveredId = null; // Hero ID under the mouse cursor
        this.heroIds = Object.values(HEROES).map(h => h.id); //1,2,3...
    }
 
    // Returns the layout rectangle for hero card i
    cardRect(i) {
        const cardW  = 240;
        const cardH  = 340;
        const gap    = 40;
        const count  = this.heroIds.length;
        const totalW = count * cardW + (count - 1) * gap;
        const startX = (canvasWidth - totalW) / 2;
        return {
            x: startX + i * (cardW + gap),
            y: canvasHeight / 2 - cardH / 2,
            w: cardW,
            h: cardH
        };
    }
 
    // Called on every mousemove — updates which card is hovered
    onMouseMove(mx, my) {
        this.hoveredId = null;
        for (let i = 0; i < this.heroIds.length; i++) {
            const r = this.cardRect(i);
            if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
                this.hoveredId = this.heroIds[i];
                break;
            }
        }
    }
 
    // Called on mousedown — selects the clicked hero and closes the screen
    onMouseDown(mx, my) {
        for (let i = 0; i < this.heroIds.length; i++) {
            const r = this.cardRect(i);
            if (mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h) {
                applyHeroStats(this.heroIds[i]);
                this.active = false;
                return;
            }
        }
    }
 
    draw(ctx) {
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        for (let x = 20; x < canvasWidth; x += 40)
            for (let y = 20; y < canvasHeight; y += 40)
                ctx.fillRect(x, y, 1, 1);
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = "36px monospace";
        ctx.fillText("CHOOSE YOUR HERO", canvasWidth / 2, 80);
        ctx.fillStyle = "#555";
        ctx.font = "14px monospace";
        ctx.fillText("click a card to start", canvasWidth / 2, 112);
 
        // Hero cards
        for (let i = 0; i < this.heroIds.length; i++) {
            const hero = getHeroById(this.heroIds[i]); 
            const r       = this.cardRect(i);
            const hovered = this.hoveredId === hero.id;
 
            // Card background
            ctx.fillStyle = hovered ? "rgba(40,40,40,0.98)" : "rgba(20,20,20,0.95)";
            ctx.fillRect(r.x, r.y, r.w, r.h);
 
            // Card border
            ctx.strokeStyle = hovered ? "#fff" : hero.cardColor;
            ctx.lineWidth   = hovered ? 4 : 2;
            ctx.strokeRect(r.x, r.y, r.w, r.h);
 
            // Hero color swatch (small square icon at the top of the card)
            const swatchSize = 44;
            const swatchX    = r.x + r.w / 2 - swatchSize / 2;
            const swatchY    = r.y + 24;
            ctx.fillStyle    = hero.color;
            ctx.fillRect(swatchX, swatchY, swatchSize, swatchSize);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth   = 1.5;
            ctx.strokeRect(swatchX, swatchY, swatchSize, swatchSize);
 
            // Hero name
            ctx.fillStyle = hero.cardColor;
            ctx.font = "20px monospace";
            ctx.textAlign = "center";
            ctx.fillText(hero.name, r.x + r.w / 2, r.y + 98);
 
            // Description — word-wrapped at ~26 chars per line
            ctx.fillStyle = "#aaa";
            ctx.font = "12px monospace";
            const words = hero.description.split(" ");
            let line = "", ly = r.y + 124;
            for (const w of words) {
                const test = line ? line + " " + w : w;
                if (test.length > 26) {
                    ctx.fillText(line, r.x + r.w / 2, ly);
                    ly += 17;
                    line = w;
                } else line = test;
            }
            if (line) { ctx.fillText(line, r.x + r.w / 2, ly); ly += 17; }
 
            // Stat bars
            const stats = [
                { label: "HP",     value: hero.maxHp,       min: 60,  max: 220 },
                { label: "Speed",  value: hero.speedMod,    min: 0.5, max: 1.6 },
                { label: "Damage", value: hero.dmgMult,     min: 0.5, max: 1.5 },
                { label: "Armor",  value: hero.dmgReduction,min: 0,   max: 3   },
            ];
 
            const barW  = r.w - 32;
            const barH  = 8;
            const barX  = r.x + 16;
            let   statY = ly + 16;
 
            for (const stat of stats) {
                const ratio = (stat.value - stat.min) / (stat.max - stat.min);
 
                ctx.fillStyle = "#333";
                ctx.fillRect(barX, statY, barW, barH);
 
                ctx.fillStyle = hero.cardColor;
                ctx.fillRect(barX, statY, barW * ratio, barH);
 
                ctx.fillStyle = "#666";
                ctx.font = "10px monospace";
                ctx.textAlign = "left";
                ctx.fillText(stat.label, barX, statY - 2);
 
                statY += 24;
            }
 
            ctx.textAlign = "center";
        }
    }
}


//Main game class
class Game {
    constructor() {
        this.heroSelect = new HeroSelect();
        this.player   = new Player();
        this.mainBase = new MainBase(canvasWidth / 2, canvasHeight / 2);
        this.outposts = [];
        this.bullets  = [];
        this.won      = false;
        this.waiting  = true;
        this._died    = false;
        

        this.randomEventActive    = false;
        this.randomEventTriggered = false;
        this.notifTimer           = 0;
        this.notifDuration        = 180;

        // Card system state
        this.targetingMode = null;
        this.draftChoices  = null;
        this._pendingTargetCard = null;

        // Mouse cursor position in canvas-space coordinates
        this.mouseX = 0;
        this.mouseY = 0;

        this.spawnOutposts();
        this.spawnPlayer();
        this.createEventListeners();
        this._rewardGranted = false;
        this.lastReward = null;
        this._runStartTime = Date.now();
    }

    // Places the player at a random map position, ensuring they do not appear inside or directly besides the main base
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

    // Places outposts around the map while avoiding the main base and overlapping with each other
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

            // Random base of 5–10 multiplied by difficulty capped at 60
            const mult = getDifficultyMult();
            const count = Math.min(
                Math.floor((Math.floor(Math.random() * 6 ) + 5 ) * mult )
                ,60
            );
        

        for (let i = 0; i < count; i++) {
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
            // Ignore all keyboard input while the hero selection screen is active
            if (this.heroSelect.active) return;
            // Draft pick takes priority when active — selection is via mouse click
            if (this.won && this.draftChoices) return;
            // Cancel targeting with E (refund the card)
            if (this.targetingMode && e.code === "KeyE") {
                if (this._pendingTargetCard) {
                    playerStats.deck.push(this._pendingTargetCard);
                    this._pendingTargetCard = null;
                }
                this.targetingMode = null;
                return;
            }
            // Play card from hand by index 1-5
            if (!this.waiting && !this.won && !this.targetingMode &&
                ["Digit1","Digit2","Digit3","Digit4","Digit5"].includes(e.code)) {
                const idx = parseInt(e.code.slice(-1), 10) - 1;
                if (idx >= 0 && idx < playerStats.deck.length) {
                    const card = playerStats.deck.splice(idx, 1)[0]; // Remove card from hand
                    if (card.targeting) this._pendingTargetCard = card;
                    card.apply(this);
                }
                return;
            }
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

        const canvas = document.getElementById("canvas");
        if (canvas) {
            // Track mouse position in canvas coordinates
            canvas.addEventListener("mousemove", (e) => {
                const rect = canvas.getBoundingClientRect();
                const mx = (e.clientX - rect.left) * (canvasWidth  / rect.width);
                const my = (e.clientY - rect.top)  * (canvasHeight / rect.height);
                this.mouseX = mx;
                this.mouseY = my;
                // Forward mouse position to hero select while it is active
                if (this.heroSelect.active) this.heroSelect.onMouseMove(mx, my);
            });
            canvas.addEventListener("mousedown", (e) => {
                const rect = canvas.getBoundingClientRect();
                const mx = (e.clientX - rect.left) * (canvasWidth  / rect.width);
                const my = (e.clientY - rect.top)  * (canvasHeight / rect.height);

                // Hero selection intercepts all clicks while active
                if (this.heroSelect.active) {
                    this.heroSelect.onMouseDown(mx, my);
                    // If selection just completed, build the player with the chosen hero stats
                    if (!this.heroSelect.active) {
                        this.player = new Player(playerStats);
                        this.spawnPlayer();
                    }
                    return;
                }

                // Targeting mode that instantly destroys the clicked outpost logic
                if (this.targetingMode === "destroy_outpost") {
                    for (const o of this.outposts) {
                        if (o.alive &&
                            mx >= o.x && mx <= o.x + o.width &&
                            my >= o.y && my <= o.y + o.height) {
                            o.hp = 0;
                            this.targetingMode = null;
                            this._pendingTargetCard = null;
                            break;
                        }
                    }
                    return;
                }
                // Click detection for one of the 3 displayed cards
                if (this.won && this.draftChoices) {
                    const cardW = 220, cardH = 280, gap = 30;
                    const startX = (canvasWidth - (3 * cardW + 2 * gap)) / 2;
                    const cardY = 200;
                    for (let i = 0; i < this.draftChoices.length; i++) {
                        const cx = startX + i * (cardW + gap);
                        if (mx >= cx && mx <= cx + cardW && my >= cardY && my <= cardY + cardH) {
                            playerStats.deck.push(this.draftChoices[i]); // Add chosen card to hand
                            this.draftChoices = null;
                            break;
                        }
                    }
                }
            });
        }
    }

    // Resets all game entities and states for a new round
    startOrRestart() {
        if (this.heroSelect.active) return; // Can't start before picking a hero
        // Block restart while a draft is still pending
        if (this.won && this.draftChoices) return;
        if (this.waiting || this.won) {
            this.targetingMode = null;
            this._pendingTargetCard = null;
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
            if (this.waiting) this._runStartTime = Date.now();
        }
    }

   
    // Awards win reward. Increments level, checks for stage completion XP bonus, and generates 3 card choices for the draft screen
    grantReward() {
        if (this._rewardGranted) return;
        this._rewardGranted = true;

        playerStats.level += 1;
        this.levelnum = playerStats.level; 
        playerStats.stage = Math.floor(playerStats.level / 3) // New stage every 3 levels

        
        // Stage completion XP bonus
        if (playerStats.level % 3 === 0) {
            playerStats.xp += 300;
            this.lastStageReward = true;
        } else {
            this.lastStageReward = false;
        }

        // Card draft replaces the old random speed/HP reward
        this.lastReward = null;
        this.draftChoices = getDraftChoices();
    }

    update() {
        // Freeze game logic while hero select or any waiting/won state is active
        if (this.heroSelect.active || this.waiting || this.won) return;

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

        /*
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
            */
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
                const dmg = Math.max(1, b.damage - (playerStats.dmgReduction || 0));
                this.player.hp -= dmg;
                if (this.player.hp < 0) this.player.hp = 0;
                b.dead = true;
            }
        }
        this.bullets = this.bullets.filter(b => !b.dead);

        // Game over when player HP hits 0
        if (this.player.hp <= 0) {
            this._deathXP = playerStats.xp;
            this._deathLevel = playerStats.level;
            this._deathStage = playerStats.stage;
             const savedHeroId = playerStats.heroId;

            const stored = localStorage.getItem('sessionUser');
            const sessionUser = stored ? JSON.parse(stored) : null;
            if (sessionUser && sessionUser.user_ID !== 0) {
                const playtime = this._runStartTime ? Math.floor((Date.now() - this._runStartTime) / 1000) : 0;
                console.log("Match playtime:", playtime);
                console.log("Started: ", this._runStartTime);
                console.log("Ended: ", Date.now())
                fetch('http://localhost:8081/saveStats', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_ID: sessionUser.user_ID,
                        score: this._deathXP,
                        level: this._deathLevel,
                        playtime: playtime
                    })
                });
            }

            playerStats = { speedMod: 1.0, maxHp: 100, bonuses: [], level: 0, stage:0, xp:0, dmgReduction: 0, deck: createStarterDeck() };
            applyHeroStats(savedHeroId); // Re-apply hero base stats after reset
            this.draftChoices = null;
            this.targetingMode = null;
            this._pendingTargetCard = null;
            this.won     = false;
            this.waiting = true;
            this._died   = true;
        }

    }

    draw(ctx) {
        // Hero selection screen takes over the entire canvas
        if (this.heroSelect.active) {
            this.heroSelect.draw(ctx);
            return;
        }

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

        if (this.targetingMode) this.drawTargeting(ctx);

        if (this.waiting && this._died) {
            this.drawDeathScreen();
        } else if (this.waiting) {
            this.drawOverlay("BASE ASSAULT", "PRESS SPACE TO START", "#4af");
        } else if (this.won) {
            if (this.draftChoices) {
                this.drawDraft(ctx);
            } else {
                this.drawOverlay("BASE DESTROYED", "PRESS SPACE TO PLAY AGAIN", "lime");
            }
        }
    }

    // Draws a yellow outline to all living outposts so the player can click one to destroy it (card effect)
    // Also draws a cursor at the current mouse position
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

    // Displays the 3-card selection screen after winning a level, cards highlight on hover to indicate interactivity.
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
        const totalW = 3 * cardW + 2 * gap;
        const startX = (canvasWidth - totalW) / 2;
        const y = 200;
        ctx.textAlign = "left";
        for (let i = 0; i < this.draftChoices.length; i++) {
            const c = this.draftChoices[i];
            const x = startX + i * (cardW + gap);
            const hovered = this.mouseX >= x && this.mouseX <= x + cardW &&
                            this.mouseY >= y && this.mouseY <= y + cardH;
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

     // Renders the display 
    drawHUD(ctx) {
        ctx.font      = "14px monospace";
        const mult = getDifficultyMult(); 

        // Difficulty indicator
        ctx.fillStyle = mult >= 4 ? "#f44" : mult >= 2 ? "#fa0" : "#aaa";  
        ctx.textAlign = "right";   
        ctx.fillText(`level ${playerStats.level + 1}   ×${mult} difficulty`, canvasWidth - 12, 22);
        ctx.textAlign = "left";

        // Remaining enemy counts
        const outpostsLeft = this.outposts.filter(o => o.alive).length;
        const wallsLeft    = this.mainBase.living.length;
        ctx.fillStyle = "#aaa";
        ctx.fillText(`Outposts remaining : ${outpostsLeft}`, 12, 22);
        ctx.fillText(`Wall segments left : ${wallsLeft}`,    12, 42);

        // Objective message
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

        if (playerStats.dmgReduction > 0) {
            ctx.fillStyle = "#aaa";
            ctx.fillText(`DR ${playerStats.dmgReduction}`, barX + 170, barY + 9);
        }

        this.drawHand(ctx);
    }

    // Renders the card hand on the bottom of the canvas.
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
        ctx.fillText(" RANDOM EVENT ACTIVATED", canvasWidth / 2, canvasHeight / 2 - 18);
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
        ctx.fillText(`Reached Level ${this._deathLevel}  —  Stage ${this._deathStage}`, canvasWidth / 2, canvasHeight / 2 + 20);

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