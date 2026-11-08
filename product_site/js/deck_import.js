"use strict";

/*
Name: Isaac Richards
Date: November 1, 2026
Description: Import a public Scryfall deck and display its cards and total quantity.
AI-assisted suggestion: I asked ChatGPT to do the initial implementation,
then requested refinements. I manually reviewed and edited the code.
Detailed AI documentation: ../../assignments/assignment8/richards_ai_documentation.md
*/

//#region Page Elements

const panel = document.querySelector(`main`);
const deckLinkInput = panel.querySelector(`input`);
const continueButton = document.getElementById(`continue_button`);
const buttonText = continueButton.textContent.trim();

//#endregion

//#region Deck Import

function loadDeck() {
    const deckUrl = deckLinkInput.value.trim();
    const scryfallDeckRegex = /^https:\/\/(?:www\.)?scryfall\.com\/@[^/\s]+\/decks\/([0-9a-f-]{36})(?:[/?#].*)?$/i;
    const match = scryfallDeckRegex.exec(deckUrl);
    if (!match) {
        alert(`Enter a public Scryfall deck link.`);
        return;
    }

    continueButton.textContent = `${buttonText}...`;
    const deckId = match[1];
    window.location.href = `mtg-deck-preview.html?deck=${deckId}`;
}

continueButton.removeAttribute(`onclick`);
continueButton.addEventListener(`click`, loadDeck);

//#endregion