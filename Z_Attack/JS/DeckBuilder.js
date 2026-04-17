"use strict";

const MAX_DECK = 10;

// ids de cartas
let deck = [];

// Cmabiar a fetch('/user-collection/:userId') para agarrar las cartas de db
const collection = CARD_DEFS;


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
    const grid = document.getElementById('deckGrid');
    const counter = document.getElementById('deckCounter');

    counter.textContent = `${deck.length} / ${MAX_DECK}`;
    counter.classList.toggle('full', deck.length >= MAX_DECK);

    grid.innerHTML = '';

    if (deck.length === 0) {
        const msg = document.createElement('div');
        msg.className = 'empty-msg';
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
        const inDeck = deck.includes(card.id);
        const el = createCardElement(card, inDeck ? 'in-deck' : 'available');
        if (!inDeck) {
            el.addEventListener('click', () => addToDeck(card.id));
        }
        grid.appendChild(el);
    });
}

function render() {
    renderDeck();
    renderCollection();
}

function addToDeck(id) {
    if (deck.length >= MAX_DECK) return;
    if (deck.includes(id)) return;
    deck.push(id);
    render();
}

function removeFromDeck(id) {
    deck = deck.filter(d => d !== id);
    render();
}

function loadDeck() {
    try {
        const saved = localStorage.getItem('playerDeck');
        if (!saved) return;
        const ids = JSON.parse(saved);
        deck = ids.filter(id => getCardById(id)); // Checa si no se han borrado o cambiado cartas desde ultimo deck guardado
        console.log("Loaded deck: ", deck);
    } catch (e) {
        deck = [];
    }
}

document.getElementById('saveBtn').addEventListener('click', () => {
    // Cambiar a POST /user-deck con { user_ID, cardIds: deck } para poder mandarlo a db y de ahí a juego
    localStorage.setItem('playerDeck', JSON.stringify(deck));
    console.log("Saved deck: ", deck);

    const btn = document.getElementById('saveBtn');
    btn.textContent = 'Saved!';
    btn.classList.add('saved');
    setTimeout(() => {
        btn.textContent = 'Save Deck';
        btn.classList.remove('saved');
    }, 1500);
});

loadDeck();
render();