# Help Form Events

I used the Subject and Message fields on the Help page. When someone moves into either field, the `focus` listener shows what to enter. When they leave the field, the `blur` listener checks it and marks it red if it needs to be fixed. When they submit the form, the `submit` listener keeps them on the page and checks both fields. If either field is invalid, it marks that field red and shows a red message below the form. If both are valid, it clears the form and shows the confirmation. This is a front-end form demo.

# Event Handling Flowchart

```mermaid
flowchart TD
    Start[Start] -->|Page loads| Select[Select the Help form and its two fields]
    Select -->|Elements found| Listen[Attach focus and blur to the fields and submit to the form]
    Listen -->|Enter a field| Focus{{Focus}}
    Listen -->|Leave a field| Blur{{Blur}}
    Listen -->|Send or press Enter| Submit{{Submit}}
    Focus -->|Field receives focus| Hint[Show the field hint]
    Blur -->|Field loses focus| FieldValid{Is this field valid?}
    FieldValid -->|Yes| Clear[Clear field feedback]
    FieldValid -->|No| Error[Show a field error and mark the field red]
    Submit -->|Form submitted| Check[Prevent navigation and validate both fields]
    Check -->|Validation complete| FormValid{Are both fields valid?}
    FormValid -->|No| Correct[Mark invalid fields red and show an inline error]
    FormValid -->|Yes| Confirm[Clear the form and show the confirmation]
    Hint -->|Hint shown| End[End of event]
    Clear -->|Feedback cleared| End
    Error -->|Error shown| End
    Correct -->|Errors shown| End
    Confirm -->|Confirmation shown| End

    classDef terminal fill:#fecaca,stroke:#b91c1c,color:#111;
    classDef event fill:#bfdbfe,stroke:#1d4ed8,color:#111;
    classDef element fill:#e9d5ff,stroke:#7e22ce,color:#111;
    classDef code fill:#fff,stroke:#db2777,stroke-width:2px,color:#111;
    classDef decision fill:#fef08a,stroke:#a16207,color:#111;
    class Start,End terminal;
    class Focus,Blur,Submit event;
    class Select element;
    class Listen,Hint,Clear,Error,Check,Correct,Confirm code;
    class FieldValid,FormValid decision;
```

# AI Assistance

I asked Codex to compare the assignment with the existing site and then complete the local work. It identified the Help form, added the event listeners and validation in `help_form.js`, connected the script to the Help page, and wrote this document and flowchart. I asked it to simplify the implementation to the assignment requirements. It also checked the focus, blur, and submit paths in Edge.
