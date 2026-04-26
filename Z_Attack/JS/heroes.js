"use strict";


let HEROES = {}; // Will be populated from the API

async function loadHeroes() {
    const response = await fetch('http://localhost:8081/heroes');
    const body = await response.json();
    const heroesFromDb = body.Heroes;

    HEROES = Object.fromEntries(
        heroesFromDb.map(hero => [
            hero.id,              // ← was hero.hero_id (doesn't exist anymore)
            {
                id:           hero.id,          // ← was hero.id_hero
                name:         hero.name,        // ← was hero.hero_name
                description:  hero.description,
                asset:        hero.asset,
                cardColor:    hero.cardColor,
                speedMod:     parseFloat(hero.speedMod),
                maxHp:        parseFloat(hero.maxHp),
                dmgMult:      parseFloat(hero.dmgMult),
                dmgReduction: parseFloat(hero.dmgReduction),
                color:        hero.cardColor    // ← was missing, Player.draw() uses this
            }
        ])
    );
}



function getHeroById(id) {
    return Object.values(HEROES).find(hero => hero.id === id) || null;
}