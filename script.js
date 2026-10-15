const $ = (id) => document.getElementById(id);
const storageKey = 'flashcard-study-app-v1';
const starterDecks = [{ id: 'starter', name: 'JavaScript Basics', cards: [
  { id: 'c1', front: 'What is a variable?', back: 'A named place to store a value.' },
  { id: 'c2', front: 'What does === mean?', back: 'Strict equality: compares value and type.' },
  { id: 'c3', front: 'What is an array?', back: 'An ordered collection of values.' }
]}];
let decks;
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  decks = Array.isArray(saved) ? saved : starterDecks;
} catch { decks = starterDecks; }
let activeDeckId = decks[0]?.id ?? null;
let cardIndex = 0;
let order = [];
let searchTerm = '';
let editorMode = '';
let editingId = null;
let dialogOpener = null;
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`);
const activeDeck = () => decks.find(deck => deck.id === activeDeckId);
const currentCard = () => activeDeck()?.cards.find(card => card.id === order[cardIndex]);
function save() { try { localStorage.setItem(storageKey, JSON.stringify(decks)); } catch { alert('Unable to save locally. Storage may be full or disabled.'); } }
function rebuildOrder() {
  const deck = activeDeck();
  order = deck ? deck.cards.filter(card => `${card.front} ${card.back}`.toLowerCase().includes(searchTerm)).map(card => card.id) : [];
  cardIndex = 0;
}
function resetFlip() { $('studyCard').classList.remove('is-flipped'); $('studyCard').setAttribute('aria-pressed', 'false'); }
function render() {
  const deck = activeDeck();
  $('deckList').replaceChildren();
  decks.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = `deck-item${item.id === activeDeckId ? ' active' : ''}`;
    button.textContent = item.name; button.dataset.deckId = item.id;
    if (item.id === activeDeckId) button.setAttribute('aria-current', 'true');
    $('deckList').append(button);
  });
  $('deckTitle').textContent = deck?.name ?? 'No deck selected';
  $('deckCount').textContent = deck ? `${deck.cards.length} card(s)` : 'Create a deck to get started';
  const hasDeck = Boolean(deck);
  ['editDeckBtn','deleteDeckBtn','newCardBtn','shuffleBtn','searchInput'].forEach(id => $(id).disabled = !hasDeck);
  if (cardIndex >= order.length) cardIndex = Math.max(0, order.length - 1);
  const card = currentCard();
  resetFlip();
  $('studyCard').hidden = !card;
  $('emptyMessage').hidden = Boolean(card);
  $('emptyMessage').textContent = !deck ? 'Create a deck to start studying.' : searchTerm ? 'No cards match your search.' : 'No cards yet. Add your first card!';
  $('cardFront').textContent = card?.front ?? '';
  $('cardBack').textContent = card?.back ?? '';
  $('cardPosition').textContent = card ? `Card ${cardIndex + 1} of ${order.length}` : '';
  ['prevBtn','nextBtn','flipBtn','editCardBtn','deleteCardBtn'].forEach(id => $(id).disabled = !card);
}
function selectDeck(id) { activeDeckId = id; searchTerm = ''; $('searchInput').value = ''; rebuildOrder(); render(); }
function openEditor(mode) {
  editorMode = mode;
  editingId = mode === 'editCard' ? currentCard()?.id : mode === 'editDeck' ? activeDeckId : null;
  dialogOpener = document.activeElement;
  const isCard = mode.toLowerCase().includes('card');
  $('deckFields').hidden = isCard;
  $('cardFields').hidden = !isCard;
  $('deckName').required = !isCard;
  $('cardFrontInput').required = isCard;
  $('cardBackInput').required = isCard;
  $('dialogTitle').textContent = ({newDeck:'New Deck',editDeck:'Rename Deck',newCard:'New Card',editCard:'Edit Card'})[mode];
  $('deckName').value = mode === 'editDeck' ? activeDeck().name : '';
  $('cardFrontInput').value = mode === 'editCard' ? currentCard().front : '';
  $('cardBackInput').value = mode === 'editCard' ? currentCard().back : '';
  $('editorDialog').showModal();
  (isCard ? $('cardFrontInput') : $('deckName')).focus();
}
$('editorDialog').addEventListener('close', () => { if (dialogOpener?.isConnected) dialogOpener.focus(); });
$('cancelBtn').addEventListener('click', () => $('editorDialog').close());
// Native modal dialogs keep Tab navigation inside and support Escape.
$('editorForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = $('deckName').value.trim();
  const front = $('cardFrontInput').value.trim();
  const back = $('cardBackInput').value.trim();
  if (editorMode === 'newDeck' || editorMode === 'editDeck') {
    if (!name) return alert('Enter a deck name.');
    if (editorMode === 'newDeck') {
      const deck = { id: uid(), name, cards: [] }; decks.push(deck); activeDeckId = deck.id;
    } else activeDeck().name = name;
  } else {
    if (!front || !back) return alert('Enter both sides of the card.');
    if (editorMode === 'newCard') {
      const card = { id: uid(), front, back }; activeDeck().cards.push(card);
    } else {
      const card = activeDeck().cards.find(item => item.id === editingId);
      if (card) { card.front = front; card.back = back; }
    }
  }
  save();
  const targetId = editorMode === 'editCard' ? editingId : editorMode === 'newCard' ? activeDeck().cards.at(-1)?.id : null;
  if (editorMode === 'newDeck' || editorMode === 'newCard') { searchTerm = ''; $('searchInput').value = ''; }
  rebuildOrder();
  if (targetId) cardIndex = Math.max(0, order.indexOf(targetId));
  $('editorDialog').close(); render();
});
$('deckList').addEventListener('click', event => {
  const button = event.target.closest('[data-deck-id]');
  if (button) selectDeck(button.dataset.deckId);
});
$('newDeckBtn').addEventListener('click', () => openEditor('newDeck'));
$('editDeckBtn').addEventListener('click', () => openEditor('editDeck'));
$('deleteDeckBtn').addEventListener('click', () => {
  const deck = activeDeck();
  if (!deck || !confirm(`Delete "${deck.name}" and all its cards?`)) return;
  decks = decks.filter(item => item.id !== deck.id);
  activeDeckId = decks[0]?.id ?? null; searchTerm = ''; $('searchInput').value = '';
  save(); rebuildOrder(); render();
});
$('newCardBtn').addEventListener('click', () => openEditor('newCard'));
$('editCardBtn').addEventListener('click', () => openEditor('editCard'));
$('deleteCardBtn').addEventListener('click', () => {
  const card = currentCard();
  if (!card || !confirm('Delete this card?')) return;
  activeDeck().cards = activeDeck().cards.filter(item => item.id !== card.id);
  save(); rebuildOrder(); render();
});
$('searchInput').addEventListener('input', event => { searchTerm = event.target.value.trim().toLowerCase(); rebuildOrder(); render(); });
$('shuffleBtn').addEventListener('click', () => {
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  cardIndex = 0; render();
});
function flip() { if (!currentCard()) return; const flipped = $('studyCard').classList.toggle('is-flipped'); $('studyCard').setAttribute('aria-pressed', String(flipped)); }
$('studyCard').addEventListener('click', flip);
$('flipBtn').addEventListener('click', flip);
$('prevBtn').addEventListener('click', () => { if (order.length) { cardIndex = (cardIndex - 1 + order.length) % order.length; render(); } });
$('nextBtn').addEventListener('click', () => { if (order.length) { cardIndex = (cardIndex + 1) % order.length; render(); } });
rebuildOrder(); render();
