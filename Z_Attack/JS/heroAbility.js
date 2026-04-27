"use strict";

const ABILITY_DEFS ={
    3: {
        name: "Liberty Shield",
        cooldown: 300,
        description: "Use your shiled to absorb all damage for 3s"

    },
    1: {
        name: "War Cry",
        cooldown: 1200,
        description: "Speed and Damage +50%, Attack Cooldowns -50% for 4s"
    },
    2: {
        name: "Sniper Shot",
        cooldown: 900,
        description: "Piercing Shot Aimed with the mouse"
    }
};

class HeroAbility{
    constructor(heroId){
        this.heroId = heroId;
        this.def = ABILITY_DEFS[heroId];
        this.cooldown = 0;
        this.active = false;
        this.timer = 0;
        this. bullets = [];
        //tank in shield state
        this.shielded = false;
        //warrior boost
        this._origSpeed = null;
        this._origDmg = null;
        this._origCdMax = null;
    }

    get isReady() {return this.cooldown <= 0 && !this.active;}

    //called every frame from Game.update()
    update(player,mouseX,mouseY,outposts, mainBase){
        if(this.cooldown >0) this.cooldown--;
        if(this.active){
            this.timer--;
            if(this.heroId == 2){
                for (const b of this.bullets) b.update();
                for (const b of this.bullets){
                    if(b.dead) continue;
                    for(const o of outposts){
                        if(o.alive && b.overlaps(o)){
                            o.hp -= b.damage;
                            if(o.hp < 0 ) o.hp =0;
                        }
                    }
                    if (mainBase){
                        for (const seg of mainBase.living){
                            if(b.overlaps(seg)){
                                seg.hp -= b.damage;
                                if (seg.hp < 0) seg.hp = 0;
                            }
                        }
                    }
                }
                this.bullets = this.bullets.filter(b => !b.dead);
                if (this.bullets.length === 0 ){
                    this.active = false;
                }
            }

            //Warrior
            if(this.heroId == 1 && this.timer <= 0){
                this._endWarriorBoost(player);
                this.active = false;
            }

            //Tank
            if(this.heroId == 3 && this.timer <= 0){
                this.shielded = false;
                this.active = false;
            }
        }
    }
    
    activate(player, mouseX, mouseY){
        if (!this.isReady) return;
        this.cooldown = this.def.cooldown;
        this.active = true;
        if (this.heroId == 2) this._activateScout(player, mouseX, mouseY);
        if (this.heroId == 1) this._activateWarrior(player);
        if (this.heroId == 3) this._activateTank(player);
    }

    _activateScout(player, mouseX, mouseY){
        const cx = player.x + player.width /2;
        const cy = player.y + player.height/2;
        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.hypot(dx,dy) || 1;
        const speed = 10;
        const nx = dx / dist;
        const ny = dy / dist;
        const b = new Bullet(cx-3, cy-3, nx * speed, ny * speed, 150, "#0ff");
        b.width = 8;
        b.height = 8;
        b._piercing = true;
        this.bullets = [b];
        this.timer = 120; //max flight duration 2s
    }

    _activateWarrior(player){
        this._origSpeed = player.speedMod;
        this._origDmg = player.damage;
        this._origCdMax = player.attackCooldownMax;

        player.speedMod *= 1.5;
        player.damage *= 1.5;
        player.attackCooldownMax = Math.max(5, Math.floor(player.attackCooldownMax * 0.66));

        this.timer = 240; //4s
    }

    _endWarriorBoost(player){
        if (this._origSpeed  !== null) player.speedMod          = this._origSpeed;
        if (this._origDmg    !== null) player.damage            = this._origDmg;
        if (this._origCdMax  !== null) player.attackCooldownMax = this._origCdMax;
        this._origSpeed = this._origDmg = this._origCdMax = null;
    }

    _activateTank(player){
        this.shielded = true;
        this.timer = 180; //3s
    }

    absorbDamage(){
        return this.shielded;
    }

draw(ctx) {
        // Draw piercing bullets
        for (const b of this.bullets) b.draw(ctx);

        // Draw shield ring around player (tank)
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

        // Draw warrior boost glow
        if (this.heroId === 1 && this.active && game && game.player) {
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
    }

    drawHUD(ctx, x, y) {
        if (!this.def) return;
        const size = 44;

        // Icon background
        ctx.fillStyle = "#222";
        ctx.fillRect(x, y, size, size);

        // Ready/active/cooldown fill
        if (this.active) {
            ctx.fillStyle = "rgba(255, 200, 0, 0.3)";
            ctx.fillRect(x, y, size, size);
        } else if (this.cooldown > 0) {
            // Dark sweep overlay like LoL — sweeps from top as cooldown drains
            const ratio = this.cooldown / this.def.cooldown;
            ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
            ctx.fillRect(x, y, size, size * ratio);
        }

        // Border
        ctx.strokeStyle = this.isReady ? "#4af" : "#555";
        ctx.lineWidth   = 2;
        ctx.strokeRect(x, y, size, size);

        // Key label
        ctx.fillStyle = "#fff";
        ctx.font      = "11px monospace";
        ctx.textAlign = "left";
        ctx.fillText("[E]", x + 3, y + size - 4);

        // Ability name
        ctx.fillStyle = "#aaa";
        ctx.font      = "10px monospace";
        ctx.fillText(this.def.name, x + size + 6, y + 14);

        // Cooldown seconds remaining
        if (this.cooldown > 0) {
            const secs = Math.ceil(this.cooldown / 60);
            ctx.fillStyle = "#fff";
            ctx.font      = "bold 16px monospace";
            ctx.textAlign = "center";
            ctx.fillText(secs, x + size / 2, y + size / 2 + 6);
        } else if (this.isReady) {
            ctx.fillStyle = "#4af";
            ctx.font      = "10px monospace";
            ctx.textAlign = "center";
            ctx.fillText("READY", x + size / 2, y + size / 2 + 4);
        }

        ctx.textAlign = "left";
    }
}
