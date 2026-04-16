"use strict";

let HEROES = {}; // Will be populated from the API

async function loadHeroes() {
    const response = await fetch('http://localhost:8081/heroes');
    const heroesFromDb = await response.json();
    
    // Map the DB rows into the same structure your code already expects
    HEROES = Object.fromEntries(
        heroesFromDb.map(hero => [
            {
                hero_ID: hero.id_hero,
                //add all into the db table
                //heroname: hero.heroname,
                //desc: "Tough frontliner. High HP and damage, but slow on their feet.",
                //color: change color to asset location on the folder from the target
                //cardcolor: color on the db
                //speedMod: .8, 
                maxHp: hero.hp,
                //dmgMult: hero.description,
                //dmgReduction: hero.defense,
                
            }
        ])
    );
}



//const HEROES = {
//    "warrior": {
//        id:          "1",
//        name:        "Warrior",
//        description: "Tough frontliner. High HP and damage, but slow on their feet.",
//        color:       "#e87",         // Sprite color
//        cardColor:   "#c55",         // Selection card accent color
//        speedMod:    0.8,            // -20% movement speed
//        maxHp:       180,            // High survivability
//        dmgMult:     1.5,            // +50% melee damage
//        dmgReduction: 2,             // Absorbs 2 flat damage per bullet
//    },
//    "scout": {
//        id:          "2",
//        name:        "Scout",
//        description: "Fast and fragile. Low HP but moves like a bullet — hard to hit.",
//        color:       "#4f4",
//        cardColor:   "#2a2",
//        speedMod:    1.6,            // +60% movement speed
//        maxHp:       60,             // Low HP — must rely on mobility
//        dmgMult:     0.7,            // -30% melee damage
//        dmgReduction: 0,
//    },
//    "tank": {
//        id:          "3",
//        name:        "Tank",
//        description: "Resistence to the top but moves really slow.",
//        color:       "#fa0",
//        cardColor:   "#b70",
//        speedMod:    0.5,            // Standard speed
//        maxHp:       180,            // Standard HP
//        dmgMult:     0.8,            // Standard damage
//        dmgReduction: 2,             // Minor damage absorption
//    },
//};

function getHeroById(id) {
    return Object.values(HEROES).find(hero => hero.id === id) || null;
}