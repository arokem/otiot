(function () {
  'use strict';

  const state = {
    mode: 'nikud', // 'nikud' | 'letters'
    deck: [],
    index: 0,
  };

  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  }

  function buildDeck(mode) {
    const all = window.HEBREW_DATA && window.HEBREW_DATA.cards;
    if (!all || !all.length) {
      return [];
    }
    const filtered = all.filter(function (c) {
      return c.mode === mode;
    });
    return shuffleArray(filtered);
  }

  function getCurrentCard() {
    if (!state.deck.length) {
      return null;
    }
    return state.deck[state.index];
  }

  function render() {
    const card = getCurrentCard();
    const displayEl = document.getElementById('card-display');
    const labelEl = document.getElementById('card-label');
    const indexEl = document.getElementById('card-index');
    const totalEl = document.getElementById('card-total');
    const btnSpeak = document.getElementById('btn-speak');
    const btnNext = document.getElementById('btn-next');

    if (!card) {
      displayEl.textContent = '—';
      labelEl.textContent = 'No cards loaded.';
      indexEl.textContent = '0';
      totalEl.textContent = '0';
      btnSpeak.disabled = true;
      btnNext.disabled = true;
      return;
    }

    displayEl.textContent = card.display;
    labelEl.textContent = card.label || '';
    indexEl.textContent = String(state.index + 1);
    totalEl.textContent = String(state.deck.length);
    btnNext.disabled = state.deck.length <= 1;
    updateSpeakButtonState();
  }

  function updateSpeakButtonState() {
    const btnSpeak = document.getElementById('btn-speak');
    const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    if (!supported) {
      btnSpeak.disabled = true;
      return;
    }
    btnSpeak.disabled = !getCurrentCard();
  }

  function setMode(mode) {
    state.mode = mode;
    state.deck = buildDeck(mode);
    state.index = 0;
    render();
    updateModeButtons();
  }

  function updateModeButtons() {
    const btnNikud = document.getElementById('btn-mode-nikud');
    const btnLetters = document.getElementById('btn-mode-letters');
    const isNikud = state.mode === 'nikud';
    btnNikud.classList.toggle('is-active', isNikud);
    btnLetters.classList.toggle('is-active', !isNikud);
    btnNikud.setAttribute('aria-selected', isNikud ? 'true' : 'false');
    btnLetters.setAttribute('aria-selected', !isNikud ? 'true' : 'false');
  }

  function nextCard() {
    if (state.deck.length === 0) {
      return;
    }
    state.index += 1;
    if (state.index >= state.deck.length) {
      state.deck = shuffleArray(state.deck);
      state.index = 0;
    }
    render();
  }

  function shuffleDeck() {
    if (state.deck.length === 0) {
      return;
    }
    state.deck = shuffleArray(state.deck);
    state.index = 0;
    render();
  }

  function speakCurrent() {
    const card = getCurrentCard();
    if (!card) {
      return;
    }
    if (!('speechSynthesis' in window) || !('SpeechSynthesisUtterance' in window)) {
      return;
    }
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(card.speakText || card.display);
    utterance.lang = 'he-IL';
    utterance.rate = 0.9;
    try {
      synth.speak(utterance);
    } catch (e) {
      // ignore
    }
  }

  function showSpeechSupportNote() {
    const noteEl = document.getElementById('speech-note');
    const supported = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    if (!supported) {
      noteEl.textContent = 'Pronunciation is not supported in this browser. You can still practice recognition.';
      noteEl.hidden = false;
      return;
    }
    noteEl.hidden = true;
  }

  function init() {
    showSpeechSupportNote();
    state.deck = buildDeck(state.mode);
    state.index = 0;
    render();
    updateModeButtons();

    document.getElementById('btn-mode-nikud').addEventListener('click', function () {
      setMode('nikud');
    });
    document.getElementById('btn-mode-letters').addEventListener('click', function () {
      setMode('letters');
    });
    document.getElementById('btn-speak').addEventListener('click', speakCurrent);
    document.getElementById('btn-next').addEventListener('click', nextCard);
    document.getElementById('btn-shuffle').addEventListener('click', shuffleDeck);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
