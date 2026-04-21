"use strict";

/* ---------- Config ---------- */

const API_BASE = 'http://localhost:8081';
const DEV_XP   = 1000;

const RARITY_COLORS = {
    common:    '#aaaaaa',
    uncommon:  '#4fc34f',
    rare:      '#4a8fff',
    legendary: '#ff9a00'
};

const RARITY_ORDER_DESC = ['legendary', 'rare', 'uncommon', 'common'];

/* Tier definitions — cost + rarity drop weights. Tuning happens here. */
const LOOTBOX_TIERS = [
    {
        id: 'basic',
        name: 'Basic Crate',
        icon: '▢',
        cost: 100,
        color: RARITY_COLORS.common,
        weights: { common: 0.70, uncommon: 0.25, rare: 0.05, legendary: 0.00 } //probabilidad
    },
    {
        id: 'rare',
        name: 'Rare Crate',
        icon: '◆',
        cost: 250,
        color: RARITY_COLORS.rare,
        weights: { common: 0.30, uncommon: 0.45, rare: 0.20, legendary: 0.05 } //probabilidad
    },
    {
        id: 'legendary',
        name: 'Legendary Crate',
        icon: '★',
        cost: 500,
        color: RARITY_COLORS.legendary,
        weights: { common: 0.00, uncommon: 0.20, rare: 0.50, legendary: 0.30 } //probabilidad
    }
];

/* Placeholder card pool used when /getAllCards isn't wired yet. Mirrors the
   DB card shape so the real endpoint can drop in as a one-line swap. */
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

/* ---------- State ---------- */

let sessionUser = null;
let playerXP    = 0;
let cardPool    = [];
let ownedIds    = new Set();
let usedDevPool = false;

/* ---------- Init ---------- */

document.addEventListener('DOMContentLoaded', async () => {
    const stored = localStorage.getItem('sessionUser');
    sessionUser = stored ? JSON.parse(stored) : null;

    if (!sessionUser || sessionUser.user_ID === 0) {
        window.location.href = 'LogIn.html';
        return;
    }

    await Promise.all([loadPlayerXP(), loadOwnedIds(), loadCardPool()]);

    renderTiers();
    renderXP();

    const btn = document.getElementById('revealContinue');
    if (btn) btn.addEventListener('click', hideReveal);

    if (usedDevPool) {
        const banner = document.getElementById('devBanner');
        if (banner) banner.style.display = 'block';
    }
});

/* ---------- XP ---------- */

async function loadPlayerXP() {
    // TODO: API — GET /UserStats?user_ID=<id>
    // The endpoint exists (App.js:83-98) but currently does NOT project total_xp.
    // Backend task: add `total_xp` to the SELECT and the JSON response.
    // Expected response shape: { success, total_xp, ... }
    try {
        const r = await fetch(`${API_BASE}/UserStats?user_ID=${sessionUser.user_ID}`);
        const d = await r.json();
        if (d && d.success && typeof d.total_xp === 'number') {
            playerXP = d.total_xp;
            return;
        }
    } catch (err) {
        console.warn('[cardsUnlock] XP fetch failed, using DEV_XP:', err);
    }
    playerXP = DEV_XP;
}

async function spendXP(amount) {
    playerXP = Math.max(0, playerXP - amount);

    // TODO: API — server should decrement Stats.total_xp authoritatively.
    // Preferred: fold this into POST /openLootbox so XP deduction and the
    // User_Collection insert happen in one transaction. Do NOT ship a
    // standalone /spendXP — that's a trivial abuse vector.

    renderXP();

    const hud = document.getElementById('xpHud');
    hud.classList.add('flash');
    setTimeout(() => hud.classList.remove('flash'), 400);
}

function renderXP() {
    const el = document.getElementById('xpValue');
    if (el) el.textContent = playerXP.toLocaleString();
    document.querySelectorAll('.lootbox-tier').forEach(tierEl => {
        const cost = parseInt(tierEl.dataset.cost, 10);
        tierEl.classList.toggle('disabled', playerXP < cost);
    });
}

/* ---------- Card Pool ---------- */

async function loadOwnedIds() {
    try {
        const r = await fetch(`${API_BASE}/DeckBuilder?user_ID=${sessionUser.user_ID}`);
        const d = await r.json();
        if (d && d.success && Array.isArray(d.Cards)) {
            ownedIds = new Set(d.Cards.map(c => c.id || c.id_card));
            return;
        }
    } catch (err) {
        console.warn('[cardsUnlock] Owned-cards fetch failed:', err);
    }
    ownedIds = new Set();
}

async function loadCardPool() {
    // TODO: API — need a new GET /getAllCards endpoint returning every row in Cards.
    // /DeckBuilder is NOT a substitute — it JOINs User_Collection so it returns
    // only owned cards. Without the full pool the roll has nothing to pick from.
    // Expected response: { success, Cards: [{ id_card, name, rarity, card_type, description, ... }, ...] }
    try {
        const r = await fetch(`${API_BASE}/getAllCards`);
        const d = await r.json();
        if (d && d.success && Array.isArray(d.Cards) && d.Cards.length > 0) {
            cardPool = d.Cards.map(normalizeCard);
            return;
        }
    } catch (err) {
        console.warn('[cardsUnlock] /getAllCards not available, using DEV_POOL.');
    }
    cardPool = DEV_POOL.map(normalizeCard);
    usedDevPool = true;
}

function normalizeCard(c) {
    return {
        ...c,
        id:    c.id || c.id_card,
        type:  c.card_type || c.type,
        color: RARITY_COLORS[c.rarity] || '#fff'
    };
}

/* ---------- Tier rendering ---------- */

function renderTiers() {
    const grid = document.getElementById('lootboxGrid');
    grid.innerHTML = '';
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
        el.addEventListener('click', () => {
            if (el.classList.contains('disabled')) return;
            openLootbox(tier);
        });
        grid.appendChild(el);
    });
}

function formatOdds(weights) {
    return RARITY_ORDER_DESC
        .filter(r => (weights[r] || 0) > 0)
        .map(r => {
            const pct = Math.round(weights[r] * 100);
            return `<span class="rarity-line" style="color:${RARITY_COLORS[r]}">${r} ${pct}%</span>`;
        })
        .join('');
}

/* ---------- Lootbox open flow ---------- */

async function openLootbox(tier) {
    if (playerXP < tier.cost) return;

    const card = rollCard(tier.weights);
    if (!card) {
        showToastOnly('Tier mastered — you own every card this crate can drop.');
        return;
    }

    await spendXP(tier.cost);

    // Optimistic local update so the UI reflects ownership immediately.
    ownedIds.add(card.id);

    // TODO: API — POST /openLootbox  body: { user_ID, tier: tier.id }
    // Server performs the authoritative roll, INSERTs into User_Collection,
    // decrements Stats.total_xp, and returns: { success, card: {...}, new_xp }.
    // Do NOT trust the client-side roll in production — this fetch exists here
    // purely so the network call site is wired up for when the endpoint lands.
    fetch(`${API_BASE}/openLootbox`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_ID: sessionUser.user_ID, tier: tier.id })
    }).catch(() => { /* placeholder — endpoint not implemented yet */ });

    showReveal(card);
}

function rollCard(weights) {
    let rarity = pickWeightedRarity(weights);
    const tried = new Set();
    while (rarity) {
        if (!tried.has(rarity)) {
            tried.add(rarity);
            const candidates = cardPool.filter(c => c.rarity === rarity && !ownedIds.has(c.id));
            if (candidates.length > 0) {
                return candidates[Math.floor(Math.random() * candidates.length)];
            }
        }
        rarity = nextLowerRarity(rarity);
    }
    return null;
}

function pickWeightedRarity(weights) {
    const entries = Object.entries(weights).filter(([, w]) => w > 0);
    const total = entries.reduce((s, [, w]) => s + w, 0);
    let r = Math.random() * total;
    for (const [rarity, w] of entries) {
        r -= w;
        if (r <= 0) return rarity;
    }
    return entries[entries.length - 1][0];
}

function nextLowerRarity(rarity) {
    const idx = RARITY_ORDER_DESC.indexOf(rarity);
    return idx >= 0 && idx < RARITY_ORDER_DESC.length - 1 ? RARITY_ORDER_DESC[idx + 1] : null;
}

/* ---------- Reveal modal ---------- */

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
