"use strict";

/*
Name: Isaac Richards
Date: November 1, 2026
Description: Display an imported Scryfall deck as a grid of names and images.
AI-assisted suggestion: I asked ChatGPT to do the initial implementation,
then requested refinements. I manually reviewed and edited the code.
Detailed AI documentation: ../../assignments/assignment8/richards_ai_documentation.md

Assignment 9 AI-assisted: ChatGPT helped group commanders, implement the
required loops, and draft the decision tree and flowchart.
Detailed AI documentation: ../../assignments/assignment9/richards_ai_documentation.md

Assignment 10 AI-assisted: Codex helped split the deck import and test the refactor.
Detailed AI documentation: ../documentation/richards_modularization.md#ai-assistance
*/

//#region Page Elements

const deckNameH1 = document.getElementById(`deck_name`);
const cardCountP = document.getElementById(`card_count`);
const mainArea = document.getElementById(`main_area`);
const gridDiv = document.getElementById(`card_grid`);
const commanderGrid = document.createElement(`div`);
gridDiv.style.display = `grid`;
commanderGrid.style.display = `grid`;
const gap = 4;
gridDiv.style.gap = `${gap}px`;
commanderGrid.style.gap = `${gap}px`;

//#endregion

//#region Grid Layout

//Use the main grid width for both grids so commander tiles line up with deck tiles.
function updateGridColumns() {
    const gridWidth = gridDiv.clientWidth;
    const cardMinWidth = 96 * 2;// ~2 inches
    let columns = Math.floor(gridWidth / cardMinWidth);
    columns = Math.max(1, columns);

    const gridColumns = `repeat(${columns}, minmax(0, 1fr))`;
    gridDiv.style.gridTemplateColumns = gridColumns;
    commanderGrid.style.gridTemplateColumns = gridColumns;
}

updateGridColumns();
window.addEventListener(`resize`, updateGridColumns);

//#endregion

//#region Preview Startup

const deckId = new URLSearchParams(window.location.search).get(`deck`);
const previewElements = {deckNameH1, cardCountP, mainArea, gridDiv, commanderGrid};
deckLoader.loadDeck(deckId, previewElements).catch(error => {
    deckNameH1.textContent = `Could not import deck`;
    cardCountP.textContent = error.message;
});

//#endregion