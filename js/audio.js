/* =========================================
🎵 AUDIO — Web Audio API (No files needed)
========================================= */

let audioContext = null;
let footstepTimer = 0;
let footstepInterval = 0.5; // seconds

export function initAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    console.log("🎵 Audio initialized");
  }
  return audioContext;
}

/* =========================================
FOOTSTEP SOUND — صدای پا
========================================= */
export function playFootstep() {
  if (!audioContext) return;

  const now = audioContext.currentTime;

  /* صدای پا = نویز سفید کوتاه */
  const bufferSize = audioContext.sampleRate * 0.1; // 100ms
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;

  /* فیلتر برای نرم‌تر شدن صدا */
  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 400;

  /* Gain */
  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  source.start(now);
  source.stop(now + 0.1);
}

/* =========================================
UPDATE FOOTSTEPS — توی game loop
========================================= */
export function updateFootsteps(delta, isMoving, isRunning) {
  if (!audioContext) return;

  if (!isMoving) {
    footstepTimer = 0;
    return;
  }

  footstepTimer += delta;

  const interval = isRunning ? 0.3 : 0.5;

  if (footstepTimer >= interval) {
    footstepTimer = 0;
    playFootstep();
  }
}

/* =========================================
AMBIENT WIND — صدای باد
========================================= */
export function startAmbientWind() {
  if (!audioContext) return;

  /* نویز سفید بلند */
  const bufferSize = audioContext.sampleRate * 2;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3;
  }

  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;

  /* فیلتر lowpass برای حس باد */
  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 200;

  const gain = audioContext.createGain();
  gain.gain.value = 0.05;

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  source.start();

  console.log("🌬️ Ambient wind started");
}
