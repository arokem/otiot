(function () {
  'use strict';

  const state = {
    mode: 'nikud', // 'nikud' | 'letters' | 'words'
    deck: [],
    index: 0,
    revealed: false,
    score: 0,
    scoredForCard: false,
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
    const translitEl = document.getElementById('card-translit');
    const emojiEl = document.getElementById('card-emoji');
    const indexEl = document.getElementById('card-index');
    const totalEl = document.getElementById('card-total');
    const btnSpeak = document.getElementById('btn-speak');
    const btnNext = document.getElementById('btn-next');
    const btnReveal = document.getElementById('btn-reveal');
    const btnCorrect = document.getElementById('btn-correct');
    const btnWrong = document.getElementById('btn-wrong');
    const cardEl = document.getElementById('card');
    const scoreEl = document.getElementById('score-value');

    if (scoreEl) scoreEl.textContent = String(state.score);

    if (!card) {
      displayEl.textContent = '—';
      labelEl.textContent = 'No cards loaded.';
      labelEl.classList.remove('is-hidden');
      if (translitEl) {
        translitEl.textContent = '';
        translitEl.classList.add('is-hidden');
      }
      if (emojiEl) {
        emojiEl.textContent = '';
        emojiEl.classList.add('is-hidden');
      }
      if (cardEl) cardEl.classList.remove('card--words', 'is-animating');
      indexEl.textContent = '0';
      totalEl.textContent = '0';
      btnSpeak.disabled = true;
      btnNext.disabled = true;
      btnReveal.disabled = true;
      if (btnCorrect) btnCorrect.disabled = true;
      if (btnWrong) btnWrong.disabled = true;
      return;
    }

    displayEl.textContent = card.display;
    if (emojiEl) {
      const showEmoji = card.mode === 'words' && card.emoji && state.revealed;
      emojiEl.textContent = showEmoji ? card.emoji : '';
      emojiEl.classList.toggle('is-hidden', !showEmoji);
    }
    if (card.mode === 'words') {
      labelEl.textContent = card.label || '';
      if (translitEl) {
        translitEl.textContent = card.translit || '';
        translitEl.classList.toggle('is-hidden', !state.revealed);
      }
      if (cardEl) cardEl.classList.add('card--words');
    } else {
      labelEl.textContent = card.label || '';
      if (translitEl) {
        translitEl.textContent = '';
        translitEl.classList.add('is-hidden');
      }
      if (cardEl) cardEl.classList.remove('card--words');
    }
    labelEl.classList.toggle('is-hidden', !state.revealed);
    indexEl.textContent = String(state.index + 1);
    totalEl.textContent = String(state.deck.length);
    btnNext.disabled = state.deck.length <= 1;
    btnReveal.disabled = state.revealed;
    const scoringEnabled = state.revealed && !state.scoredForCard;
    if (btnCorrect) btnCorrect.disabled = !scoringEnabled;
    if (btnWrong) btnWrong.disabled = !scoringEnabled;
    updateSpeakButtonState();
  }

  function animateCardSwap() {
    const cardEl = document.getElementById('card');
    if (!cardEl) return;
    cardEl.classList.remove('is-animating');
    // force reflow to restart animation
    void cardEl.offsetWidth;
    cardEl.classList.add('is-animating');
    window.setTimeout(function () {
      cardEl.classList.remove('is-animating');
    }, 260);
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
    state.revealed = false;
    state.scoredForCard = false;
    render();
    updateModeButtons();
    animateCardSwap();
  }

  function updateModeButtons() {
    const btnNikud = document.getElementById('btn-mode-nikud');
    const btnLetters = document.getElementById('btn-mode-letters');
    const btnWords = document.getElementById('btn-mode-words');
    const isNikud = state.mode === 'nikud';
    const isLetters = state.mode === 'letters';
    const isWords = state.mode === 'words';
    btnNikud.classList.toggle('is-active', isNikud);
    btnLetters.classList.toggle('is-active', isLetters);
    btnWords.classList.toggle('is-active', isWords);
    btnNikud.setAttribute('aria-selected', isNikud ? 'true' : 'false');
    btnLetters.setAttribute('aria-selected', isLetters ? 'true' : 'false');
    btnWords.setAttribute('aria-selected', isWords ? 'true' : 'false');
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
    state.revealed = false;
    state.scoredForCard = false;
    render();
    animateCardSwap();
  }

  function shuffleDeck() {
    if (state.deck.length === 0) {
      return;
    }
    state.deck = shuffleArray(state.deck);
    state.index = 0;
    state.revealed = false;
    state.scoredForCard = false;
    render();
    animateCardSwap();
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
    document.getElementById('btn-mode-words').addEventListener('click', function () {
      setMode('words');
    });
    document.getElementById('btn-speak').addEventListener('click', speakCurrent);
    document.getElementById('btn-reveal').addEventListener('click', function () {
      state.revealed = true;
      render();
    });
    document.getElementById('btn-correct').addEventListener('click', function () {
      if (!state.revealed || state.scoredForCard) return;
      state.score += 5;
      state.scoredForCard = true;
      render();
    });
    document.getElementById('btn-wrong').addEventListener('click', function () {
      if (!state.revealed || state.scoredForCard) return;
      state.scoredForCard = true;
      render();
    });
    document.getElementById('btn-next').addEventListener('click', nextCard);
    document.getElementById('btn-shuffle').addEventListener('click', shuffleDeck);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
