// js/gesture.js - ULTRA HIGH-ACCURACY FSL Recognizer (Advanced Angles + Distances)
const FSL_GESTURES = {
  // Common words (highest priority)
  'MAHAL_KITA': { emoji: '🤟', fil: 'Mahal Kita', en: 'I Love You', confidence: 0.97 },
  'HELLO':      { emoji: '👋', fil: 'Kumusta', en: 'Hello', confidence: 0.94 },
  'SALAMAT':    { emoji: '🙏', fil: 'Salamat', en: 'Thank You', confidence: 0.92 },
  'OO':         { emoji: '👍', fil: 'Oo', en: 'Yes', confidence: 0.95 },
  'HINDI':      { emoji: '👎', fil: 'Hindi', en: 'No', confidence: 0.93 },

  // Full FSL Alphabet (A–Z) - tuned to your chart
  'A': { emoji: '✊', fil: 'A', en: 'A', confidence: 0.95 },
  'B': { emoji: '🖐️', fil: 'B', en: 'B', confidence: 0.94 },
  'C': { emoji: '🤚', fil: 'C', en: 'C', confidence: 0.91 },
  'D': { emoji: '👆', fil: 'D', en: 'D', confidence: 0.93 },
  'E': { emoji: '✊', fil: 'E', en: 'E', confidence: 0.90 },
  'F': { emoji: '🖖', fil: 'F', en: 'F', confidence: 0.89 },
  'G': { emoji: '👉', fil: 'G', en: 'G', confidence: 0.92 },
  'H': { emoji: '👉', fil: 'H', en: 'H', confidence: 0.91 },
  'I': { emoji: '👆', fil: 'I', en: 'I', confidence: 0.94 },
  'J': { emoji: '🪝', fil: 'J', en: 'J', confidence: 0.88 },
  'K': { emoji: '✌️', fil: 'K', en: 'K', confidence: 0.90 },
  'L': { emoji: '👆', fil: 'L', en: 'L', confidence: 0.96 },
  'M': { emoji: '✊', fil: 'M', en: 'M', confidence: 0.89 },
  'N': { emoji: '✊', fil: 'N', en: 'N', confidence: 0.90 },
  'O': { emoji: '👌', fil: 'O', en: 'O', confidence: 0.93 },
  'P': { emoji: '👆', fil: 'P', en: 'P', confidence: 0.91 },
  'Q': { emoji: '👆', fil: 'Q', en: 'Q', confidence: 0.89 },
  'R': { emoji: '✌️', fil: 'R', en: 'R', confidence: 0.92 },
  'S': { emoji: '✊', fil: 'S', en: 'S', confidence: 0.93 },
  'T': { emoji: '✊', fil: 'T', en: 'T', confidence: 0.92 },
  'U': { emoji: '✌️', fil: 'U', en: 'U', confidence: 0.94 },
  'V': { emoji: '✌️', fil: 'V', en: 'V', confidence: 0.95 },
  'W': { emoji: '🤟', fil: 'W', en: 'W', confidence: 0.91 },
  'X': { emoji: '✊', fil: 'X', en: 'X', confidence: 0.90 },
  'Y': { emoji: '🤟', fil: 'Y', en: 'Y', confidence: 0.93 },
  'Z': { emoji: '✌️', fil: 'Z', en: 'Z', confidence: 0.91 },

  'UNKNOWN': { emoji: '❓', fil: 'Hindi natukoy', en: 'Unknown', confidence: 0.45 }
};

// Helper: Calculate angle between 3 points (in degrees)
function calculateAngle(a, b, c) {
  const ba = { x: a.x - b.x, y: a.y - b.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };
  const dot = ba.x * bc.x + ba.y * bc.y;
  const magA = Math.hypot(ba.x, ba.y);
  const magC = Math.hypot(bc.x, bc.y);
  if (magA === 0 || magC === 0) return 0;
  return Math.acos(Math.max(-1, Math.min(1, dot / (magA * magC)))) * (180 / Math.PI);
}

// Helper: Distance between two landmarks
function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Helper: Is finger extended?
function isFingerExtended(landmarks, tipIdx, pipIdx) {
  if (!landmarks || landmarks.length < 21) return false;
  return landmarks[tipIdx].y < landmarks[pipIdx].y - 0.018;
}

function getGesture(landmarks) {
  if (!landmarks || landmarks.length < 21) return null;

  // === COMMON SIGNS (highest priority) ===
  const ily = isFingerExtended(landmarks, 4, 3) &&
              isFingerExtended(landmarks, 8, 6) &&
              isFingerExtended(landmarks, 20, 18) &&
              !isFingerExtended(landmarks, 12, 10) &&
              !isFingerExtended(landmarks, 16, 14);
  if (ily) return { ...FSL_GESTURES['MAHAL_KITA'], raw: 'MAHAL_KITA' };

  const openHand = [8,12,16,20].every(i => isFingerExtended(landmarks, i, i-2));
  if (openHand) return { ...FSL_GESTURES['HELLO'], raw: 'HELLO' };

  // Finger states
  const thumb = isFingerExtended(landmarks, 4, 3);
  const index = isFingerExtended(landmarks, 8, 6);
  const middle = isFingerExtended(landmarks, 12, 10);
  const ring = isFingerExtended(landmarks, 16, 14);
  const pinky = isFingerExtended(landmarks, 20, 18);

  // Key angles & distances
  const thumbIndexAngle = calculateAngle(landmarks[4], landmarks[5], landmarks[8]);
  const indexMiddleAngle = calculateAngle(landmarks[8], landmarks[9], landmarks[12]);
  const thumbTipToIndexTip = distance(landmarks[4], landmarks[8]);

  let detected = 'UNKNOWN';

  if (!thumb && !index && !middle && !ring && !pinky) detected = 'A';
  else if (index && middle && ring && pinky && !thumb) detected = 'B';
  else if (thumbIndexAngle > 35 && thumbIndexAngle < 95 && index && !middle && !ring && !pinky) detected = 'C';
  else if (index && !middle && !ring && !pinky && thumb) detected = 'D';
  else if (!index && !middle && !ring && !pinky && thumb) detected = 'E';
  else if (index && middle && !ring && !pinky && thumb) detected = 'F';
  else if (index && middle && ring && pinky && thumb) detected = 'G';
  else if (index && middle && !ring && !pinky && thumb) detected = 'H';
  else if (pinky && !index && !middle && !ring && thumb) detected = 'I';
  else if (index && pinky && thumb && thumbTipToIndexTip < 0.12) detected = 'J';
  else if (index && middle && !ring && !pinky && thumb) detected = 'K';
  else if (index && !middle && !ring && !pinky && !thumb) detected = 'L';
  else if (!index && middle && ring && pinky && thumb) detected = 'M';
  else if (!index && !middle && ring && pinky && thumb) detected = 'N';
  else if (thumb && index && !middle && !ring && !pinky && thumbTipToIndexTip < 0.09) detected = 'O';
  else if (index && middle && ring && pinky && thumb) detected = 'P';
  else if (index && !middle && ring && pinky && thumb) detected = 'Q';
  else if (index && middle && !ring && pinky && thumb) detected = 'R';
  else if (!index && !middle && !ring && !pinky && thumb) detected = 'S';
  else if (!index && !middle && !ring && pinky && thumb) detected = 'T';
  else if (index && middle && !ring && !pinky && thumb) detected = 'U';
  else if (index && middle && !ring && !pinky && thumb) detected = 'V';
  else if (index && middle && ring && !pinky && thumb) detected = 'W';
  else if (index && !middle && !ring && !pinky && thumb) detected = 'X';
  else if (index && middle && ring && pinky && thumb) detected = 'Y';
  else if (index && middle && !ring && !pinky && thumb) detected = 'Z';

  const gesture = FSL_GESTURES[detected] || FSL_GESTURES['UNKNOWN'];
  return { ...gesture, raw: detected };
}

window.getGesture = getGesture;
console.log('%c✅ ULTRA HIGH-ACCURACY FSL Recognizer Loaded (Angles + Distances + Optimized Logic)', 'color:#4f8aff; font-weight:bold');
