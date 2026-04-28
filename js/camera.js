// js/camera.js - Camera + MediaPipe
let handsInstance = null;
let cameraInstance = null;

async function initCamera() {
  const video = document.getElementById('videoFeed');
  const canvas = document.getElementById('overlayCanvas');
  const ctx = canvas.getContext('2d');

  try {
    // Wait for MediaPipe globals
    if (typeof Hands === 'undefined' || typeof Camera === 'undefined') {
      throw new Error('MediaPipe not loaded yet');
    }

    handsInstance = new Hands({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1646424915/${file}`
    });

    handsInstance.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7
    });

    handsInstance.onResults(onResults);

    cameraInstance = new Camera(video, {
      onFrame: async () => {
        await handsInstance.send({ image: video });
      },
      width: 640,
      height: 480,
      facingMode: 'environment'
    });

    const permOverlay = document.getElementById('permissionOverlay');
    const loadingOverlay = document.getElementById('loadingOverlay');

    await cameraInstance.start();
    permOverlay.classList.add('hidden');
    loadingOverlay.classList.remove('hidden');

    setTimeout(() => {
      loadingOverlay.classList.add('hidden');
      document.getElementById('statusDot').classList.add('ready');
      document.getElementById('statusText').textContent = 'Handa na! ✨';
    }, 1200);

    console.log('%c✅ Camera + MediaPipe Started', 'color:#4f8aff');
  } catch (err) {
    console.error('Camera init error:', err);
    document.getElementById('statusText').innerHTML = `Error: ${err.message}<br><small>Refresh page</small>`;
  }

  function onResults(results) {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks?.length > 0) {
      const landmarks = results.multiHandLandmarks[0];

      // Draw
      if (typeof drawConnectors !== 'undefined' && typeof drawLandmarks !== 'undefined') {
        drawConnectors(ctx, landmarks, Hands.HAND_CONNECTIONS, { color: '#4f8aff', lineWidth: 4 });
        drawLandmarks(ctx, landmarks, { color: '#ffd166', lineWidth: 2, radius: 5 });
      }

      const gesture = window.getGesture(landmarks);
      if (gesture) {
        window.sentence.addToSentence(gesture);

        // Live badge
        document.getElementById('badgeIcon').textContent = gesture.emoji || '🤟';
        document.getElementById('badgeGesture').textContent = gesture.fil;
        document.getElementById('confidenceFill').style.width = `${Math.round((gesture.confidence || 0.8) * 100)}%`;

        document.getElementById('currentFil').textContent = gesture.fil;
        document.getElementById('currentEn').textContent = gesture.en;
        document.getElementById('confPercent').textContent = `${Math.round((gesture.confidence || 0.8) * 100)}%`;
      }
    } else {
      document.getElementById('badgeGesture').textContent = '—';
      document.getElementById('confidenceFill').style.width = '0%';
    }
    ctx.restore();
  }

  function resizeCanvas() {
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
  }
  video.addEventListener('loadedmetadata', resizeCanvas);
  window.addEventListener('resize', resizeCanvas);
}

// Start everything
window.addEventListener('load', async () => {
  await window.tts.init();
  await initCamera();

  // Buttons
  document.getElementById('speakBtn').addEventListener('click', () => {
    const filText = document.getElementById('sentenceDisplay').innerText.replace(/[\u200B-\u200D\uFEFF]/g, '').trim();
    const voiceMode = document.getElementById('voiceSelect').value;

    if (voiceMode === 'fil' || voiceMode === 'both') window.tts.speak(filText, 'fil');
    if (voiceMode === 'en' || voiceMode === 'both') window.tts.speak(document.getElementById('sentenceEn').innerText, 'en');
  });

  document.getElementById('clearBtn').addEventListener('click', window.sentence.clearSentence);
  document.getElementById('undoBtn').addEventListener('click', window.sentence.undoLastWord);

  console.log('%c🚀 Mute Translator App Fully Initialized!', 'color:#4f8aff; font-size:1.1rem');
});
