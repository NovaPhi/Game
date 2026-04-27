(function applySettings() {
    const brightness = localStorage.getItem('brightness') ?? 100;
    const colorblind = localStorage.getItem('colorblind') || 'none';

    document.body.style.filter = `brightness(${brightness}%)`;

    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (colorblind !== 'none') document.body.classList.add(colorblind);
})();


"use strict";

const MAX_DECK = 10;

let deck = [];
let collection = [];

const RARITY_COLORS = {
    common:    '#aaaaaa',
    uncommon:  '#4fc34f',
    rare:      '#4a8fff',
    legendary: '#ff9a00'
};

document.addEventListener("DOMContentLoaded", async () => {
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    if (!sessionUser || sessionUser.user_ID === 0) {
        window.location.href = 'LogIn.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/DeckBuilder?user_ID=${sessionUser.user_ID}`);
        const data = await response.json();

        if (!data.success) {
            console.error('Failed to load collection');
            return;
        }

        collection = data.Cards.map(c => ({
            ...c,
            id:    c.id || c.id_card,
            type:  c.card_type,
            color: RARITY_COLORS[c.rarity] || '#fff'
        }));

        loadDeck();
        render();

    } catch (err) {
        console.error(err);
    }
});

function getCardById(id) {
    return collection.find(c => c.id == id) || null;
}

function createCardElement(card, state) {
    const element = document.createElement('div');
    element.className = `card ${state}`;
    element.dataset.id = card.id;
    element.style.setProperty('--card-color', card.color);

    element.innerHTML = `
        <div class="card-accent" style="background:${card.color}"></div>
        <div class="card-body">
            <div class="card-name">${card.name}</div>
            <div class="card-type">${card.type.replace('_', ' ')}</div>
            <div class="card-desc">${card.description}</div>
        </div>
    `;
    return element;
}

function renderDeck() {
    const grid    = document.getElementById('deckGrid');
    const counter = document.getElementById('deckCounter');

    counter.textContent = `${deck.length} / ${MAX_DECK}`;
    counter.classList.toggle('full', deck.length >= MAX_DECK);
    grid.innerHTML = '';

    if (deck.length === 0) {
        const msg = document.createElement('div');
        msg.className   = 'empty-msg';
        msg.textContent = 'Your deck is empty — select cards from your collection.';
        grid.appendChild(msg);
        return;
    }

    deck.forEach(id => {
        const card = getCardById(id);
        if (!card) return;
        const el = createCardElement(card, 'deck-card');
        el.addEventListener('click', () => removeFromDeck(id));
        grid.appendChild(el);
    });
}

function renderCollection() {
    const grid = document.getElementById('collectionGrid');
    grid.innerHTML = '';

    collection.forEach(card => {
        const inDeck = deck.some(d => d == card.id);
        const el = createCardElement(card, inDeck ? 'in-deck' : 'available');
        if (!inDeck) el.addEventListener('click', () => addToDeck(card.id));
        grid.appendChild(el);
    });
}

function render() {
    renderDeck();
    renderCollection();
}

function addToDeck(id) {
    if (deck.length >= MAX_DECK) return;
    if (deck.some(d => d == id)) return;
    deck.push(id);
    render();
}

function removeFromDeck(id) {
    deck = deck.filter(d => d != id);
    render();
}

function loadDeck() {
    try {
        const saved = localStorage.getItem('playerDeck');
        if (!saved) return;
        const parsed = JSON.parse(saved);
        console.log("parsed[0]:", parsed[0]);
        console.log("collection[0]:", collection[0]);
        if (Array.isArray(parsed) && parsed.length > 0) {
            if (typeof parsed[0] === 'object') {
                deck = parsed.map(c => c.id || c.id_card).filter(id => {
                    const found = getCardById(id);
                    console.log("looking for id:", id, "found:", found?.name);
                    return !!found;
                });
            } else {
                deck = parsed.filter(id => getCardById(id));
            }
        }
        console.log("deck after load:", deck);
    } catch (e) {
        deck = [];
    }
}
document.getElementById('saveBtn').addEventListener('click', async () => {
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    const selectedCards = deck.map(id => collection.find(c => c.id == id)).filter(Boolean);
    localStorage.setItem('playerDeck', JSON.stringify(selectedCards));

    if (sessionUser && sessionUser.user_ID !== 0) {
        try {
            const response = await fetch('http://localhost:8081/saveDeck', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_ID: sessionUser.user_ID, cardIds: deck })
            });
            const data = await response.json();
            if (!data.success) console.error('Failed to save deck to DB');
        } catch (err) {
            console.error('Save deck error:', err);
        }
    }

    const btn = document.getElementById('saveBtn');
    btn.textContent = 'Saved!';
    btn.classList.add('saved');
    setTimeout(() => { btn.textContent = 'Save Deck'; btn.classList.remove('saved'); }, 1500);
});