# Modularization Plan

`loadDeck()` currently gets the deck from Scryfall, figures out which cards to keep, and builds the preview. I want to split it at those three points. Then I can test the card rules without loading a page or sending a real request to Scryfall.

- `fetchDeck(deckId)` takes the ID from the preview page's URL. It requests the Scryfall JSON export and returns a promise for the parsed deck. If Scryfall rejects the request or the response isn't valid JSON, the error goes back to `loadDeck()`. This makes it possible to test request failures without relying on Scryfall to produce them.
- `parseDeckEntries(entries)` takes `deck.entries`, the sections from the export. It skips the sideboard, maybeboard, and blank editor rows. It returns the commander cards, the rest of the cards, and the total quantity. Each card has a name, quantity, and image URL. I can check those values directly in a unit test with no DOM setup.
- `renderDeck(deckName, parsedDeck, previewElements)` takes the deck name, the parsed cards, and the page elements it updates. It sets the title and count, builds the two grids, and formats the card labels. It updates the page and returns no value. Both grids use the same code to build the tiles, so a change to the tile layout applies to both.

`loadDeck(deckId, previewElements)` calls the three functions in order. The preview page calls it at startup and shows any error. `updateGridColumns()` is the function with no parameters or return value. It already has a separate job, so I can leave it where it is.

I put the loading and rendering functions in `deck_loader.js`. The file defines the functions so both the preview page and the tests can call them. `deck_preview.js` sets up the page and calls the loader.

# Possible New Functions

If I add a card search later, I’d split the filter into two functions.

- `filterCards(cards, shouldKeep)` would take the parsed cards and a function to call for each card. It would return the cards that function says to keep.
- `filterByName(searchText)` would take what the user typed and return a function that checks whether a card’s name contains that text, ignoring case.

The preview could call `filterCards(cards, filterByName(searchText))` to show the matching cards without fetching the deck again. I could pass a different function later to filter by something else.

# Testing

Double-click `run_tests.bat` in the repo folder to open the test page in your browser. You can also open `tests/deck_loader_tests.html` directly. The page shows which checks passed or failed. It uses fake Scryfall responses to check a successful response, a failed request, and invalid JSON. It also checks commander grouping, quantities, empty and skipped sections, blank rows, and unresolved cards. Check the preview in Edge to make sure those results still show up correctly on the page.

# AI Assistance

I asked Codex to suggest how to split `loadDeck()` into functions I could test. We settled on separating the request, the deck rules, and the page updates. I asked it to write this plan, make the refactor, write and run unit tests, and keep comments limited to details that help explain the code. I also asked it to put the loading functions in their own file and keep page startup separate.

[Assignment 10 chat transcript](../../assignments/assignment10/richards_ai_documentation.md)
