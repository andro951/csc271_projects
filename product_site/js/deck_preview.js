"use strict";

/*
Name: Isaac Richards
Date: November 1, 2026
Description: Display an imported Scryfall deck as a grid of names and images.
AI-assisted suggestion: I asked ChatGPT to do the initial implementation,
then requested refinements. I manually reviewed and edited the code.
Detailed AI documentation: ../../assignments/assignment7/richards_ai_documentation.md
*/

//#region Page Elements

function createElement(tag, text = ``) {
    const element = document.createElement(tag);
    element.textContent = text;
    return element;
}

const deckNameH1 = document.getElementById(`deck_name`);
const cardCountP = document.getElementById(`card_count`);
const gridDiv = document.getElementById(`card_grid`);
gridDiv.style.display = `grid`;
const gap = 4;
gridDiv.style.gap = `${gap}px`;

//#endregion

//#region Grid Layout

function updateGridColumns() {
    const gridWidth = gridDiv.clientWidth;
    const cardMinWidth = 96 * 2;// ~2 inches
    let columns = Math.floor(gridWidth / cardMinWidth);
    columns = Math.max(1, columns);

    gridDiv.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;
}

updateGridColumns();
window.addEventListener(`resize`, updateGridColumns);

//#endregion

//#region Deck Import

/*
Use an example deck to determine the relevant JSON fields:
https://api.scryfall.com/decks/9a446e57-cf41-43dc-a8df-b73be700926d/export/json

{
    "name": "Supernatural artifact tokens",
    "entries": {
        "columna": [
            {
                "section": "columna",
                "count": 1,
                "raw_text": "1 Sol Ring",
                "card_digest": {
                    "name": "Sol Ring",
                    "image_uris": {
                        "front": "https://cards.scryfall.io/large/front/8/e/8ee443cc-e17a-493b-9c93-1f9e141a30e4.jpg?1789644446"
                    }
                }
            }
        ]
    }
}
*/

async function loadDeck() {
    const deckId = new URLSearchParams(window.location.search).get(`deck`);
    //The request and JSON come from an external service and can fail.
    try {
        const response = await fetch(`https://api.scryfall.com/decks/${deckId}/export/json`);
        if (!response.ok)
            throw new Error(`Could not load the deck. Check that it is public and try again.`);

        const deck = await response.json();
        let totalCards = 0;
        const cards = document.createDocumentFragment();
        for (const [section, entries] of Object.entries(deck.entries)) {
            if (section === `sideboard` || section === `maybeboard`)
                continue;

            for (const entry of entries) {
                if (!entry.card_digest) {
                    //Scryfall includes blank editor rows in its exports.
                    if (!entry.raw_text?.trim())
                        continue;

                    throw new Error(`Scryfall could not identify a card. Correct the deck and try again.`);
                }

                const cardName = entry.card_digest.name;
                const quantity = entry.count;
                totalCards += quantity;
                const cardArticle = createElement(`article`);
                const nameP = createElement(`p`, `${cardName} (${quantity}x)`);
                nameP.className = `card_name`;
                const cardImage = createElement(`img`);
                cardImage.src = entry.card_digest.image_uris.front;
                cardImage.alt = cardName;
                cardImage.style.width = `100%`;
                cardImage.style.aspectRatio = `5 / 7`;
                cardImage.style.objectFit = `contain`;
                cardArticle.append(nameP, cardImage);
                cards.append(cardArticle);
            }
        }

        deckNameH1.textContent = deck.name;
        
        const tempP = createElement(`p`);
        tempP.append(createElement(`strong`, `${totalCards} cards`));
        cardCountP.innerHTML = tempP.innerHTML;

        gridDiv.append(cards);

        const names = gridDiv.getElementsByClassName(`card_name`);
        for (const name of names) {
            name.style.fontSize = `14px`;
            name.style.height = `14px`;
            name.style.margin = `0 0 4px`;
            name.style.overflow = `hidden`;
        }

        const images = gridDiv.getElementsByTagName(`img`);
        for (const image of images) {
            image.style.display = `block`;
        }
    }
    catch (error) {
        deckNameH1.textContent = `Could not import deck`;
        cardCountP.textContent = error.message;
    }
}

loadDeck();

//#endregion