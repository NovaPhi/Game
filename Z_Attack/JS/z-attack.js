//Game Z_ATTACK
//By: Luis Jaime Arias Sarabia, Adolfo Hernández Sánchez and Alonso Arechiga Mendoza

(function applySettings() {
    const brightness = localStorage.getItem('brightness') ?? 100;
    const colorblind = localStorage.getItem('colorblind') || 'none';

    document.body.style.filter = `brightness(${brightness}%)`;

    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (colorblind !== 'none') document.body.classList.add(colorblind);
})();

"use strict";

const canvasWidth  = 1000;
const canvasHeight = 750;
const PLAYER_SPEED = 6; // Player base movement speed
const PLAYER_DMG   = 100; // Player base melee damage per hit

const OUTPOST_COUNT = 50;

const THEMES = [
    { name: "House",    bg: "../Assets/bg_house.png",    base: "../Assets/base_house.png"    },
    { name: "Mall",     bg: "../Assets/bg_mall.png",     base: "../Assets/base_mall.png"     },
    { name: "Hospital", bg: "../Assets/bg_hospital.png", base: "../Assets/base_hospital.png" },
    { name: "Military", bg: "../Assets/bg_military.png", base: "../Assets/base_military.png" },
];

let playerStats = {
    heroId: null,
    speedMod: 1.0, // Speed multiplier
    maxHp: 100, // Player maximum HP
    bonuses: [], 
    level: 0, // Current level
    stage: 0, // Current stage (advances every 3 levels)
    xp: 0, // Total accumulated experience points
    dmgReduction: 0, //Flat damage reduction applied to incoming hits
    deck: [] //Player's current card hand
    

};

// Applies a hero's base stats onto playerStats (called at selection and on death-reset)
function applyHeroStats(heroId) {
    const hero = getHeroById(heroId);
    if (!hero) return;
    playerStats.heroId       = hero.id;
    playerStats.asset        = hero.asset;
    playerStats.speedMod     = hero.speedMod;
    playerStats.maxHp        = hero.maxHp;
    playerStats.dmgReduction = hero.dmgReduction; // dmgMult is read directly from the hero definition at attack time
}


// Calculates the difficulty multiplier based on the current level (temp)
function getDifficultyMult(){
    const stage = Math.floor(playerStats.level / 3);
    return 1 + stage * 0.3;
}

function randomBaseCenter() {
    const half   = Math.ceil(236 / 2); // 118 px — half the grid size
    const margin = 20; // extra breathing room from canvas edge
    const minX   = half + margin;
    const maxX   = canvasWidth  - half - margin;
    const minY   = half + margin;
    const maxY   = canvasHeight - half - margin;
    return {
        cx: Math.floor(Math.random() * (maxX - minX + 1)) + minX,
        cy: Math.floor(Math.random() * (maxY - minY + 1)) + minY,
    };
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
        this.paralyzedUntil = 0; // bear trap freeze (ms timestamp)
        if(playerStats.asset){
            this._img = new Image();
            this._img.src = playerStats.asset;
        }else{
            this._img = null;
        }
    }

    // Moves the player and makes wall collisions
    update(walls, dt = 1) {
        const paralyzed = performance.now() < this.paralyzedUntil;
        const spd = paralyzed ? 0 : PLAYER_SPEED * this.speedMod * dt;
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

        if (this.attackCooldown > 0) this.attackCooldown-= dt;
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
            if (this.attackCooldown <= 0) {
                target.hp -= this.damage;
                if (target.hp < 0) target.hp = 0;
                this.targetHp       = target.hp;
                this.attackCooldown = this.attackCooldownMax;
                if(game && game.ability) game.ability.breakInvisibility();
                return true;
            }
            return false;
        }
        return false;
    }

    draw(ctx) {
        const invis = game && game.ability && game.ability.isInvisible();
        ctx.globalAlpha = invis ? 0.3 : 1.0;
        if (playerStats.asset && this._img) {
            if (this._img.complete && this._img.naturalWidth > 0) {
                ctx.drawImage(this._img, this.x, this.y, this.width, this.height);
            } else {
                // fallback while image loads
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        } else {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.globalAlpha = 1.0;
    }
}

// Class form projectiles fired by outposts or wall segments
class Bullet {
    constructor(x, y, vx, vy, damage, width, height, diamond, color = "#f84") {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = 1;
        this.damage = damage;  // Damage dealt to the player on impact
        this.color = color;
        this.width = width;
        this.height = height;
        this.diamond = diamond;
        this.dead = false; // Flag for bullet if still active
    }

    update(dt = 1) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
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
        if(this.diamond == false){
            if (this.dead) return;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        else{
            if (this.dead) return;
            const cx = this.x + this.width  / 2;
            const cy = this.y + this.height / 2;
            const r  = this.width / 2;
            
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(cx,     cy - r);  // top
            ctx.lineTo(cx + r, cy);      // right
            ctx.lineTo(cx,     cy + r);  // bottom
            ctx.lineTo(cx - r, cy);      // left
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(cx, cy, r * 0.35, 0, Math.PI * 2);
            ctx.fill();
        }
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
        this._bulletDamage = Math.round(5 * mult);
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
    tryShoot(player, dt = 1) {
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

        if (this.shootCooldown > 0) { this.shootCooldown-= dt; return null; }

        this.shootCooldown = this.shootCooldownMax;
        const speed = 4;
        const nx = (px - cx) / dist;
        const ny = (py - cy) / dist;
        // 1/6 of player max HP
        return new Bullet(cx - 3, cy - 3, nx * speed, ny * speed, this._bulletDamage , 6, 6, false, "#f44");
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
                const seg = (new WallSegment(x, y, Math.round(300 * getDifficultyMult())));

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
        const mult   = getDifficultyMult();
        this.maxHp  = Math.round(300 * mult);
        this.hp     = this.maxHp;
        this._bulletDamage = Math.round(5 * mult);

        // Shoot cooldown scaled by difficulty
        const cdMin  = Math.max(Math.floor(60  / mult), 10);   // 60 → 30 → 15 → ... 
        const cdMax  = Math.max(Math.floor(180 / mult), cdMin + 1); // 180 → 90 → 45 → ...
        this.shootCooldownMax = Math.floor(Math.random() * (cdMax - cdMin + 1)) + cdMin;
        this.shootCooldown    = Math.floor(Math.random() * this.shootCooldownMax);

        this.shootRange = 200; // Detection range
    }

    get alive() { return this.hp > 0; }

    // Fires at the player if they are in range
    tryShoot(player , dt = 1) {
        if (!this.alive) return null;

        const cx = this.x + this.width  / 2;
        const cy = this.y + this.height / 2;
        const px = player.x + player.width  / 2;
        const py = player.y + player.height / 2;
        const dist = Math.hypot(px - cx, py - cy);

        // Don't shoot if player is within one player-length
        if (dist < player.width) return null;
        if (dist > this.shootRange) return null;

        if (this.shootCooldown > 0) { this.shootCooldown-= dt; return null; }

        this.shootCooldown = this.shootCooldownMax;
        const speed = 3;
        const nx = (px - cx) / dist;
        const ny = (py - cy) / dist;
        // 1/8 of player max HP
        return new Bullet(cx - 3, cy - 3, nx * speed, ny * speed, this._bulletDamage , 6, 6, false,   "#f84");
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

class Burst {
    constructor(x, y) {
        this.x      = x;
        this.y      = y;
        this.width  = 40;
        this.height = 40;
        const mult   = getDifficultyMult();
        this.maxHp  = Math.round(450 * mult);
        this.hp     = this.maxHp;
        this._bulletDamage = Math.round(5 * mult);

        // Shoot cooldown scaled by difficulty
        const cdMin  = Math.max(Math.floor(60  / mult), 10);   // 60 → 30 → 15 → ... 
        const cdMax  = Math.max(Math.floor(180 / mult), cdMin + 1); // 180 → 90 → 45 → ...
        this.shootCooldownMax = Math.floor(Math.random() * (cdMax - cdMin + 1)) + cdMin;
        this.shootCooldown    = Math.floor(Math.random() * this.shootCooldownMax);

        this.shootRange = 200; // Detection range
    }

    get alive() { return this.hp > 0; }

    // Fires at the player if they are in range
    tryShoot(player, dt = 1) {
        if (!this.alive) return null;

        const cx = this.x + this.width  / 2;
        const cy = this.y + this.height / 2;
        const px = player.x + player.width  / 2;
        const py = player.y + player.height / 2;
        const dist = Math.hypot(px - cx, py - cy);

        // Don't shoot if player is within one player-length
        if (dist < player.width) return null;
        if (dist > this.shootRange) return null;

        if (this.shootCooldown > 0) { this.shootCooldown-= dt; return null; }

        this.shootCooldown = this.shootCooldownMax;
        const bullets = [];
        const speed = 3;
        const angle = Math.atan2(py - cy, px - cx);
        const spread = 0.2;
        // 1/8 of player max HP
        for (let i = -1; i <= 1; i++) {
            const a = angle + i * spread;
            const vx = Math.cos(a) * speed;
            const vy = Math.sin(a) * speed;

            bullets.push(
                new Bullet(cx - 3, cy - 3, vx, vy, this._bulletDamage, 6, 6, false, "#4af") // ⬅️ color diferente
            );
        }
        return bullets;
    }

    draw(ctx) {
        if (!this.alive) return;
        const ratio = this.hp / this.maxHp;
        ctx.fillStyle = `rgba(80, 180, 255, ${0.4 + 0.6 * ratio})`;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "#4af";
        ctx.lineWidth   = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, this.y - 8, this.width, 5);
        ctx.fillStyle = "#4af";
        ctx.fillRect(this.x, this.y - 8, this.width * ratio, 5);
        ctx.fillStyle = "#fff";
        ctx.font = "10px monospace";
        ctx.textAlign = "center";
        ctx.fillText("OUTPOST", this.x + this.width / 2, this.y + this.height / 2 + 4);
    }
}

class Sniper {
    constructor(x, y) {
        this.x      = x;
        this.y      = y;
        this.width  = 40;
        this.height = 40;
        const mult   = getDifficultyMult();
        this.maxHp  = Math.round(750 * mult);
        this.hp     = this.maxHp;

        this.WARN_FRAMES = 30;
        this.idleCooldownMax = Math.max(Math.floor(120 / mult), 40);
        this.idleCooldown = Math.floor(Math.random() * this.idleCooldownMax);

        this.shootRange = 400; // Detection range
        this._aimNx = 0;
        this._aimNy = 0;
        this._isWarning = false;
        this.bulletDamage = Math.round(35 * mult);
    }

    get alive() { return this.hp > 0; }

    // Fires at the player if they are in range
    tryShoot(player, dt = 1) {
        if (!this.alive) return null;

        const cx = this.x + this.width  / 2;
        const cy = this.y + this.height / 2;
        const px = player.x + player.width  / 2;
        const py = player.y + player.height / 2;
        const dist = Math.hypot(px - cx, py - cy);
        const inRange = dist > player.width && dist <= this.shootRange;

        if (this.idleCooldown <= 0) {
            this.idleCooldown = this.idleCooldownMax; // Reset for next cycle
            this._isWarning = false;
 
            if (this._aimNx !== 0 || this._aimNy !== 0) {
                const speed = 10;
                return new Bullet(cx - 5, cy - 5, this._aimNx * speed, this._aimNy * speed, this.bulletDamage, 10, 10, true, "#ff0");
                this._aimNx = 0;
                this._aimNy = 0;
                return bullet;
            }

        return null;
        }

        this.idleCooldown-= dt;

        if (this.idleCooldown <= this.WARN_FRAMES) {
            if (!this._isWarning) {
                if (inRange) {
                    this._isWarning = true;
                    this._aimNx = (px - cx) / dist;
                    this._aimNy = (py - cy) / dist;
                }
            }
            return null;
        } 

        this._isWarning = false;
 
        if (inRange) {
            this._aimNx = (px - cx) / dist;
            this._aimNy = (py - cy) / dist;
        } else {
            this._aimNx = 0;
            this._aimNy = 0;
        }

        return null;
    }
    
    draw(ctx) {
        if (!this.alive) return;
        const ratio = this.hp / this.maxHp;
 
        ctx.fillStyle = `rgba(180, 40, 40, ${0.4 + 0.6 * ratio})`;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "#ff0";
        ctx.lineWidth   = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        const cx = this.x + this.width  / 2;
        const cy = this.y + this.height / 2;
        ctx.strokeStyle = "#ff0";
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx - 10, cy); ctx.lineTo(cx + 10, cy);
        ctx.moveTo(cx, cy - 10); ctx.lineTo(cx, cy + 10);
        ctx.stroke();
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, this.y - 8, this.width, 5);
        ctx.fillStyle = "#ff0";
        ctx.fillRect(this.x, this.y - 8, this.width * ratio, 5);
        ctx.fillStyle = "#fff";
        ctx.font = "8px monospace";
        ctx.textAlign = "center";
        ctx.fillText("SNIPER", cx, this.y + this.height - 3);
        if (this._isWarning) {
            const progress = 1 - (this.idleCooldown / this.WARN_FRAMES);
            const pulse = 0.4 + 0.6 * Math.abs(Math.sin(Date.now() / (120 - progress * 80)));
            const targetX = cx + this._aimNx * this.shootRange;
            const targetY = cy + this._aimNy * this.shootRange;
            ctx.strokeStyle = `rgba(255, 60, 60, ${pulse})`;
            ctx.lineWidth   = 1 + progress * 2; 
            ctx.setLineDash([6, 4]);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
            ctx.setLineDash([]); 
            ctx.fillStyle = `rgba(255, 60, 60, ${pulse})`;
            ctx.beginPath();
            ctx.arc(targetX, targetY, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class OmniOutpost {
    constructor(x, y) {
        this.x      = x;
        this.y      = y;
        this.width  = 40;
        this.height = 40;
        const mult   = getDifficultyMult();
        this.maxHp  = Math.round(600 * mult);
        this.hp     = this.maxHp;
        this._bulletDamage = Math.round(8 * mult);

        this.WARN_FRAMES     = 45;
        this.idleCooldownMax = Math.max(Math.floor(300 / mult), 60);
        this.idleCooldown    = Math.floor(Math.random() * this.idleCooldownMax);
        this.NUM_BULLETS     = 12;
        this._rotAngle       = 0;
    }

    get alive() { return this.hp > 0; }

    get _isWarning() {
        return this.idleCooldown <= this.WARN_FRAMES && this.idleCooldown > 0;
    }

    tryShoot(player, dt = 1) {
        if (!this.alive) return null;
        if (this.idleCooldown <= 0) {
            this.idleCooldown = this.idleCooldownMax; // reiniciar ciclo
            const bullets = [];
            const speed   = 2.5;
            const cx = this.x + this.width / 2;
            const cy = this.y + this.height / 2;
 
            for (let i = 0; i < this.NUM_BULLETS; i++) {
                const angle = (i / this.NUM_BULLETS) * Math.PI * 2 + this._rotAngle;
                bullets.push(new Bullet(cx - 3, cy - 3, Math.cos(angle) * speed, Math.sin(angle) * speed, this._bulletDamage, 6, 6, false, "#f60"));
            }

            this._rotAngle += Math.PI / this.NUM_BULLETS;
 
            return bullets; 
        }
 
        this.idleCooldown -= dt;
        this._rotAngle += this._isWarning ? 0.08 : 0.02;
        return null;
    }

    draw(ctx) {
        if (!this.alive) return;
        const cx = this.x + this.width  / 2;
        const cy = this.y + this.height / 2;
        const ratio = this.hp / this.maxHp;
        if (this._isWarning) {
            const progress = 1 - (this.idleCooldown / this.WARN_FRAMES); // 0→1
            const pulse    = 0.3 + 0.7 * Math.abs(Math.sin(Date.now() / 80));
            const maxR = 300;
            const r    = maxR * progress;
            ctx.strokeStyle = `rgba(255, 80, 0, ${pulse * (1 - progress * 0.5)})`;
            ctx.lineWidth   = 3 - progress * 1.5; // más fino al expandirse
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.stroke();
        }
 
        ctx.fillStyle = `rgba(60, 30, 0, ${0.7 + 0.3 * ratio})`;
        ctx.strokeStyle = this._isWarning ? "#f60" : "#a40";
        ctx.lineWidth   = this._isWarning ? 2.5 : 1.5;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
            const r = this.width / 2;
            i === 0
                ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
                : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
 
        ctx.fillStyle = "#333";
        ctx.fillRect(this.x, this.y - 8, this.width, 5);
        ctx.fillStyle = "#f60";
        ctx.fillRect(this.x, this.y - 8, this.width * ratio, 5);

        ctx.fillStyle = "#fff";
        ctx.font      = "7px monospace";
        ctx.textAlign = "center";
        ctx.fillText("OMNI", cx, this.y + this.height - 3);
    }
}

// Barrera indestructible
// Tamaño random
class Barrier {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width  = w;
        this.height = h;
        this.alive  = true;
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
        ctx.fillStyle = "#777";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "#222";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
}

// Mina de daño al contacto
class Mine {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width  = 24;
        this.height = 24;
        this.damage = 100;
        this.dead   = false;
    }

    draw(ctx) {
        if (this.dead) return;
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const r  = this.width / 2;
        ctx.fillStyle = "#a00";
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#400";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#ff5";
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Trampa de paralizis
class BearTrap {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width  = 24;
        this.height = 24;
        this.damage = 8;
        this.paralyzeMs = 3000;
        this.dead = false;
    }

    draw(ctx) {
        if (this.dead) return;
        ctx.fillStyle = "#aa6a00";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.strokeStyle = "#3a2200";
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        // jagged "teeth" along the top and bottom edges
        ctx.fillStyle = "#ddd";
        const teeth = 4;
        const tw = this.width / teeth;
        for (let i = 0; i < teeth; i++) {
            const tx = this.x + i * tw;
            ctx.beginPath();
            ctx.moveTo(tx, this.y);
            ctx.lineTo(tx + tw / 2, this.y + 5);
            ctx.lineTo(tx + tw, this.y);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(tx, this.y + this.height);
            ctx.lineTo(tx + tw / 2, this.y + this.height - 5);
            ctx.lineTo(tx + tw, this.y + this.height);
            ctx.closePath();
            ctx.fill();
        }
    }
}

// Class for the hero selection
class HeroSelect {
    constructor() {
        this.active    = true;
        this.hoveredId = null;
        this.heroIds   = Object.values(HEROES).map(h => h.id);
        this.images    = {}; // preloaded Image objects keyed by hero id

        // Preload all hero images
        for (const hero of Object.values(HEROES)) {
            if (hero.asset) {
                const img = new Image();
                img.src = hero.asset; // path comes straight from DB
                this.images[hero.id] = img;
            }
        }
    }

    cardRect(i) {
        const cardW  = 240;
        const cardH  = 400;
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
        // Background
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        for (let x = 20; x < canvasWidth; x += 40)
            for (let y = 20; y < canvasHeight; y += 40)
                ctx.fillRect(x, y, 1, 1);

        // Title
        ctx.textAlign = "center";
        ctx.fillStyle = "#fff";
        ctx.font = "36px monospace";
        ctx.fillText("CHOOSE YOUR HERO", canvasWidth / 2, 80);
        ctx.fillStyle = "#555";
        ctx.font = "14px monospace";
        ctx.fillText("click a card to start", canvasWidth / 2, 112);

        // Hero cards
        for (let i = 0; i < this.heroIds.length; i++) {
            const hero    = getHeroById(this.heroIds[i]);
            if (!hero) continue;                          // ← skip if hero not found
            const r       = this.cardRect(i);
            const hovered = this.hoveredId === hero.id;

            // Card background
            ctx.fillStyle = hovered ? "rgba(40,40,40,0.98)" : "rgba(20,20,20,0.95)";
            ctx.fillRect(r.x, r.y, r.w, r.h);

            // Card border
            ctx.strokeStyle = hovered ? "#fff" : hero.cardColor;
            ctx.lineWidth   = hovered ? 4 : 2;
            ctx.strokeRect(r.x, r.y, r.w, r.h);

            // Hero asset image (replaces the color swatch)
            const imgW  = 160;
            const imgH  = 120;
            const imgX  = r.x + r.w / 2 - imgW / 2;
            const imgY  = r.y + 16;
            const img   = this.images[hero.id];

            if (img && img.complete && img.naturalWidth > 0) {
                // Image loaded — draw it
                ctx.drawImage(img, imgX, imgY, imgW, imgH);
            } else {
                // Fallback — colored rectangle while image loads or if asset is null
                ctx.fillStyle = hero.cardColor;
                ctx.fillRect(imgX, imgY, imgW, imgH);
            }

            // Thin border around the image area
            ctx.strokeStyle = "#fff";
            ctx.lineWidth   = 1.5;
            ctx.strokeRect(imgX, imgY, imgW, imgH);

            // Hero name
            ctx.fillStyle = hero.cardColor;
            ctx.font = "20px monospace";
            ctx.textAlign = "center";
            //console.log(hero.name);
            ctx.fillText(hero.name, r.x + r.w / 2, r.y + 152); // ← pushed down for bigger image

            // Description — word-wrapped at ~26 chars per line
            ctx.fillStyle = "#aaa";
            ctx.font = "12px monospace";
            const words = hero.description.split(" ");
            let line = "", ly = r.y + 172;                       // ← pushed down too
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
                { label: "HP",     value: hero.maxHp,        min: 60,  max: 220 },
                { label: "Speed",  value: hero.speedMod,     min: 0.5, max: 1.6 },
                { label: "Damage", value: hero.dmgMult,      min: 0.5, max: 1.5 },
                { label: "Armor",  value: hero.dmgReduction, min: 0,   max: 3   },
            ];

            const barW  = r.w - 32;
            const barH  = 8;
            const barX  = r.x + 16;
            let   statY = ly + 12;

            for (const stat of stats) {
                const ratio = Math.min(1, Math.max(0,          // ← clamp 0-1 so bars never overflow
                    (stat.value - stat.min) / (stat.max - stat.min)
                ));

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
        this.barriers = [];
        this.mines    = [];
        this.traps    = [];
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
        this.spawnObstacles();
        this.spawnPlayer();
        this.createEventListeners();
        this._rewardGranted = false;
        this.lastReward = null;
        this._runStartTime = Date.now();
        this.ability = new HeroAbility(playerStats.heroId || 1);

        this._bgImages = THEMES.map(t => {
            const img = new Image();
            img.src = t.bg;
            return img;
        });
        this._baseImages = THEMES.map(t => {
            const img = new Image();
            img.src = t.base;
            return img;
        });
        this._themeIndex = playerStats.stage % THEMES.length;
    }

    _drawBackground(ctx) {
        const img = this._bgImages[this._themeIndex];
        if (img && img.complete && img.naturalWidth > 0) {
            ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        } else {
            ctx.fillStyle = "#111";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            this.drawGrid(ctx);
        }
    }

    _drawMainBaseBuilding(ctx) {
        const img = this._baseImages[this._themeIndex];
        if (!(img && img.complete && img.naturalWidth > 0)) return;
        const size = 7 * (32 + 2) - 2; // matches MainBase.buildWall footprint
        ctx.drawImage(img, this.mainBase.cx - size / 2, this.mainBase.cy - size / 2, size, size);
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
        const cx = this.mainBase.cx;
        const cy = this.mainBase.cy;

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
            const mult = Math.floor(playerStats.level / 3);
            const count = Math.min(
                Math.floor(Math.random() * 6 ) + 5 + mult * 2 
                ,40
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
                const roll = Math.random();
                if (roll < 0.10) {
                    this.outposts.push(new OmniOutpost(x, y)); // 10% omni
                } else if (roll < 0.25) {
                    this.outposts.push(new Sniper(x, y)); // 15% sniper
                } else if (roll < 0.50) {
                    this.outposts.push(new Burst(x, y)); // 25% burst
                } else {
                    this.outposts.push(new Outpost(x, y)); // 50% normal
                }
            }
            // if 200 attempts all fail (extremely rare on this canvas), skip that outpost
        }
    }

    // Elementos aleatorios del mapa (barreras, minas y trampas)
    // 30% de posiblidad de que salga cada elemento
    spawnObstacles() {

        const mult = getDifficultyMult();
        const margin = 60;

        // Checa donde está main base
        const cx = this.mainBase.cx;
        const cy = this.mainBase.cy;
        const basePad = 50;
        const baseW   = 7 * (32 + 2) - 2;
        const baseH   = baseW;
        const baseX   = cx - baseW / 2 - basePad;
        const baseY   = cy - baseH / 2 - basePad;
        const baseBW  = baseW + basePad * 2;
        const baseBH  = baseH + basePad * 2;

        const overlaps = (ax, ay, aw, ah, bx, by, bw, bh, gap = 0) =>
            ax < bx + bw + gap &&
            ax + aw + gap > bx &&
            ay < by + bh + gap &&
            ay + ah + gap > by;

        // Already-placed entities to avoid (outposts + obstacles accumulate as we go)
        const placed = this.outposts.map(o => ({ x: o.x, y: o.y, width: o.width, height: o.height }));
        const minGap = 24;

        const tryPlace = (w, h, gap = minGap) => {
            for (let attempts = 0; attempts < 200; attempts++) {
                const x = margin + Math.random() * (canvasWidth  - margin * 2 - w);
                const y = margin + Math.random() * (canvasHeight - margin * 2 - h);
                if (overlaps(x, y, w, h, baseX, baseY, baseBW, baseBH)) continue;
                if (placed.some(p => overlaps(x, y, w, h, p.x, p.y, p.width, p.height, gap))) continue;
                placed.push({ x, y, width: w, height: h });
                return { x, y };
            }
            return null;
        };

        const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

        // Barriers — random size per instance, count capped lower since they're bigger
        if (Math.random() >= 0.3) {
            const barrierCount = Math.min(randInt(2, 5) * mult, 12);
            for (let i = 0; i < barrierCount; i++) {
                const w = randInt(30, 90);
                const h = randInt(30, 90);
                const pos = tryPlace(w, h);
                if (pos) this.barriers.push(new Barrier(pos.x, pos.y, w, h));
            }
        }

        // Mines
        if (Math.random() >= 0.3) {
            const mineCount = Math.min(randInt(1, 3) * mult, 10);
            for (let i = 0; i < mineCount; i++) {
                const pos = tryPlace(24, 24);
                if (pos) this.mines.push(new Mine(pos.x, pos.y));
            }
        }

        // Bear traps
        if (Math.random() >= 0.3) {
            const trapCount = Math.min(randInt(1, 3) * mult, 10);
            for (let i = 0; i < trapCount; i++) {
                const pos = tryPlace(24, 24);
                if (pos) this.traps.push(new BearTrap(pos.x, pos.y));
            }
        }
    }



    get outpostsCleared() { return this.outposts.every(o => !o.alive); }

    createEventListeners() {
        if (this._keydownHandler) window.removeEventListener("keydown", this._keydownHandler);
        if (this._keyupHandler)   window.removeEventListener("keyup",   this._keyupHandler);

        this._keydownHandler = (e) => {
            if (this.heroSelect.active) return;
            if (this.won && this.draftChoices) return;

            if (e.code === "KeyE" && !this.waiting && !this.won && !this.targetingMode){
                this.ability.activateOffensive(this.player, this.mouseX, this.mouseY);
                return;
            }
            
            if (e.code === "KeyF" && !this.waiting && !this.won && !this.targetingMode){
                this.ability.activateDefensive(this.player);
                return;
            }

            if (this.targetingMode && e.code === "KeyR") {
                if (this._pendingTargetCard) {
                    playerStats.deck.push(this._pendingTargetCard);
                    this._pendingTargetCard = null;
                }
                this.targetingMode = null;
                return;
            }
            if (!this.waiting && !this.won && !this.targetingMode &&
                ["Digit1","Digit2","Digit3","Digit4","Digit5"].includes(e.code)) {
                const idx = parseInt(e.code.slice(-1), 10) - 1;
                if (idx >= 0 && idx < playerStats.deck.length) {
                    const card = playerStats.deck.splice(idx, 1)[0];
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
            if (e.code === "KeyB") {
                this._themeIndex = (this._themeIndex + 1) % THEMES.length;
                console.log("Theme:", THEMES[this._themeIndex].name);
            }
        };

        this._keyupHandler = (e) => {
            if (e.code === "KeyW") this.player.keys.up    = false;
            if (e.code === "KeyS") this.player.keys.down  = false;
            if (e.code === "KeyA") this.player.keys.left  = false;
            if (e.code === "KeyD") this.player.keys.right = false;
        };

        window.addEventListener("keydown", this._keydownHandler);
        window.addEventListener("keyup",   this._keyupHandler);

        const canvas = document.getElementById("canvas");
        if (canvas) {
            canvas.addEventListener("mousemove", (e) => {
                const rect = canvas.getBoundingClientRect();
                const mx = (e.clientX - rect.left) * (canvasWidth  / rect.width);
                const my = (e.clientY - rect.top)  * (canvasHeight / rect.height);
                this.mouseX = mx;
                this.mouseY = my;
                if (this.heroSelect.active) this.heroSelect.onMouseMove(mx, my);
            });
            canvas.addEventListener("mousedown", (e) => {
                const rect = canvas.getBoundingClientRect();
                const mx = (e.clientX - rect.left) * (canvasWidth  / rect.width);
                const my = (e.clientY - rect.top)  * (canvasHeight / rect.height);

                if (this.heroSelect.active) {
                    this.heroSelect.onMouseDown(mx, my);
                    if (!this.heroSelect.active) {
                        this.player = new Player(playerStats);
                        this.spawnPlayer();
                    }
                    return;
                }
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
                if (this.won && this.draftChoices) {
                    const cardW = 220, cardH = 280, gap = 30;
                    const startX = (canvasWidth - (3 * cardW + 2 * gap)) / 2;
                    const cardY = 200;
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
    // Resets all game entities and states for a new round
    startOrRestart() {
        if (this.heroSelect.active) return; // Can't start before picking a hero
        // Block restart while a draft is still pending
        if (this.won && this.draftChoices) return;
        if (this.waiting || this.won) {
            this.targetingMode = null;
            this._pendingTargetCard = null;
            this.player = new Player(playerStats)
            this.ability = new HeroAbility(playerStats.heroId);
            const { cx, cy } = randomBaseCenter();
            this.mainBase = new MainBase(cx, cy);
            this.outposts = [];
            this.bullets  = [];
            this.barriers = [];
            this.mines    = [];
            this.traps    = [];
            this.won      = false;
            this.waiting  = false;
            this._died    = false;
            this.randomEventActive    = false;
            this.randomEventTriggered = false;
            this.notifTimer           = 0;
            this.spawnOutposts();
            this.spawnObstacles();
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

    update(dt = 1) {
        // Freeze game logic while hero select or any waiting/won state is active
        

        if (this.heroSelect.active || this.waiting || this.won) return;

        const solidWalls = [...this.mainBase.living, ...this.barriers]; // ... significa los elementos de ese array (spread operator)
        this.player.update(solidWalls, dt);
        this.ability.update(this.player, this.mouseX, this.mouseY, this.outposts, this.mainBase, dt);

        this.player.isAttacking = false;
        this.player.targetHp    = null;

        // Player attacks outposts
        for (const outpost of this.outposts) {
            if (outpost.alive) this.player.tryAttack(outpost, dt);
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
        if (this.notifTimer > 0) this.notifTimer-= dt;

        // Outposts shoot at player
        if(!this.ability.isInvisible()){    
            for (const outpost of this.outposts) {
                const result = outpost.tryShoot(this.player, dt);
                if (Array.isArray(result)) {
                    this.bullets.push(...result);
                } else if (result) {
                    this.bullets.push(result);
                }
            }
        }

        // Wall segments shoot at player
        for (const seg of this.mainBase.living) {
            const b = seg.tryShoot(this.player, dt);
            if (b) this.bullets.push(b);
        }

        // Move bullets, check hits, cull dead ones
        for (const b of this.bullets) {
            b.update(dt);
            if (b.dead) continue;
            // Barriers absorb bullets before they can reach the player
            for (const bar of this.barriers) {
                if (b.overlaps(bar)){ 
                    b.dead = true; 
                    break; 
                }
            }
            if (!b.dead && b.overlaps(this.player)) {
                if(!this.ability.absorbDamage()){
                    const dmg = Math.max(1, b.damage - (playerStats.dmgReduction || 0));
                    this.player.hp -= dmg;
                    if (this.player.hp < 0) this.player.hp = 0;
                }
                b.dead = true;
            }
        }
        this.bullets = this.bullets.filter(b => !b.dead);

        // Player vs mines — heavy damage, mine despawns
        for (const m of this.mines) {
            if (!m.dead && this.player.overlaps(m)) {
                const dmg = Math.max(1, m.damage - (playerStats.dmgReduction || 0));
                this.player.hp -= dmg;
                if (this.player.hp < 0) this.player.hp = 0;
                m.dead = true;
            }
        }
        this.mines = this.mines.filter(m => !m.dead);

        // Player vs bear traps — light damage, paralyze 3s, trap despawns
        for (const t of this.traps) {
            if (!t.dead && this.player.overlaps(t)) {
                const dmg = Math.max(1, t.damage - (playerStats.dmgReduction || 0));
                this.player.hp -= dmg;
                if (this.player.hp < 0) this.player.hp = 0;
                this.player.paralyzedUntil = performance.now() + t.paralyzeMs;
                t.dead = true;
            }
        }
        this.traps = this.traps.filter(t => !t.dead);

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
                        heroId: playerStats.heroId,
                        score: this._deathXP,
                        level: this._deathLevel,
                        stage: this._deathStage,
                        playtime: playtime
                    })
                });
            }

            playerStats = { speedMod: 1.0, maxHp: 100, bonuses: [], level: 0, stage:0, xp:0, dmgReduction: 0, deck: []};
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

        this._drawBackground(ctx);
        this._drawMainBaseBuilding(ctx);

        this.mainBase.draw(ctx);

        // Capture zone — always visible
        /*
        const iz = this.mainBase.innerZone;
        ctx.fillStyle = "rgba(0, 255, 100, 0.25)";
        ctx.fillRect(iz.x, iz.y, iz.width, iz.height);
        ctx.strokeStyle = "lime";
        ctx.lineWidth = 2;
        ctx.strokeRect(iz.x, iz.y, iz.width, iz.height);
        ctx.fillStyle = "lime";
        ctx.font = "11px monospace";
        ctx.textAlign = "center";
        ctx.fillText("ENTER", iz.x + iz.width / 2, iz.y + iz.height / 2 + 4);*/

        for (const bar of this.barriers) bar.draw(ctx);
        for (const t of this.traps) t.draw(ctx);
        for (const m of this.mines) m.draw(ctx);
        for (const outpost of this.outposts) outpost.draw(ctx);
        this.player.draw(ctx);
        for (const b of this.bullets) b.draw(ctx);
        this.ability.draw(ctx);

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
        this.ability.drawHUD(ctx,canvasWidth,canvasHeight);
        this.drawHand(ctx);
    }

    // Renders the card hand on the bottom of the canvas.
    drawHand(ctx) {
        //if(playerStats.level === 0) return;
        
        const deck = (playerStats.deck || []).slice(0,3);
        //console.log(playerStats.deck);

        const cardW = 130, cardH = 60, gap = 10;
        const totalW = deck.length * cardW + Math.max(0, deck.length - 1) * gap;
        const startX = (canvasWidth - totalW) / 2;
        const y = canvasHeight - cardH - 8;
        ctx.textAlign = "left";
        for (let i = 0; i < deck.length; i++) {
            const c = deck[i];
            if (!c) continue;
            const name = c.name || "???";
            const desc = c.description || c.desc || "";
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
            //const desc = c.description;
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
        ctx.fillText(`Reached Level ${this._deathLevel +1}  —  Stage ${this._deathStage +1}`, canvasWidth / 2, canvasHeight / 2 + 20);

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

async function main() {
    const canvas  = document.getElementById("canvas");
    canvas.width  = canvasWidth;
    canvas.height = canvasHeight;
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;

    const allAudio = document.querySelectorAll('audio');
    const savedVolume = Math.min(60, Math.max(0, parseInt(localStorage.getItem('volume')) || 30));
    allAudio.forEach(a => {
        a.volume = savedVolume / 100;
        a.addEventListener('canplay', () => { a.volume = savedVolume / 100; }, { once: true });
    });

    await loadHeroes();
    loadCards();
    await loadPlayerDeck();

    game = new Game();
    loop();
}

let lastTime = 0;

function loop(timestamp) {
    const dt = lastTime ? Math.min((timestamp - lastTime) / (1000/60), 3) : 1;
    lastTime = timestamp;
    game.update(dt);
    game.draw(ctx);
    requestAnimationFrame(loop);
}

document.addEventListener("DOMContentLoaded", main);