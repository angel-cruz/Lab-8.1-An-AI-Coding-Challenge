# Lab-8.1-An-AI-Coding-Challenge

# Flashcard Study App – Reflection

- **Where did AI save time?** AI helped me quickly build the responsive layout, deck and card forms, and JavaScript functions instead of starting everything from scratch.

- **What AI bug did you identify, and how did you fix it?** I noticed a potential flip-state bug: a new card could still show the previous card's back. I addressed it by calling `resetFlip()` inside `render()` whenever the displayed card changes.

- **What code snippet did you refactor for clarity?** I separated the flip reset into a reusable function instead of repeating the same code:

  ```javascript
  function resetFlip() {
    $('studyCard').classList.remove('is-flipped');
    $('studyCard').setAttribute('aria-pressed', 'false');
  }
  ```

- **What accessibility improvement did you add?** I used a native `<dialog>` for the form, moved focus into it when opened, and returned focus to the original button when closed.

- **What prompt changes improved AI output?** I made my prompts more specific by asking for consistent HTML/CSS class names, accessible modal behavior, event delegation, and a flip-state reset when navigating cards.
