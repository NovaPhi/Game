"use strict";

const CARD_DEFS = [
    {
        id: "vital_surge",
        name: "Vital Surge",
        type: "powerup",
        description: "+25 max HP and full heal",
        color: "#4f4",
        targeting: false,
        apply(game) { 
            playerStats.maxHp += 25;
            game.player.maxHp = playerStats.maxHp;
            game.player.hp = game.player.maxHp;
        }
    },
    {
        id: "swift_feet",
        name: "Swift Feet",
        type: "powerup",
        description: "+15% movement speed",
        color: "#4af",
        targeting: false,
        apply(game) {
            playerStats.speedMod = +(playerStats.speedMod + 0.15).toFixed(2);
            game.player.speedMod = playerStats.speedMod;
        }
    },
    {
        id: "iron_skin",
        name: "Iron Skin",
        type: "powerup",
        description: "+10 flat damage reduction",
        color: "#aaa",
        targeting: false,
        apply(game) {
            playerStats.dmgReduction = (playerStats.dmgReduction || 0) + 10;
        }
    },
    {
        id: "demolish_outpost",
        name: "Demolish Outpost",
        type: "map_change",
        description: "Click an outpost to destroy it",
        color: "#fa0",
        targeting: true,
        apply(game) {
            game.targetingMode = "destroy_outpost";
        }
    }
];

function getCardById(id) {
    return CARD_DEFS.find(c => c.id === id);
}

function createStarterDeck() {
    // 3 cards: a heal, a speed boost, and a Demolish Outpost
    return [
        getCardById("vital_surge"),
        getCardById("swift_feet"),
        getCardById("demolish_outpost")
    ];
}

function getDraftChoices() {
    // 3 random distinct cards
    const pool = CARD_DEFS.slice();
    const out = [];
    while (out.length < 3 && pool.length) {
        const i = Math.floor(Math.random() * pool.length);
        out.push(pool.splice(i, 1)[0]);
    }
    return out;
}
