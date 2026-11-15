"use strict";

/*
Name: Isaac Richards
Date: November 15, 2026
Description: Load Scryfall decks and render them in the preview.
Assignment 10 AI-assisted: Codex helped separate deck loading from page startup and write unit tests.
Detailed AI documentation: ../documentation/richards_modularization.md#ai-assistance
*/

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

const deckLoader = {
    //Fetch and parse before touching the preview so an invalid deck leaves no partial grid.
    async loadDeck(deckId, previewElements) {
        const deck = await deckLoader.fetchDeck(deckId);
        const parsedDeck = deckLoader.parseDeckEntries(deck.entries);
        deckLoader.renderDeck(deck.name, parsedDeck, previewElements);
    },

    //Return the export JSON for this deck ID. The preview handles any request or JSON error.
    async fetchDeck(deckId) {
        const response = await fetch(`https://api.scryfall.com/decks/${deckId}/export/json`);
        if (!response.ok)
            throw new Error(`Could not load the deck. Check that it is public and try again.`);

        return response.json();
    },

    //Turn the export's section map into the two display groups and a count of included copies.
    parseDeckEntries(entries) {
        const commanders = [];
        const cards = [];
        let totalCards = 0;
        for (const [section, sectionEntries] of Object.entries(entries)) {
            let sectionCards;
            if (section === `sideboard` || section === `maybeboard`)
                continue;
            else if (sectionEntries.length === 0)
                continue;
            else if (section === `commanders`)
                sectionCards = commanders;
            else
                sectionCards = cards;

            for (const entry of sectionEntries) {
                if (!entry.card_digest) {
                    //Scryfall includes blank editor rows. A nonblank unresolved row is an import error.
                    if (!entry.raw_text?.trim())
                        continue;

                    throw new Error(`Scryfall could not identify a card. Correct the deck and try again.`);
                }

                const quantity = entry.count;
                totalCards += quantity;
                sectionCards.push({
                    name: entry.card_digest.name,
                    quantity,
                    imageUrl: entry.card_digest.image_uris.front,
                });
            }
        }

        return {commanders, cards, totalCards};
    },

    //Update the page after the whole deck has been parsed, so a bad entry leaves no partial preview.
    renderDeck(deckName, parsedDeck, previewElements) {
        const {deckNameH1, cardCountP, mainArea, gridDiv, commanderGrid} = previewElements;
        const cards = document.createDocumentFragment();
        const commanderCards = document.createDocumentFragment();
        const groups = [
            [parsedDeck.commanders, commanderCards],
            [parsedDeck.cards, cards],
        ];
        //Both grids use the same tile layout. for...of keeps cards in export order without tracking indexes.
        for (const [group, fragment] of groups) {
            for (const {name, quantity, imageUrl} of group) {
                const cardArticle = deckLoader.createElement(`article`);
                const nameP = deckLoader.createElement(`p`);
                nameP.className = `card_name`;
                nameP.dataset.cardName = name;
                nameP.dataset.quantity = quantity;
                const cardImage = deckLoader.createElement(`img`);
                cardImage.src = imageUrl;
                cardImage.alt = name;
                cardImage.style.width = `100%`;
                cardImage.style.aspectRatio = `5 / 7`;
                cardImage.style.objectFit = `contain`;
                cardArticle.append(nameP, cardImage);
                fragment.append(cardArticle);
            }
        }

        deckNameH1.textContent = deckName;

        const tempP = deckLoader.createElement(`p`);
        tempP.append(deckLoader.createElement(`strong`, `${parsedDeck.totalCards} cards`));
        cardCountP.innerHTML = tempP.innerHTML;

        if (commanderCards.firstChild) {
            commanderGrid.append(commanderCards);
            gridDiv.before(deckLoader.createElement(`h2`, `Commanders`), commanderGrid);
            if (cards.firstChild)
                gridDiv.before(deckLoader.createElement(`h2`, `Deck`));
        }

        gridDiv.append(cards);

        const cardLabels = mainArea.querySelectorAll(`.card_name`);
        if (cardLabels.length > 0) {
            let labelIndex = 0;
            //Update labels after both grids are mounted so the NodeList includes commanders.
            while (labelIndex < cardLabels.length) {
                const label = cardLabels[labelIndex];
                const {cardName, quantity} = label.dataset;
                label.textContent = `${cardName} (${quantity}x)`;
                labelIndex++;
            }
        }

        const names = mainArea.getElementsByClassName(`card_name`);
        for (const name of names) {
            name.style.fontSize = `14px`;
            name.style.height = `14px`;
            name.style.margin = `0 0 4px`;
            name.style.overflow = `hidden`;
        }

        const images = mainArea.getElementsByTagName(`img`);
        for (const image of images) {
            image.style.display = `block`;
        }
    },

    //Use textContent so imported names are displayed as text.
    createElement(tag, text = ``) {
        const element = document.createElement(tag);
        element.textContent = text;
        return element;
    },
};