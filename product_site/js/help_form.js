"use strict";

/*
Name: Isaac Richards
Date: November 22, 2026
Description: Show Help form hints, validation errors, and a submission confirmation.
Assignment 11 AI-assisted: Codex implemented the form events and drafted and tested the event plan.
Detailed AI documentation: ../documentation/richards_events.md#ai-assistance
*/

//#region Help Form Events

const helpForm = document.getElementById(`help_form`);
const subject = helpForm.elements.namedItem(`subject`);
const message = helpForm.elements.namedItem(`message`);
const fields = [subject, message];
const hints = {
    subject: `Enter a subject up to ${subject.maxLength} characters.`,
    message: `Enter a message describing what you need help with.`,
};

const feedback = new Map();
const errorColor = `#ff6b6b`;
const formStatus = document.createElement(`p`);
formStatus.setAttribute(`role`, `status`);

function showFieldHint(event) {
    const field = event.currentTarget;
    formStatus.textContent = ``;
    feedback.get(field).textContent = hints[field.name];
}

function validateField(field) {
    let error = ``;
    if (!field.value.trim()) {
        if (field === subject) {
            error = `Enter a subject.`;
        }
        else {
            error = `Enter a message.`;
        }
    }

    if (!error && field === subject && field.value.length > subject.maxLength)
        error = `Keep the subject to ${subject.maxLength} characters or fewer.`;

    feedback.get(field).textContent = error;

    if (error) {
        field.setAttribute(`aria-invalid`, `true`);
        field.style.borderColor = errorColor;
    }
    else {
        field.removeAttribute(`aria-invalid`);
        field.style.borderColor = ``;
    }

    return !error;
}

function checkFieldOnBlur(event) {
    validateField(event.currentTarget);
}

function submitHelpForm(event) {
    event.preventDefault();
    formStatus.textContent = ``;

    const subjectValid = validateField(subject);
    const messageValid = validateField(message);

    if (!subjectValid || !messageValid) {
        formStatus.style.color = errorColor;
        formStatus.textContent = `Please correct the form errors before submitting.`;

        return;
    }

    helpForm.reset();
    formStatus.style.color = ``;
    formStatus.textContent = `Your responses were successfully recorded.`;
}

//#endregion

//#region Help Form Setup

for (const field of fields) {
    const fieldFeedback = document.createElement(`small`);
    fieldFeedback.id = `${field.id}_feedback`;
    fieldFeedback.setAttribute(`aria-live`, `polite`);
    //Keep Send in place when a field hint clears as the user clicks it.
    fieldFeedback.style.minHeight = `2.5em`;
    field.after(fieldFeedback);
    field.setAttribute(`aria-describedby`, fieldFeedback.id);
    feedback.set(field, fieldFeedback);
    field.addEventListener(`focus`, showFieldHint);
    field.addEventListener(`blur`, checkFieldOnBlur);
}

helpForm.append(formStatus);
//Let the submit listener show the same field errors when Send is clicked or Enter is pressed.
helpForm.noValidate = true;
helpForm.addEventListener(`submit`, submitHelpForm);

//#endregion
