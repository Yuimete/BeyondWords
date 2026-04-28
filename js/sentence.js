// js/sentence.js
let currentSentence = { fil: [], en: [] };
let lastGesture = null;
let gestureStartTime = 0;
const HOLD_TIME = 1000; // 1 second hold

function addToSentence(gesture) {
  if (!gesture || gesture.raw === 'UNKNOWN') return;

  const now = Date.now();

  if (lastGesture && lastGesture.raw === gesture.raw) {
    if (now - gestureStartTime >= HOLD_TIME) {
      currentSentence.fil.push(gesture.fil);
      currentSentence.en.push(gesture.en);
      renderSentence();
      lastGesture = null;
    }
  } else {
    lastGesture = gesture;
    gestureStartTime = now;
  }
}

function renderSentence() {
  const display = document.getElementById('sentenceDisplay');
  const enDisplay = document.getElementById('sentenceEn');

  if (currentSentence.fil.length === 0) {
    display.innerHTML = `<span class="sentence-placeholder">Gawin ang mga FSL sign para bumuo ng pangungusap...</span>`;
    enDisplay.textContent = '';
    return;
  }

  display.innerHTML = currentSentence.fil.map(word =>
    `<span class="word-chip">${word}</span>`
  ).join(' ');

  enDisplay.textContent = currentSentence.en.join(' ');
}

function clearSentence() {
  currentSentence = { fil: [], en: [] };
  lastGesture = null;
  renderSentence();
}

function undoLastWord() {
  currentSentence.fil.pop();
  currentSentence.en.pop();
  renderSentence();
}

window.sentence = { addToSentence, clearSentence, undoLastWord, renderSentence };
