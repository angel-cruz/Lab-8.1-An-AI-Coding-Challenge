# Flashcard Study App

A responsive flashcard study app built with HTML, CSS, and vanilla JavaScript.

## Run

Open `index.html` in a modern browser, or use VS Code Live Server. No packages are required.

## Features

- Create, rename, select, and delete decks.
- Add, edit, and delete flashcards.
- Flip flashcards with a CSS 3D animation; navigate with Previous and Next.
- Search front/back text and shuffle the current results.
- Data saved automatically in browser localStorage.
- Native accessible modal dialogs with keyboard focus handling and Escape to close.
- Responsive sidebar layout, dark-mode preference, and visible keyboard focus styles.

## Testing checklist

1. Create a deck, rename it, and delete it after confirmation.
2. Add cards, flip one, navigate next, edit a card, and delete a card.
3. Search for text in either side of a card; clear search to show all cards.
4. Refresh and confirm changes are saved.
5. Open a modal, use Tab and Shift+Tab to navigate, press Escape, and check focus returns to the opener.
6. Resize to mobile width and try the app with keyboard navigation.
