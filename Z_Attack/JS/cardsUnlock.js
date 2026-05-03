// Apply saved settings on every page load
(function applySettings() {
    const brightness = localStorage.getItem('brightness') ?? 100;
    const colorblind = localStorage.getItem('colorblind') || 'none';

    document.body.style.filter = `brightness(${brightness}%)`;

    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (colorblind !== 'none') document.body.classList.add(colorblind);
})();

/* 
Card unlock file.
This file contains the logic for the whole card unlocking process, with which the player can unlock and add new cards to their collection.
NOTE: For the creation and development of this file and the card unlocking flow, AI was highly utilized. This was a decision we made as team
to optimize the process, and cut development time since we were running out. Regardless, we understand all the code and logic in this file.
*/

"use strict";

// API route defined in a variable
const API_BASE = 'http://localhost:8081';
// XP amount defined for development porpuses
const DEV_XP   = 1000;

// Rarity color definitions
const RARITY_COLORS = {
    common:    '#aaaaaa',
    uncommon:  '#4fc34f',
    rare:      '#4a8fff',
    legendary: '#ff9a00'
};

// Rarity name (and hierarchy definition)
const RARITY_ORDER_DESC = ['legendary', 'rare', 'uncommon', 'common'];

// Lootbox definitions
const LOOTBOX_TIERS = [
    {
        id: 'basic',
        name: 'Basic Crate',
        icon: '▢',
        cost: 900, // XP needed to open this lootbox
        color: RARITY_COLORS.common,
        weights: { common: 0.70, uncommon: 0.25, rare: 0.05, legendary: 0.00 } // Probability of unlocking each card type
    },
    {
        id: 'rare',
        name: 'Rare Crate',
        icon: '◆',
        cost: 1800, // XP needed to open this lootbox
        color: RARITY_COLORS.rare,
        weights: { common: 0.30, uncommon: 0.45, rare: 0.20, legendary: 0.001 } // Probability of unlocking each card type
    },
    {
        id: 'legendary',
        name: 'Legendary Crate',
        icon: '★',
        cost: 6000, // XP needed to open this lootbox
        color: RARITY_COLORS.legendary,
        weights: { common: 0.00, uncommon: 0.20, rare: 0.50, legendary: 0.01 } // Probability of unlocking each card type
    }
];

/* Placeholder card pool used for offline development porpuses. Is no longer used, since API connection is already implemented
Mimics database shape to avoid any error.
Generated with AI 
*/
const DEV_POOL = [
    { id: 9001, name: 'Rusty Blade',     card_type: 'powerup',    rarity: 'common',    description: '+5% damage for the run.' },
    { id: 9002, name: 'Tin Shield',      card_type: 'powerup',    rarity: 'common',    description: '+5% damage reduction.' },
    { id: 9003, name: 'Field Medic',     card_type: 'ability',    rarity: 'common',    description: 'Heal 20 HP instantly.' },
    { id: 9004, name: 'Sharpened Edge',  card_type: 'powerup',    rarity: 'uncommon',  description: '+15% damage for the run.' },
    { id: 9005, name: 'Swift Boots',     card_type: 'powerup',    rarity: 'uncommon',  description: '+20% movement speed.' },
    { id: 9006, name: 'Frag Grenade',    card_type: 'ability',    rarity: 'uncommon',  description: 'Destroy a random outpost.' },
    { id: 9007, name: 'Plasma Core',     card_type: 'powerup',    rarity: 'rare',      description: '+35% damage for the run.' },
    { id: 9008, name: 'Iron Will',       card_type: 'powerup',    rarity: 'rare',      description: '+100 max HP, full heal.' },
    { id: 9009, name: 'Scorched Earth',  card_type: 'map_change', rarity: 'rare',      description: 'Destroy all outposts on the map.' },
    { id: 9010, name: 'Apex Predator',   card_type: 'powerup',    rarity: 'legendary', description: 'Double damage + 50% speed + 10% resist.' },
    { id: 9011, name: 'Immortal Shell',  card_type: 'ability',    rarity: 'legendary', description: 'Invulnerable for 8 seconds.' },
    { id: 9012, name: 'Wall of Light',   card_type: 'ability',    rarity: 'legendary', description: 'Fully restore all base walls.' }
];

// Initialization of needed variables
let sessionUser = null; // Logged in user
let playerXP    = 0; // Player's XP
let cardPool    = []; // Unlockable cards pool
let ownedIds    = new Set(); // Owned cards. Set usage was suggest by AI instead of Array to avoid duplicates
let usedDevPool = false; // Using devpool or not. False since we're not using it


// Validates session, loads player data from the database, and renders the lootbox UI
document.addEventListener('DOMContentLoaded', async () => {
    // Checks logged in user and redirects to log in if not logged in
    const stored = localStorage.getItem('sessionUser');
    sessionUser = stored ? JSON.parse(stored) : null;

    if (!sessionUser || sessionUser.user_ID === 0) {
        window.location.href = 'LogIn.html';
        return;
    }

    // Loads database info
    // Promise usage was suggested by AI to call the functions simultaneously instead of one after the other
    // Fetches player's xp, owned cards and unlockable card pool from db
    await Promise.all([loadPlayerXP(), loadOwnedIds(), loadCardPool()]);

    // Renders
    renderTiers();
    renderXP();

    // Continue button. On click, hides card reveal. Made with AI
    const btn = document.getElementById('revealContinue');
    if (btn) btn.addEventListener('click', hideReveal);

    // Shows 'using dev pool' text if using dev pool
    if (usedDevPool) {
        const banner = document.getElementById('devBanner');
        if (banner) banner.style.display = 'block';
    }
});

// Retrieves player's XP from databse
async function loadPlayerXP() {
    try {
        // Uses player's xp if succesful. Or 0 if player doesn't have any
        const r = await fetch(`${API_BASE}/UserStats?user_ID=${sessionUser.user_ID}`);
        const d = await r.json();
        if (d && d.success) {
            playerXP = parseInt(d.total_xp) || 0;
            return;
        }
    } catch (err) {
        // Error if can't retrieve player's xp Uses dev xp in its place
        console.warn('[cardsUnlock] XP fetch failed:', err);
    }
    playerXP = DEV_XP;
}

// Renders the player's current XP and disables the lootboxes the player can't afford.
function renderXP() {
    // Shows in text the player's current xp
    const el = document.getElementById('xpValue');
    if (el) el.textContent = playerXP.toLocaleString();
    // Disables lootboxes the player can't afford. Made with help of AI. 
    document.querySelectorAll('.lootbox-tier').forEach(tierEl => {
        const cost = parseInt(tierEl.dataset.cost, 10);
        tierEl.classList.toggle('disabled', playerXP < cost);
    });
}

// Retrieves the player's owned cards from the database
async function loadOwnedIds() {
    try {
        const r = await fetch(`${API_BASE}/DeckBuilder?user_ID=${sessionUser.user_ID}`); // Endpoint selection suggested by AI
        const d = await r.json();
        if (d && d.success && Array.isArray(d.Cards)) {
            // Creates set with player's owned cards
            ownedIds = new Set(d.Cards.map(c => c.id || c.id_card));
            return;
        }
    } catch (err) {
        console.warn('[cardsUnlock] Owned-cards fetch failed:', err);
    }
    // Creates empty set if error
    ownedIds = new Set();
}

// Retrieves all cards from database
async function loadCardPool() {
    try {
        const r = await fetch(`${API_BASE}/getAllCards`);
        const d = await r.json();
        if (d && d.success && Array.isArray(d.Cards) && d.Cards.length > 0) {
            // Adds cards to cardPool after normalization
            cardPool = d.Cards.map(normalizeCard);
            return;
        }
    } catch (err) {
        console.warn('[cardsUnlock] /getAllCards not available, using DEV_POOL.');
    }
    // Uses dev pool if error
    cardPool = DEV_POOL.map(normalizeCard);
    usedDevPool = true;
}

// Normalizes the cards database info to game info. Made with help of AI
function normalizeCard(c) {
    return {
        ...c,
        id:    c.id || c.id_card,
        type:  c.card_type || c.type,
        color: RARITY_COLORS[c.rarity] || '#fff'
    };
}

// Renders lootboxes. Made with help of AI
function renderTiers() {
    const grid = document.getElementById('lootboxGrid');
    grid.innerHTML = '';
    // Creates HTML element for each lootbox tier. HTML element creation made with help of AI.
    LOOTBOX_TIERS.forEach(tier => {
        const el = document.createElement('div');
        el.className = 'lootbox-tier';
        el.dataset.cost = String(tier.cost);
        el.style.setProperty('--tier-color', tier.color);
        el.style.setProperty('--tier-glow', tier.color + '55');
        el.innerHTML = `
            <div class="lootbox-icon">${tier.icon}</div>
            <div class="lootbox-name">${tier.name}</div>
            <div class="lootbox-cost">${tier.cost} XP</div>
            <div class="lootbox-odds">${formatOdds(tier.weights)}</div> 
            <div class="lootbox-open-btn">Open</div>
        `;
        // On click, opens lootbox
        el.addEventListener('click', () => {
            if (el.classList.contains('disabled')) return;
            openLootbox(tier);
        });
        grid.appendChild(el); // appendChild usage suggested by AI
    });
}

// Turns each rarity odd from decimal to percentage to display in the HTML elements. Made with AI help.
function formatOdds(weights) {
    return RARITY_ORDER_DESC
        .filter(r => (weights[r] || 0) > 0)
        .map(r => {
            const pct = Math.round(weights[r] * 100);
            return `<span class="rarity-line" style="color:${RARITY_COLORS[r]}">${r} ${pct}%</span>`;
        })
        .join('');
}

// Open lootbox function
async function openLootbox(tier) {
    // Cant open if xp is not enough
    if (playerXP < tier.cost) return;

    // Selects the unlocked card using rollCard method
    const card = rollCard(tier.weights);
    // If no card was returned, show tier mastered message using showToastOnly method
    if (!card) {
        showToastOnly('Tier mastered — you own every card this crate can drop.');
        return;
    }

    try {
        // Call API endpoint for open lootbox flow.
        const r = await fetch(`${API_BASE}/openLootbox`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                user_ID:  sessionUser.user_ID, 
                tier:     tier.id,
                rarity:   card.rarity,
                card_id:  card.id
            })
        });
        const d = await r.json();

        if (!d.success) {
            showToastOnly(d.message || 'Failed to open crate.'); // Fail message
            return;
        }

        playerXP = d.new_xp; // Updates player xp to substract what was spent. This is fetched from API
        renderXP(); // Renders xp with new xp
        const hud = document.getElementById('xpHud');
        
        //Card unlock animation. Made with help of AI. CSS class, flash, that lasts 400 ms
        hud.classList.add('flash');
        setTimeout(() => hud.classList.remove('flash'), 400);
        ownedIds.add(card.id); // Adds newly unlocked card to owned cards
        showReveal(card); // Shows reveal animation

    } catch (err) { // Error case
        console.error('openLootbox error:', err);
        showToastOnly('Server error — try again.'); // Shows error message with showToastOnly
    }
}

// Function to select an unlocked card. Made with AI help.
function rollCard(weights) {
    let rarity = pickWeightedRarity(weights); // Selects rarity using pickWeightedRarity method
    const tried = new Set(); // Creates new set for tried rarities. This will determine what rarities to use to select the new card. Fully unlocked rarities are not valid.
    while (rarity) {
        if (!tried.has(rarity)) {
            tried.add(rarity); // Adds rarity to tried set
            const candidates = cardPool.filter(c => c.rarity === rarity && !ownedIds.has(c.id)); // Select possible card candidates from card pool. Candidates are cards with the valid rarity and not owned
            if (candidates.length > 0) {
                return candidates[Math.floor(Math.random() * candidates.length)]; // Returns the available card candidates for unlock
            }
        }
        rarity = nextLowerRarity(rarity); // If that rarity is already fully unlocked, go to the next lower rarity (ex. legendary -> rare)
    }
    return null;
}

// Function to select the unlocked card's rarity. Made with AI
function pickWeightedRarity(weights) {
    const entries = Object.entries(weights).filter(([, w]) => w > 0); // Converts the probabilities of unlocking to pairs and remove any with 0 probability
    const total = entries.reduce((s, [, w]) => s + w, 0); // Sums probabilities 
    let r = Math.random() * total; // Picks a random number in the total 
    // The loop iterates the rarities, substracting the probability from r. Higher proability = larger slice of the range = more likely to be picked
    for (const [rarity, w] of entries) {
        r -= w;
        if (r <= 0) return rarity; // Return the rarity. 
    }
    return entries[entries.length - 1][0];
}

// Function to select the next lower rarity in case a rarity is fully unlocked.
function nextLowerRarity(rarity) {
    const idx = RARITY_ORDER_DESC.indexOf(rarity);
    return idx >= 0 && idx < RARITY_ORDER_DESC.length - 1 ? RARITY_ORDER_DESC[idx + 1] : null;
}

// Unlocked card reveal animation. Made with help of AI.
// Creates the reveal elements in the HTML (titles and texts)
function showReveal(card) {
    const backdrop = document.getElementById('revealBackdrop');
    const cardWrap = document.getElementById('revealCardWrap');
    const header   = document.getElementById('revealHeader');
    const toast    = document.getElementById('revealToast');

    const glow = card.color + '88';
    backdrop.style.setProperty('--card-color', card.color);
    backdrop.style.setProperty('--card-glow',  glow);

    header.textContent = `${card.rarity} card unlocked!`;
    cardWrap.innerHTML = '';
    cardWrap.appendChild(buildRevealCard(card));
    toast.textContent = 'Added to your collection — visit the Deck Builder to equip it.';

    backdrop.classList.remove('hidden');
}

// Unlocked card reveal element. Creates the unlocked card in the HTML. HTML element creation made with the help of AI
function buildRevealCard(card) {
    const el = document.createElement('div');
    el.className = 'card reveal-card';
    el.style.setProperty('--card-color', card.color);
    el.style.setProperty('--card-glow',  card.color + '99');
    el.innerHTML = `
        <div class="card-accent" style="background:${card.color}"></div>
        <div class="card-body">
            <div class="card-name">${card.name}</div>
            <div class="card-type">${(card.type || '').replace('_', ' ')}</div>
            <div class="card-desc">${card.description || ''}</div>
        </div>
    `;
    return el;
}

// Function to show messages when needed.
// Tier mastered or error opening lootbox.
// Creates the message element in the HTML. Made with help of AI.
function showToastOnly(msg) {
    const backdrop = document.getElementById('revealBackdrop');
    const cardWrap = document.getElementById('revealCardWrap');
    const header   = document.getElementById('revealHeader');
    const toast    = document.getElementById('revealToast');

    backdrop.style.setProperty('--card-color', 'var(--text)');
    backdrop.style.setProperty('--card-glow',  'var(--green-glow)');

    header.textContent = 'Tier Mastered';
    cardWrap.innerHTML = '';
    toast.textContent = msg;

    backdrop.classList.remove('hidden');
}

function hideReveal() {
    document.getElementById('revealBackdrop').classList.add('hidden');
}
