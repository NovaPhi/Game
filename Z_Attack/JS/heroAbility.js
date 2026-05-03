"use strict";

const ABILITY_DEFS = {
    1: { // Warrior
        offensive: { name: "War Cry",        cooldown: 600, description: "Speed and Damage +50%, Attack Cooldowns -50% for 4s" },
        defensive: { name: "Defense Tonic",  cooldown: 480, description: "Damage Reduction +5 for 5s" }
    },
    2: { // Scout
        offensive: { name: "Sniper Shot",    cooldown: 900, description: "Piercing Shot Aimed with the mouse" },
        defensive: { name: "Ghost Step",     cooldown: 720, description: "Turn invisible until you attack" }
    },
    3: { // Tank
        offensive: { name: "Hammer Slam",    cooldown: 1200, description: "AoE slam damages all nearby enemies" },
        defensive: { name: "Liberty Shield", cooldown: 600, description: "Absorb all damage for 3s" }
    }
};

class HeroAbility {
    constructor(heroId) {
        this.heroId = heroId;
        this.def    = ABILITY_DEFS[heroId];

        // Offensive (E)
        this.offCooldown = 0;
        this.offActive   = false;
        this.offTimer    = 0;
        this.bullets     = [];

        // Defensive (F)
        this.defCooldown = 0;
        this.defActive   = false;
        this.defTimer    = 0;

        // Per-hero state
        this.shielded    = false;   // tank defensive
        this.invisible   = false;   // scout defensive
        this._origSpeed  = null;
        this._origDmg    = null;
        this._origCdMax  = null;
        this._origDR     = null;    // warrior defensive
    }

    get offReady() { return this.offCooldown <= 0 && !this.offActive; }
    get defReady() { return this.defCooldown <= 0 && !this.defActive; }

    update(player, mouseX, mouseY, outposts, mainBase, dt = 1) {
        if (this.offCooldown > 0) this.offCooldown -= dt;
        if (this.defCooldown > 0) this.defCooldown -= dt;

        // Offensive active tick
        if (this.offActive) {
            this.offTimer -= dt;

            // Scout — move piercing bullets
            if (this.heroId === 2) {
                for (const b of this.bullets) b.update(dt);
                for (const b of this.bullets) {
                    if (b.dead) continue;
                    for (const o of outposts) {
                        if (o.alive && b.overlaps(o)) {
                            o.hp -= b.damage;
                            if (o.hp < 0) o.hp = 0;
                        }
                    }
                    if (mainBase) {
                        const allDead = outposts.every(o => !o.alive);
                        if (allDead) {
                            for (const seg of mainBase.living) {
                                if (b.overlaps(seg)) {
                                    seg.hp -= b.damage;
                                    if (seg.hp < 0) seg.hp = 0;
                                }
                            }
                        }
                    }
                }
                this.bullets = this.bullets.filter(b => !b.dead);
                if (this.bullets.length === 0) this.offActive = false;
            }

            // Warrior — end boost after timer
            if (this.heroId === 1 && this.offTimer <= 0) {
                this._endWarriorBoost(player);
                this.offActive = false;
            }

            // Tank hammer — instant, just clear active flag
            if (this.heroId === 3 && this.offTimer <= 0) {
                this.offActive = false;
            }
        }

        // Defensive active tick
        if (this.defActive) {
            this.defTimer -= dt;

            // Tank shield timeout
            if (this.heroId === 3 && this.defTimer <= 0) {
                this.shielded  = false;
                this.defActive = false;
            }

            // Warrior tonic timeout
            if (this.heroId === 1 && this.defTimer <= 0) {
                this._endDefenseTonic(player);
                this.defActive = false;
            }

            // Scout invisibility has no timer — ends on attack (see breakInvisibility())
        }
    }

    //ACTIVATE OFFENSIVE ABILITIES (E)

    activateOffensive(player, mouseX, mouseY, outposts, mainBase) {
        if (!this.offReady) return;
        this.offCooldown = this.def.offensive.cooldown;
        this.offActive   = true;

        if (this.heroId === 1) this._activateWarrior(player);
        if (this.heroId === 2) this._activateScout(player, mouseX, mouseY);
        if (this.heroId === 3) this._activateHammerSlam(player);
    }

    // ACTIVATE DEFENSIVE ABILITIES (F)

    activateDefensive(player) {
        if (!this.defReady) return;
        this.defCooldown = this.def.defensive.cooldown;
        this.defActive   = true;

        if (this.heroId === 1) this._activateDefenseTonic(player);
        if (this.heroId === 2) this._activateInvisibility();
        if (this.heroId === 3) this._activateShield();
    }

    //OFFENSIVE ABILITIES

    _activateScout(player, mouseX, mouseY) {
        const cx = player.x + player.width  / 2;
        const cy = player.y + player.height / 2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const speed = 10;
        const b = new Bullet(cx - 3, cy - 3, (dx / dist) * speed, (dy / dist) * speed, 150, 8, 8, false, "#0ff");
        b._piercing = true;
        this.bullets = [b];
        this.offTimer = 120;
    }

    _activateWarrior(player) {
        this._origSpeed  = player.speedMod;
        this._origDmg    = player.damage;
        this._origCdMax  = player.attackCooldownMax;
        player.speedMod          *= 1.5;
        player.damage            *= 1.5;
        player.attackCooldownMax  = Math.max(5, Math.floor(player.attackCooldownMax * 0.66));
        this.offTimer = 240; // 4s
    }

    _endWarriorBoost(player) {
        if (this._origSpeed  !== null) player.speedMod         = this._origSpeed;
        if (this._origDmg    !== null) player.damage           = this._origDmg;
        if (this._origCdMax  !== null) player.attackCooldownMax = this._origCdMax;
        this._origSpeed = this._origDmg = this._origCdMax = null;
    }

    _activateHammerSlam(player) {
        const cx     = player.x + player.width  / 2;
        const cy     = player.y + player.height / 2;
        const radius = 120; // small AoE
        const damage = 200;

        const outposts = game.outposts;
        const mainBase = game.mainBase;

        console.log("Hammer slam at", cx, cy, "radius", radius);
        console.log("Outposts in range:", outposts.filter(o => {
            const ox = o.x + o.width / 2;
            const oy = o.y + o.height / 2;
            return o.alive && Math.hypot(ox - cx, oy - cy) <= radius;
        }).length);

        for (const o of outposts) {
            if (!o.alive) continue;
            const ox = o.x + o.width  / 2;
            const oy = o.y + o.height / 2;
            if (Math.hypot(ox - cx, oy - cy) <= radius) {
                o.hp -= damage;
                if (o.hp < 0) o.hp = 0;
            }
        }

        // Only hit base if outposts cleared
        const allDead = outposts.every(o => !o.alive);
        if (mainBase && allDead) {
            for (const seg of mainBase.living) {
                const sx = seg.x + seg.width  / 2;
                const sy = seg.y + seg.height / 2;
                if (Math.hypot(sx - cx, sy - cy) <= radius) {
                    seg.hp -= damage;
                    if (seg.hp < 0) seg.hp = 0;
                }
            }
        }

        this.offTimer     = 1; // instant, just needs 1 tick to clear
        this._slamCx      = cx;
        this._slamCy      = cy;
        this._slamRadius  = radius;
        this._slamFlash   = 20; // frames to show visual
    }

    //DEFENSIVE ABILITIES

    _activateShield() {
        this.shielded = true;
        this.defTimer = 180; // 3s
    }

    _activateInvisibility() {
        this.invisible = true;
        // no timer — ends when player attacks
    }

    // Call this from Player.tryAttack() when a hit lands
    breakInvisibility() {
        if (this.invisible) {
            this.invisible = false;
            this.defActive = false;
        }
    }

    _activateDefenseTonic(player) {
        this._origDR       = playerStats.dmgReduction;
        playerStats.dmgReduction += 5;
        this.defTimer = 300; // 5s
    }

    _endDefenseTonic(player) {
        if (this._origDR !== null) {
            playerStats.dmgReduction = this._origDR;
            this._origDR = null;
        }
    }

    

    absorbDamage() { return this.shielded; }

    isInvisible() { return this.invisible; }


    draw(ctx) {
        // Scout piercing bullet
        for (const b of this.bullets) b.draw(ctx);

        // Tank shield ring
        //claude help for animation
        if (this.shielded && game && game.player) {
            const p  = game.player;
            const cx = p.x + p.width  / 2;
            const cy = p.y + p.height / 2;
            const t  = (Date.now() / 200) % (Math.PI * 2);
            ctx.save();
            ctx.strokeStyle = `rgba(100, 180, 255, ${0.5 + 0.4 * Math.sin(t)})`;
            ctx.lineWidth   = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, 24, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Warrior offensive glow
        if (this.heroId === 1 && this.offActive && game && game.player) {
            const p  = game.player;
            const cx = p.x + p.width  / 2;
            const cy = p.y + p.height / 2;
            ctx.save();
            ctx.strokeStyle = "rgba(255, 140, 0, 0.7)";
            ctx.lineWidth   = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Warrior defensive tonic glow
        if (this.heroId === 1 && this.defActive && game && game.player) {
            const p  = game.player;
            const cx = p.x + p.width  / 2;
            const cy = p.y + p.height / 2;
            ctx.save();
            ctx.strokeStyle = "rgba(80, 200, 80, 0.7)";
            ctx.lineWidth   = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, 20, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Scout invisibility — draw player semi-transparent
        if (this.invisible && game && game.player) {
            // handled in Player.draw() via isInvisible() check
        }

        // Hammer slam shockwave
        if (this._slamFlash > 0) {
            this._slamFlash--;
            const progress = 1 - this._slamFlash / 20;
            const r = this._slamRadius * progress;
            ctx.save();
            ctx.strokeStyle = `rgba(255, 180, 0, ${1 - progress})`;
            ctx.lineWidth   = 4;
            ctx.beginPath();
            ctx.arc(this._slamCx, this._slamCy, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = `rgba(255, 180, 0, ${0.15 * (1 - progress)})`;
            ctx.fill();
            ctx.restore();
        }
    }

    //done with the help of claude 
    drawHUD(ctx, canvasWidth, canvasHeight) {
        if (!this.def) return;
        const size = 54;       // was 44
        const gap  = 6;
        const pad  = 12;       // margin from edges

        // anchor to bottom-right
        const totalWidth = size * 2 + gap;
        const x = canvasWidth  - totalWidth - pad;
        const y = canvasHeight - size - pad;

        this._drawAbilityIcon(ctx, x,          y, "E", this.def.offensive, this.offCooldown, this.offActive, this.offReady);
        this._drawAbilityIcon(ctx, x + size + gap, y, "F", this.def.defensive, this.defCooldown, this.defActive, this.defReady);
    }

    //done with the help of claude 
    _drawAbilityIcon(ctx, x, y, key, def, cooldown, active, ready) {
        const size = 54;       // was 44

        ctx.fillStyle = "#222";
        ctx.fillRect(x, y, size, size);

        if (active) {
            ctx.fillStyle = "rgba(255, 200, 0, 0.3)";
            ctx.fillRect(x, y, size, size);
        } else if (cooldown > 0) {
            const ratio = cooldown / def.cooldown;
            ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
            ctx.fillRect(x, y, size, size * ratio);
        }

        ctx.strokeStyle = ready ? "#4af" : "#555";
        ctx.lineWidth   = 2;
        ctx.strokeRect(x, y, size, size);

        ctx.fillStyle = "#aaa";
        ctx.font      = "8px monospace";   // was 7px
        ctx.textAlign = "center";
        ctx.fillText(def.name, x + size / 2, y + 9);   // moved inside top of box

        ctx.fillStyle = "#fff";
        ctx.font      = "13px monospace";  // was 11px
        ctx.textAlign = "left";
        ctx.fillText(`[${key}]`, x + 3, y + size - 4);

        if (cooldown > 0) {
            const secs = Math.ceil(cooldown / 60);
            ctx.fillStyle = "#fff";
            ctx.font      = "bold 20px monospace";  // was 16px
            ctx.textAlign = "center";
            ctx.fillText(secs, x + size / 2, y + size / 2 + 7);
        } else if (ready) {
            ctx.fillStyle = "#4af";
            ctx.font      = "12px monospace";  // was 10px
            ctx.textAlign = "center";
            ctx.fillText("READY", x + size / 2, y + size / 2 + 5);
        }

        ctx.textAlign = "left";
    }
}