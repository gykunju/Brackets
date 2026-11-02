// Web Audio API Sound Synthesizer for Alarms and Reminders
// Self-contained: does not rely on external MP3/WAV assets

let audioCtx = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Play a gentle reminder chime (two-tone soft bell)
 */
export function playChimeSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // First tone (D5 - 587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.8);

    // Second tone (A5 - 880 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.15);

    gain2.gain.setValueAtTime(0, now + 0.15);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 1.2);
  } catch (err) {
    console.warn("Could not play chime sound:", err);
  }
}

/**
 * Play an energetic alarm sound for events happening now (3-burst chime)
 */
export function playAlarmSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const tones = [
      { freq: 523.25, time: 0.0 },  // C5
      { freq: 659.25, time: 0.15 }, // E5
      { freq: 783.99, time: 0.3 },  // G5
      { freq: 1046.50, time: 0.45 }, // C6
      // Second burst
      { freq: 659.25, time: 0.8 },  // E5
      { freq: 783.99, time: 0.95 }, // G5
      { freq: 1046.50, time: 1.1 }  // C6
    ];

    const now = ctx.currentTime;

    tones.forEach(({ freq, time }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + time);

      gain.gain.setValueAtTime(0, now + time);
      gain.gain.linearRampToValueAtTime(0.35, now + time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + time + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + 0.35);
    });
  } catch (err) {
    console.warn("Could not play alarm sound:", err);
  }
}

/**
 * Request audio context unlock on user interaction
 */
export function unlockAudio() {
  const ctx = getAudioContext();
  if (ctx && ctx.state === 'suspended') {
    return ctx.resume();
  }
  return Promise.resolve();
}
