// Settings
(function applySettings() {
    const brightness = localStorage.getItem('brightness') ?? 100;
    const colorblind = localStorage.getItem('colorblind') || 'none';

    document.body.style.filter = `brightness(${brightness}%)`;

    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (colorblind !== 'none') document.body.classList.add(colorblind);
})();

/*
Deck building page and flow logic. This JS has the script for generating some of the elements in the
deck building page and the logic behing the flow of this same process. 
*/

"use strict";

const MAX_DECK = 10; // Max count for the deck

// Initialize deck and user collection
let deck = [];
let collection = [];

// Define rarity colors
const RARITY_COLORS = {
    common:    '#aaaaaa',
    uncommon:  '#4fc34f',
    rare:      '#4a8fff',
    legendary: '#ff9a00'
};

// Validates session, fetches the user's card collection, and renders the deck builder
document.addEventListener("DOMContentLoaded", async () => {
    // Checks logged in user. Redirects to log in page if no one is logged in
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    if (!sessionUser || sessionUser.user_ID === 0) {
        window.location.href = 'LogIn.html';
        return;
    }

    // Loads logged in user's collection for the database.
    try {
        const response = await fetch(`http://localhost:8081/DeckBuilder?user_ID=${sessionUser.user_ID}`);
        const data = await response.json();

        if (!data.success) {
            console.error('Failed to load collection');
            return;
        }

        // Normalizes db extracted card data into game data and adds it to user's collection array.
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

// Finds a card by its id
function getCardById(id) { 
    return collection.find(c => c.id == id) || null;
}

// Creates card element in the HTML
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

// Renders the player's deck
function renderDeck() {
    // Gets the card counter and deck space (grid) from the HTML
    const grid    = document.getElementById('deckGrid');
    const counter = document.getElementById('deckCounter');

    // Full deck -> Update text
    counter.textContent = `${deck.length} / ${MAX_DECK}`;
    counter.classList.toggle('full', deck.length >= MAX_DECK);
    grid.innerHTML = '';

    // Empty deck -> Sends the message to the HTML
    if (deck.length === 0) {
        const msg = document.createElement('div');
        msg.className   = 'empty-msg';
        msg.textContent = 'Your deck is empty — select cards from your collection.';
        grid.appendChild(msg); //appendChild usage was decided with help of AI
        return;
    }

    // Adds the cards to the user's deck
    deck.forEach(id => {
        const card = getCardById(id);
        if (!card) return;
        const el = createCardElement(card, 'deck-card');
        el.addEventListener('click', () => removeFromDeck(id)); // On click, removes the cards from the user's deck
        grid.appendChild(el);
    });
}

// Render the player's collection
function renderCollection() {
    const grid = document.getElementById('collectionGrid');
    grid.innerHTML = '';

    collection.forEach(card => {
        const inDeck = deck.some(d => d == card.id); // Checks if the card is in deck. some() method usage was suggested by AI
        const el = createCardElement(card, inDeck ? 'in-deck' : 'available');
        if (!inDeck) el.addEventListener('click', () => addToDeck(card.id)); // On click, adds the card to deck (given its not already there)
        grid.appendChild(el);
    });
}

// Renders both the deck and the collection
function render() {
    renderDeck();
    renderCollection();
}

// Adds a card to deck (if the deck is not already full or if the card is not already there)
function addToDeck(id) {
    if (deck.length >= MAX_DECK) return;
    if (deck.some(d => d == id)) return;
    deck.push(id);
    render();
}

// Removes card from deck
function removeFromDeck(id) {
    deck = deck.filter(d => d != id); // Uses filter to recreate the deck array
    render();
}

// Retrieves the player's current deck (saved in local storage) and shows it as the current deck
// Made with help of AI
function loadDeck() {
    try { // Gets the saved deck, makes sure its cards are valid
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
    } catch (e) { // If there's an error while loading, makes the deck empty
        deck = []; 
    }
}

// On save button click, saves the player selected deck on both, localStorage and backend
document.getElementById('saveBtn').addEventListener('click', async () => {
    // Checks logged in user
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    // Saves selected deck in localStorage
    const selectedCards = deck.map(id => collection.find(c => c.id == id)).filter(Boolean); // filter boolean usage suggested by AI to avoid invalid or undefined cards in deck
    localStorage.setItem('playerDeck', JSON.stringify(selectedCards));

    // Saves selected deck in database
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

    // Shows Saved! on save button and the returns to normal. Flow made with help of AI
    const btn = document.getElementById('saveBtn');
    btn.textContent = 'Saved!';
    btn.classList.add('saved');
    setTimeout(() => { btn.textContent = 'Save Deck'; btn.classList.remove('saved'); }, 1500);
});