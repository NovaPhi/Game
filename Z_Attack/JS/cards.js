"use strict";

const RARITY_COLOR = { common:'#aaaaaa', uncommon:'#4fc34f', rare:'#4a8fff', legendary:'#ff9a00' };

let CARD_POOL = [];

function loadCards() {
    try {
        const saved = localStorage.getItem('playerDeck');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                CARD_POOL = parsed.map(buildCardFromDb);
                console.log(`Loaded ${CARD_POOL.length} cards from localStorage`);
                return;
            }
        }
    } catch (err) {
        console.error('Failed to load cards from localStorage:', err);
    }
    CARD_POOL = [];
}

function buildCardFromDb(dbCard) {
    console.log("building card:", dbCard.name, "modifier:", dbCard.modifier, "mod_value:", dbCard.modifier_value);
    return {
        id:          dbCard.id_card || dbCard.id,
        name:        dbCard.name,
        type:        dbCard.card_type || dbCard.type,
        description: dbCard.description,
        rarity:      dbCard.rarity,
        color:       dbCard.color || RARITY_COLOR[dbCard.rarity] || "#fff",
        targeting:   !!dbCard.targeting,
        apply(game) {
            const mod  = parseFloat(dbCard.modifier_value) || 0;
            const buff = parseFloat(dbCard.buff_value)     || 0;
            console.log("APPLYING:", dbCard.name, "modifier:", dbCard.modifier, "mod:", mod, "player before:", playerStats.dmgReduction, playerStats.speedMod, playerStats.maxHp);

            if (dbCard.targeting) {
                game.targetingMode = dbCard.modifier;
                return;
            }
            switch (dbCard.modifier) {
                case "dmgReduction":    playerStats.dmgReduction += mod;                                                                              break;
                case "speedMod":        playerStats.speedMod     += mod; game.player.speedMod += mod;                                                 break;
                case "maxHp":           playerStats.maxHp        += mod; game.player.maxHp    += mod; game.player.hp += mod;                          break;
                case "dmgMult":         game.player.damage       += game.player.damage * mod;                                                         break;
                case "attackCooldown":  game.player.attackCooldownMax = Math.max(5, game.player.attackCooldownMax - mod);                             break;
                case "healHp":          game.player.hp = Math.min(game.player.hp + mod, game.player.maxHp);                                           break;
                case "healFull":        game.player.hp = game.player.maxHp;                                                                           break;
                case "clearBullets":    game.bullets = [];                                                                                            break;
                case "destroy_outpost": game.targetingMode = "destroy_outpost";                                                                       break;
                case "destroy_random": {
                    const alive = game.outposts.filter(o => o.alive);
                    for (let i = 0; i < mod && i < alive.length; i++) alive[i].hp = 0;
                    break;
                }
                case "destroy_all":     game.outposts.forEach(o => o.hp = 0);                                                                        break;
                case "restoreWalls":    game.mainBase.segments.forEach(s => s.hp = s.maxHp);                                                         break;
                case "isImmortal":      game.player.isImmortal = true; setTimeout(() => game.player.isImmortal = false, dbCard.duration_sec * 1000);  break;
                case "all":
                    game.player.damage       += game.player.damage * mod;
                    playerStats.speedMod     += 0.5; game.player.speedMod += 0.5;
                    playerStats.dmgReduction += 10;
                    playerStats.maxHp        += 100; game.player.maxHp += 100; game.player.hp += 100;
                    break;
                default: console.warn("Unknown modifier:", dbCard.modifier);
            }
            if (buff > 0 && dbCard.modifier === "maxHp") playerStats.dmgReduction += buff;
        }
    };
}

function createStarterDeck() {
    return CARD_POOL.filter(c => c.rarity === "common").slice(0, 3);
}

function getDraftChoices() {
    try {
        const saved = localStorage.getItem('playerDeck');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                const pool = parsed.map(buildCardFromDb);
                const copy = pool.slice();
                const out  = [];
                while (out.length < 3 && copy.length) {
                    const i = Math.floor(Math.random() * copy.length);
                    out.push(copy.splice(i, 1)[0]);
                }
                return out;
            }
        }
    } catch (e) {
        console.error('getDraftChoices error:', e);
    }
    return [];
}

async function loadPlayerDeck() {
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    if (sessionUser && sessionUser.user_ID !== 0) {
        try {
            const response = await fetch(`http://localhost:8081/loadDeck?user_ID=${sessionUser.user_ID}`);
            const data = await response.json();
            if (data.success && data.Cards.length > 0) {
                CARD_POOL = data.Cards.map(savedCard => buildCardFromDb(savedCard));
                return;
            }
        } catch (err) {
            console.error('Failed to load deck from DB, falling back to starter:', err);
        }
    }

    playerStats.deck = createStarterDeck();
}