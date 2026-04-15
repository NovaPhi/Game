"use strict";

const HEROES = {
    "warrior": {
        id:          "1",
        name:        "Warrior",
        description: "Tough frontliner. High HP and damage, but slow on their feet.",
        color:       "#e87",         // Sprite color
        cardColor:   "#c55",         // Selection card accent color
        speedMod:    0.8,            // -20% movement speed
        maxHp:       180,            // High survivability
        dmgMult:     1.5,            // +50% melee damage
        dmgReduction: 2,             // Absorbs 2 flat damage per bullet
    },
    "scout": {
        id:          "2",
        name:        "Scout",
        description: "Fast and fragile. Low HP but moves like a bullet — hard to hit.",
        color:       "#4f4",
        cardColor:   "#2a2",
        speedMod:    1.6,            // +60% movement speed
        maxHp:       60,             // Low HP — must rely on mobility
        dmgMult:     0.7,            // -30% melee damage
        dmgReduction: 0,
    },
    "tank": {
        id:          "3",
        name:        "Tank",
        description: "Resistence to the top but moves really slow.",
        color:       "#fa0",
        cardColor:   "#b70",
        speedMod:    0.5,            // Standard speed
        maxHp:       180,            // Standard HP
        dmgMult:     0.8,            // Standard damage
        dmgReduction: 2,             // Minor damage absorption
    },
};

function getHeroById(id) {
    return Object.values(HEROES).find(hero => hero.id === id) || null;
}