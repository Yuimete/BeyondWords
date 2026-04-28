// js/tts.js
let voicesLoaded = false;
let availableVoices = [];

const tts = {
  async init() {
    return new Promise(resolve => {
      if (!('speechSynthesis' in window)) {
        console.warn('Speech Synthesis not supported');
        return resolve(false);
      }
      speechSynthesis.onvoiceschanged = () => {
        availableVoices = speechSynthesis.getVoices();
        voicesLoaded = true;
        resolve(true);
      };
      speechSynthesis.getVoices();
      resolve(true);
    });
  },

  getBestVoice(lang = 'fil') {
    if (!availableVoices.length) return null;
    return availableVoices.find(v =>
      v.lang.includes('fil') || v.lang.includes('tl') ||
      v.name.toLowerCase().includes('tagalog') || v.name.toLowerCase().includes('filipino')
    ) || availableVoices.find(v => v.lang.includes('en')) || availableVoices[0];
  },

  speak(text, lang = 'fil', rate = 1.05, pitch = 1) {
    if (!text || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.getBestVoice(lang);
    if (voice) utterance.voice = voice;
    utterance.lang = lang === 'fil' ? 'fil-PH' : 'en-US';
    utterance.rate = rate;
    utterance.pitch = pitch;

    speechSynthesis.speak(utterance);
  },

  stop() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  }
};

window.tts = tts;
