"use strict";

//#region Help Form Checks

const testForm = document.getElementById(`help_form`);
const testSubject = document.getElementById(`subject`);
const testMessage = document.getElementById(`message`);
const testSend = testForm.querySelector(`button`);
const subjectFeedback = document.getElementById(`subject_feedback`);
const messageFeedback = document.getElementById(`message_feedback`);
const testStatus = testForm.querySelector(`[role="status"]`);

function check(condition, message) {
    if (!condition)
        throw new Error(message);
}

const tests = [
    [`Both fields show their hints on focus`, () => {
        testSubject.focus();
        check(subjectFeedback.textContent.includes(`100 characters`), `The subject hint is missing.`);
        testMessage.focus();
        check(messageFeedback.textContent.includes(`what you need help with`), `The message hint is missing.`);
        check(testMessage.getAttribute(`aria-describedby`) === messageFeedback.id, `The hint is not associated with the field.`);
    }],
    [`Blur rejects whitespace and clears the error after correction`, () => {
        testMessage.focus();
        testMessage.value = `   `;
        testSubject.focus();
        check(messageFeedback.textContent === `Enter a message.`, `Expected a required message error.`);
        check(testMessage.getAttribute(`aria-invalid`) === `true`, `The field was not marked invalid.`);
        testMessage.focus();
        testMessage.value = `Deck question`;
        testSubject.focus();
        check(messageFeedback.textContent === `` && !testMessage.hasAttribute(`aria-invalid`), `The corrected field still has an error.`);
    }],
    [`Blur accepts a 100-character subject and rejects 101`, () => {
        testSubject.focus();
        testSubject.value = `x`.repeat(100);
        testMessage.focus();
        check(subjectFeedback.textContent === ``, `A subject at the limit was rejected.`);
        testSubject.focus();
        testSubject.value += `x`;
        testMessage.focus();
        check(subjectFeedback.textContent.includes(`100 characters or fewer`), `A subject over the limit was accepted.`);
    }],
    [`An invalid submit shows a red message and marks only the invalid field`, () => {
        testSubject.value = `Deck question`;
        testMessage.value = `   `;
        const submitEvent = new Event(`submit`, {cancelable: true});
        testForm.dispatchEvent(submitEvent);

        check(submitEvent.defaultPrevented, `The form tried to use its default submission.`);
        check(testStatus.textContent.includes(`correct the form errors`), `The inline error is missing.`);
        check(getComputedStyle(testStatus).color === `rgb(255, 107, 107)`, `The inline error is not red.`);
        check(getComputedStyle(testMessage).borderTopColor === `rgb(255, 107, 107)`, `The invalid field is not red.`);
        check(testSubject.style.borderColor === `` && !testSubject.hasAttribute(`aria-invalid`), `The valid field was marked invalid.`);
        check(messageFeedback.textContent === `Enter a message.`, `The message error is missing.`);
        check(testMessage.value === `   `, `The form cleared the invalid response.`);
    }],
    [`Send clears both fields and shows the confirmation when valid`, () => {
        testSubject.value = `Deck question`;
        testMessage.value = `How do I preview my deck?`;
        testSend.click();
        check(testStatus.textContent.includes(`successfully recorded`), `The success confirmation is missing.`);
        check(testStatus.style.color === `` && testMessage.style.borderColor === ``, `The error styling was not cleared.`);
        check(testSubject.value === `` && testMessage.value === ``, `The form did not clear both fields.`);
    }],
];

//#endregion

//#region Test Runner

const summary = document.getElementById(`test_summary`);
const results = document.getElementById(`test_results`);
let passed = 0;
for (const [name, test] of tests) {
    testSend.focus();
    testForm.reset();
    const result = document.createElement(`li`);
    try {
        test();
        result.textContent = `PASS: ${name}`;
        passed++;
    }
    catch (error) {
        result.textContent = `FAIL: ${name} - ${error.message}`;
    }

    results.append(result);
}

testForm.hidden = true;
summary.textContent = `${passed} of ${tests.length} tests passed.`;

//#endregion
