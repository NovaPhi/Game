/*
Main card logic file. 
Here, the cards are defined based on information retrieved from the database and localStorage. (database has priority)
Cards effects (apply methods of each card) are also defined in this file.
Deck flow and game-card connection are also made in this file.
*/

"use strict";

// Define rarity colors
const RARITY_COLOR = { common:'#aaaaaa', uncommon:'#4fc34f', rare:'#4a8fff', legendary:'#ff9a00' };

// Initialize the card pool
let CARD_POOL = [];

// Retrieves player's deck cards from localStorage and adds them to card pool after assigning the info based on the database
function loadCards() {
    try {
        const saved = localStorage.getItem('playerDeck');
        if (saved) {
            const parsed = JSON.parse(saved);
            // Adds cards from localStorage to card pool after building with info from db
            if (Array.isArray(parsed) && parsed.length > 0) { // isArray method usage suggested by AI
                CARD_POOL = parsed.map(buildCardFromDb);
                console.log(`Loaded ${CARD_POOL.length} cards from localStorage`);
                return;
            }
        }
    } catch (err) {
        console.error('Failed to load cards from localStorage:', err); // If there is an error while loading from localStorage
    }
    CARD_POOL = [];
}

// Assigns each card its info based on the database 
function buildCardFromDb(dbCard) {
    console.log("building card:", dbCard.name, "modifier:", dbCard.modifier, "mod_value:", dbCard.modifier_value);
    return {
        // Information block
        id:          dbCard.id_card || dbCard.id, // Card's id
        name:        dbCard.name, // Card name
        type:        dbCard.card_type || dbCard.type, // Card type
        description: dbCard.description, // Card description
        rarity:      dbCard.rarity, // Card rarity 
        color:       dbCard.color || RARITY_COLOR[dbCard.rarity] || "#fff", // Card color (or white)
        targeting:   !!dbCard.targeting, // If the card has targeting attribute or not (used for old destroy outpost card)
        // Apply block
        // Gives every card its effect. Made with help of AI
        apply(game) {
            const mod  = parseFloat(dbCard.modifier_value) || 0;
            const buff = parseFloat(dbCard.buff_value)     || 0;
            console.log("APPLYING:", dbCard.name, "modifier:", dbCard.modifier, "mod:", mod, "player before:", playerStats.dmgReduction, playerStats.speedMod, playerStats.maxHp);

            // For targeting cards
            if (dbCard.targeting) {
                game.targetingMode = dbCard.modifier;
                return;
            }
            // For cards that make the player immortal
            if (dbCard.is_immortal){
                const duration = (dbCard.duration_sec || 8) * 1000;
                game.player.is_immortal = true;
                setTimeout(() => game.player.is_immortal = false, duration);
                return;
            }
            // For varied effects
            switch (dbCard.modifier) {
                // For cards that give damage reduction
                case "dmgReduction":    playerStats.dmgReduction += mod;                                                                              break;
                // For cards that give speed 
                case "speedMod":        playerStats.speedMod     += mod; game.player.speedMod += mod;                                                 break;
                // For cards that increase max hp
                case "maxHp":           playerStats.maxHp        += mod; game.player.maxHp    += mod; game.player.hp += mod;                          break;
                // For cards that increase damage 
                case "dmgMult":         game.player.damage       += game.player.damage * mod;                                                         break;
                // For cards that change attack cooldown
                case "attackCooldown":  game.player.attackCooldownMax = Math.max(5, game.player.attackCooldownMax - mod);                             break;
                // For cards that heal
                case "healHp":          game.player.hp = Math.min(game.player.hp + mod, game.player.maxHp);                                           break;
                // For cards that heal full
                case "healFull":        game.player.hp = game.player.maxHp;                                                                           break;
                // For cards that delete bullets
                case "clearBullets":    game.bullets = [];                                                                                            break;
                // Old destroy outpost card
                case "destroy_outpost": game.targetingMode = "destroy_outpost";                                                                       break;
                // For cards that destroy a random outpost
                case "destroy_random": {
                    const alive = game.outposts.filter(o => o.alive);
                    for (let i = 0; i < mod && i < alive.length; i++) alive[i].hp = 0;
                    break;
                }
                // For cards that destroy all outposts
                case "destroy_all":     game.outposts.forEach(o => o.hp = 0);                                                                        break;
                // Cards that restore walls
                case "restoreWalls":    game.mainBase.segments.forEach(s => s.hp = s.maxHp);                                                         break;
                //case "isImmortal":      game.player.isImmortal = true; setTimeout(() => game.player.isImmortal = false, dbCard.duration_sec * 1000);  break;
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

// Creates every new player's starter deck. 3 common cards
function createStarterDeck() {
    return CARD_POOL.filter(c => c.rarity === "common").slice(0, 3);
}

// Selects random cards from the player loaded deck and uses them as the options for the card draft after beating a level.
// Made with help of AI
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

// Retrieves player's deck from database
async function loadPlayerDeck() {
    // Checks logged in user
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    if (sessionUser && sessionUser.user_ID !== 0) {
        try {
            // Gets the player's deck via API and loads it to card pool
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

// Settings
document.addEventListener('DOMContentLoaded', function applySettings() {
    const brightness = localStorage.getItem('brightness') ?? 100;
    const colorblind = localStorage.getItem('colorblind') || 'none';
    document.body.style.filter = `brightness(${brightness}%)`;
    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (colorblind !== 'none') document.body.classList.add(colorblind);
});