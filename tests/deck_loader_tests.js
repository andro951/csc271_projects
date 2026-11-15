"use strict";

function check(condition, message) {
    if (!condition)
        throw new Error(message);
}

async function expectError(action, matches) {
    try {
        await action();
    }
    catch (error) {
        check(matches(error), `Unexpected error: ${error.message}`);
        return;
    }

    throw new Error(`Expected an error.`);
}

function deckEntry(name, count, imageUrl) {
    return {count, card_digest: {name, image_uris: {front: imageUrl}}};
}

const tests = [
    [`Requests the right export and reads the deck`, async () => {
        window.fetch = async url => {
            check(url === `https://api.scryfall.com/decks/deck-id/export/json`, `Wrong export URL.`);
            return Response.json({name: `Test deck`, entries: {}});
        };

        const deck = await deckLoader.fetchDeck(`deck-id`);
        check(deck.name === `Test deck` && Object.keys(deck.entries).length === 0, `Wrong deck returned.`);
    }],
    [`Reports an unavailable deck`, async () => {
        window.fetch = async () => new Response(null, {status: 404});
        await expectError(() => deckLoader.fetchDeck(`missing`), error => /Check that it is public/.test(error.message));
    }],
    [`Rejects invalid JSON`, async () => {
        window.fetch = async () => new Response(`invalid JSON`);
        await expectError(() => deckLoader.fetchDeck(`bad-json`), error => error instanceof SyntaxError);
    }],
    [`Groups commanders, skips excluded sections, and totals copies`, () => {
        const {commanders, cards, totalCards} = deckLoader.parseDeckEntries({
            nonlands: [deckEntry(`Sol Ring`, 2, `sol.jpg`)],
            sideboard: [deckEntry(`Excluded card`, 1, `side.jpg`)],
            commanders: [deckEntry(`Commander`, 1, `commander.jpg`)],
            maybeboard: [deckEntry(`Maybe card`, 10, `maybe.jpg`)],
            lands: [deckEntry(`Forest`, 4, `forest.jpg`)],
        });

        check(commanders.length === 1 && commanders[0].name === `Commander`, `Wrong commander group.`);
        check(cards.length === 2 && cards[0].name === `Sol Ring` && cards[1].name === `Forest`, `Wrong deck group or order.`);
        check(cards[0].quantity === 2 && cards[0].imageUrl === `sol.jpg`, `Missing card information.`);
        check(totalCards === 7, `Wrong total card count.`);
    }],
    [`Skips empty sections and blank editor rows`, () => {
        const {commanders, cards, totalCards} = deckLoader.parseDeckEntries({
            commanders: [],
            mainboard: [{count: 1, raw_text: `  `, card_digest: null}],
        });

        check(commanders.length === 0 && cards.length === 0 && totalCards === 0, `A blank row was counted.`);
    }],
    [`Rejects cards Scryfall could not identify`, async () => {
        await expectError(() => deckLoader.parseDeckEntries({
            mainboard: [{raw_text: `Unknown card`, card_digest: null}],
        }), error => /Scryfall could not identify a card/.test(error.message));
    }],
];

async function runTests() {
    const summary = document.getElementById(`test_summary`);
    const results = document.getElementById(`test_results`);
    const originalFetch = window.fetch;
    let passed = 0;
    for (const [name, test] of tests) {
        const result = document.createElement(`li`);
        try {
            await test();
            result.textContent = `PASS: ${name}`;
            passed++;
        }
        catch (error) {
            result.textContent = `FAIL: ${name} - ${error.message}`;
        }
        finally {
            window.fetch = originalFetch;
        }

        results.append(result);
    }

    summary.textContent = `${passed} of ${tests.length} tests passed.`;
}

runTests();
