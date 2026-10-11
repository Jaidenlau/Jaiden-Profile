// Regenerate: node tools/compose-music.js loop.wav && ffmpeg -i loop.wav -codec:a libmp3lame -b:a 160k public/media/music.mp3
// Original chillhop loop for the site's radio. Pure JS synthesis -> 16-bit WAV.
// Structure: 4-bar intro, then a 16-bar section designed to loop seamlessly.
const fs = require('fs');
const SR = 44100, BPM = 86, BAR_SAMPLES = Math.round((60 / BPM) * 4 * SR), BAR = BAR_SAMPLES / SR, BEAT = BAR / 4; // whole-sample bars so every loop copy is identical
const INTRO_BARS = 4, LOOP_BARS = 16;
const TOTAL_BARS = INTRO_BARS + LOOP_BARS * 3; // three identical copies; the middle one is the loop, so tails and early notes wrap
const N = Math.ceil((TOTAL_BARS * BAR + 3) * SR);
const L = new Float32Array(N), R = new Float32Array(N);

// Deterministic randomness for humanising
let seed = 7; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const NOTE = { C: 0, 'C#': 1, D: 2, 'D#': 3, E: 4, F: 5, 'F#': 6, G: 7, 'G#': 8, A: 9, 'A#': 10, B: 11 };
const midi = (n) => { const m = /^([A-G]#?)(\d)$/.exec(n); return 12 * (+m[2] + 1) + NOTE[m[1]]; };

function add(t0, buf, gainL, gainR) {
  const s0 = Math.round(t0 * SR);
  for (let i = 0; i < buf.length; i++) { const j = s0 + i; if (j < 0 || j >= N) continue; L[j] += buf[i] * gainL; R[j] += buf[i] * gainR; }
}
const pan = (p) => [Math.cos((p + 1) * Math.PI / 4), Math.sin((p + 1) * Math.PI / 4)];

// --- Instruments --------------------------------------------------------
function rhodes(f, dur, vel, bright = 1) {
  const len = Math.floor((dur + 0.6) * SR), out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const idx = (1.4 * Math.exp(-t * 7) + 0.18) * bright;
    const mod = Math.sin(2 * Math.PI * f * t) * idx;
    let env = Math.min(1, t / 0.004) * (0.55 * Math.exp(-t * 2.2) + 0.45 * Math.exp(-t * 0.6));
    if (t > dur) env *= Math.exp(-(t - dur) * 9);
    const tine = 0.06 * Math.sin(2 * Math.PI * f * 4.01 * t) * Math.exp(-t * 14) * bright;
    out[i] = (Math.sin(2 * Math.PI * f * t + mod) + tine) * env * vel;
  }
  return out;
}
function bass(f, dur, vel) {
  const len = Math.floor((dur + 0.25) * SR), out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    let env = Math.min(1, t / 0.008) * (0.7 * Math.exp(-t * 1.6) + 0.3);
    if (t > dur) env *= Math.exp(-(t - dur) * 18);
    out[i] = (Math.sin(2 * Math.PI * f * t) + 0.22 * Math.sin(4 * Math.PI * f * t) + 0.06 * Math.sin(6 * Math.PI * f * t)) * env * vel;
  }
  return out;
}
function kick(vel) {
  const len = Math.floor(0.45 * SR), out = new Float32Array(len); let ph = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, f = 46 + 70 * Math.exp(-t * 28);
    ph += 2 * Math.PI * f / SR;
    out[i] = Math.tanh(1.6 * Math.sin(ph)) * Math.exp(-t * 8.5) * vel + (t < 0.003 ? (rnd() * 2 - 1) * 0.15 * vel : 0);
  }
  return out;
}
function snare(vel) {
  const len = Math.floor(0.3 * SR), out = new Float32Array(len); let lp = 0, prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, n = rnd() * 2 - 1;
    lp += 0.35 * (n - lp); const hp = lp - prev; prev = lp; // band-limited noise
    out[i] = (hp * 1.4 * Math.exp(-t * 20) + 0.5 * Math.sin(2 * Math.PI * 185 * t) * Math.exp(-t * 32)) * vel;
  }
  return out;
}
function hat(vel) {
  const len = Math.floor(0.09 * SR), out = new Float32Array(len); let prev = 0;
  for (let i = 0; i < len; i++) {
    const t = i / SR, n = rnd() * 2 - 1, hp = n - prev; prev = n * 0.98;
    out[i] = hp * Math.exp(-t * 55) * vel;
  }
  return out;
}
function bell(f, dur, vel) {
  const len = Math.floor((dur + 1.0) * SR), out = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SR;
    const env = Math.min(1, t / 0.003) * Math.exp(-t * 3.2);
    out[i] = (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * f * 2 * t) * Math.exp(-t * 6) + 0.08 * Math.sin(2 * Math.PI * f * 3.01 * t) * Math.exp(-t * 9)) * env * vel;
  }
  return out;
}

// --- Harmony (D major: IV - iii - ii - V) --------------------------------
const CHORDS = [
  { root: 'G2', fifth: 'D3', keys: ['B3', 'D4', 'F#4', 'A4'] },   // Gmaj9
  { root: 'F#2', fifth: 'C#3', keys: ['A3', 'C#4', 'E4', 'A4'] }, // F#m7
  { root: 'E2', fifth: 'B2', keys: ['G3', 'B3', 'D4', 'F#4'] },   // Em9
  { root: 'A2', fifth: 'E3', keys: ['G3', 'B3', 'C#4', 'F#4'] },  // A13
];
// Bell melody, one phrase per chord: [beat, note, beats]
const MELODY = [
  [[0.5, 'B5', 0.6], [1.25, 'A5', 0.6], [2.0, 'F#5', 1.0], [3.0, 'D5', 0.8]],
  [[0.75, 'A5', 0.6], [1.5, 'F#5', 0.6], [2.5, 'E5', 0.8], [3.5, 'C#5', 0.5]],
  [[0.5, 'B5', 0.5], [1.0, 'F#5', 0.6], [2.0, 'E5', 0.8], [3.0, 'D5', 0.8]],
  [[0.75, 'E5', 0.5], [1.5, 'F#5', 0.5], [2.25, 'G5', 0.7], [3.25, 'C#5', 0.7]],
];

const swing = (b) => (Math.abs(b % 1 - 0.5) < 1e-6 ? b + 0.08 : b); // laid-back offbeats
const hum = (s = 0.008) => (rnd() * 2 - 1) * s;

function playBar(barIndex, ch, opts) {
  const t0 = barIndex * BAR;
  const at = (beat) => t0 + swing(beat) * BEAT;
  // Keys: comping with a gentle strum
  const hits = opts.intro ? [[0, 3.6, 0.8]] : [[0, 1.4, 1], [1.5, 0.45, 0.55], [2.5, 1.35, 0.8]];
  for (const [b, d, v] of hits) {
    ch.keys.forEach((n, k) => {
      const [gl, gr] = pan(-0.25 + k * 0.17);
      add(at(b) + k * 0.012 + hum(), rhodes(hz(midi(n)), d * BEAT, (opts.intro ? 0.16 : 0.13) * v * (0.85 + rnd() * 0.3), opts.intro ? 0.7 : 1), gl, gr);
    });
  }
  if (opts.intro) return;
  // Bass
  const nextRoot = midi(CHORDS[(CHORDS.indexOf(ch) + 1) % 4].root);
  const approach = nextRoot + (midi(ch.root) > nextRoot ? 1 : -1);
  for (const [b, n, d, v] of [[0, midi(ch.root), 1.25, 1], [1.75, midi(ch.root), 0.25, 0.55], [2.5, midi(ch.fifth), 0.75, 0.8], [3.5, approach, 0.45, 0.7]]) {
    add(at(b) + hum(0.004), bass(hz(n), d * BEAT, 0.22 * v), 0.71, 0.71);
  }
  // Drums
  for (const b of [0, 2.5]) add(at(b), kick(0.45), 0.71, 0.71);
  if (rnd() < 0.35) add(at(1.75), kick(0.22), 0.71, 0.71);
  for (const b of [1, 3]) { const [gl, gr] = pan(0.08); add(at(b) + 0.014, snare(0.3 * (0.9 + rnd() * 0.2)), gl, gr); }
  for (let b = 0; b < 4; b += 0.5) { const [gl, gr] = pan(0.3); add(at(b) + hum(0.006), hat((b % 1 ? 0.1 : 0.14) * (0.75 + rnd() * 0.5)), gl, gr); }
  // Melody in the second half of each loop
  if (opts.melody) {
    for (const [b, n, d] of MELODY[CHORDS.indexOf(ch)]) {
      const [gl, gr] = pan(-0.15 + rnd() * 0.3);
      add(at(b) + hum(0.01), bell(hz(midi(n)), d * BEAT, 0.075 * (0.85 + rnd() * 0.3)), gl, gr);
    }
  }
}

for (let bar = 0; bar < TOTAL_BARS; bar++) {
  const ch = CHORDS[bar % 4];
  const intro = bar < INTRO_BARS;
  const inLoop = (bar - INTRO_BARS) % LOOP_BARS;
  seed = intro ? 1000 + bar : 7 + inLoop * 7919; // same humanising in every copy of the loop
  playBar(bar, ch, { intro, melody: !intro && inLoop >= 8 });
}

// Vinyl texture: soft hiss + sparse crackle
// The texture repeats with the loop too, so the loop point is seamless.
let nseed = 99; const nrnd = () => ((nseed = (nseed * 1664525 + 1013904223) >>> 0) / 4294967296);
const introLen = INTRO_BARS * BAR_SAMPLES, loopLen = LOOP_BARS * BAR_SAMPLES;
const tex = new Float32Array(introLen + loopLen);
for (let i = 0, lp = 0; i < tex.length; i++) {
  lp += 0.05 * ((nrnd() * 2 - 1) - lp);
  let v = lp * 0.012;
  if (nrnd() < 6 / SR) v += (nrnd() * 2 - 1) * 0.04;
  tex[i] = v;
}
for (let i = 0; i < N; i++) {
  const v = i < introLen ? tex[i] : tex[introLen + ((i - introLen) % loopLen)];
  L[i] += v; R[i] += v * 0.9;
}

// --- Reverb (small Freeverb) -----------------------------------------------
function reverb(x, offset) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617].map((d) => ({ buf: new Float32Array(d + offset), i: 0, s: 0 }));
  const aps = [556, 441, 341, 225].map((d) => ({ buf: new Float32Array(d + offset), i: 0 }));
  const out = new Float32Array(x.length), fb = 0.82, damp = 0.35;
  for (let n = 0; n < x.length; n++) {
    const inp = x[n] * 0.015; let s = 0;
    for (const c of combs) { const y = c.buf[c.i]; c.s = y * (1 - damp) + c.s * damp; c.buf[c.i] = inp + c.s * fb; c.i = (c.i + 1) % c.buf.length; s += y; }
    for (const a of aps) { const y = a.buf[a.i]; a.buf[a.i] = s + y * 0.5; a.i = (a.i + 1) % a.buf.length; s = y - s; }
    out[n] = s;
  }
  return out;
}
const wetL = reverb(L, 0), wetR = reverb(R, 23);

// --- Master: reverb mix, warm low-pass, soft saturation ----------------------
let lpL = 0, lpR = 0, peak = 0;
const a = 1 - Math.exp(-2 * Math.PI * 7800 / SR);
for (let i = 0; i < N; i++) {
  let l = L[i] + wetL[i] * 0.9, r = R[i] + wetR[i] * 0.9;
  lpL += a * (l - lpL); lpR += a * (r - lpR);
  L[i] = Math.tanh(lpL * 1.4) / 1.4; R[i] = Math.tanh(lpR * 1.4) / 1.4;
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}

// --- Cut: intro + the second copy of the loop (its start carries the first copy's tail)
const introS = INTRO_BARS * BAR_SAMPLES, loopS = LOOP_BARS * BAR_SAMPLES;
const outLen = introS + loopS, gain = 0.89 / peak;
const pcm = Buffer.alloc(44 + outLen * 4);
const src = (i) => (i < introS ? i : i + loopS); // middle copy: its start carries the previous copy's tail, its end the next copy's early notes
for (let i = 0; i < outLen; i++) {
  const k = src(i);
  pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(L[k] * gain * 32767))), 44 + i * 4);
  pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(R[k] * gain * 32767))), 46 + i * 4);
}
pcm.write('RIFF', 0); pcm.writeUInt32LE(36 + outLen * 4, 4); pcm.write('WAVE', 8); pcm.write('fmt ', 12);
pcm.writeUInt32LE(16, 16); pcm.writeUInt16LE(1, 20); pcm.writeUInt16LE(2, 22); pcm.writeUInt32LE(SR, 24);
pcm.writeUInt32LE(SR * 4, 28); pcm.writeUInt16LE(4, 32); pcm.writeUInt16LE(16, 34); pcm.write('data', 36); pcm.writeUInt32LE(outLen * 4, 40);
fs.writeFileSync(process.argv[2] || 'loop.wav', pcm);
console.log(JSON.stringify({ introStart: 0, loopStart: +(introS / SR).toFixed(4), loopEnd: +(outLen / SR).toFixed(4), seconds: +(outLen / SR).toFixed(2), peakBeforeNorm: +peak.toFixed(3) }));
