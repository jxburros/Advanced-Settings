/* Desktop sounds and the music player. Interface sounds and the built-in hold music are
   synthesized with Web Audio, so there are no sound files to ship. Music comes from
   assets/music/tracks.json (see assets/music/README.md). Browsers only allow audio after the
   first click or key press; until then everything here stays silent. */
let ctx = null,
  master = null;
export const prefs = { sounds: true, alert: "chime", volume: 0.6 };
function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.connect(ctx.destination);
  }
  master.gain.value = prefs.volume;
  return ctx;
}
export function unlock() {
  try {
    return audio()?.resume();
  } catch {}
}
function tone(freq, at, dur, { type = "sine", gain = 0.15, to = null, out = master } = {}) {
  const c = ctx;
  const t = c.currentTime + at;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(out);
  o.start(t);
  o.stop(t + dur + 0.05);
}
function noise(at, dur, gain = 0.08, freq = 1200) {
  const c = ctx;
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * dur), c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const src = c.createBufferSource();
  const f = c.createBiquadFilter();
  const g = c.createGain();
  src.buffer = buf;
  f.type = "bandpass";
  f.frequency.value = freq;
  g.gain.value = gain;
  src.connect(f).connect(g).connect(master);
  src.start(c.currentTime + at);
}
export const ALERTS = { chime: "Chime", pop: "Pop", glass: "Glass", quack: "Quack" };
const ALERT = {
  chime: () => (tone(1318, 0, 0.35, { gain: 0.09 }), tone(1976, 0.09, 0.5, { gain: 0.07 })),
  pop: () => tone(660, 0, 0.12, { type: "triangle", gain: 0.14, to: 990 }),
  glass: () => (tone(2093, 0, 0.9, { gain: 0.06 }), tone(3136, 0.01, 0.7, { gain: 0.03 })),
  quack: () => {
    tone(560, 0, 0.16, { type: "sawtooth", gain: 0.07, to: 300 });
    tone(540, 0.2, 0.2, { type: "sawtooth", gain: 0.06, to: 260 });
  },
};
const SOUNDS = {
  click: () => tone(2400, 0, 0.025, { type: "square", gain: 0.02 }),
  open: () => tone(480, 0, 0.14, { gain: 0.07, to: 760 }),
  close: () => tone(760, 0, 0.12, { gain: 0.06, to: 440 }),
  minimize: () => tone(900, 0, 0.18, { gain: 0.05, to: 300 }),
  error: () => (tone(233, 0, 0.16, { type: "triangle", gain: 0.16 }), tone(196, 0.09, 0.2, { type: "triangle", gain: 0.13 })),
  message: () => (tone(880, 0, 0.09, { type: "triangle", gain: 0.1 }), tone(1320, 0.07, 0.14, { type: "triangle", gain: 0.09 })),
  success: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, i * 0.07, 0.3, { gain: 0.07 })),
  trash: () => noise(0, 0.35, 0.12, 900),
  lock: () => tone(180, 0, 0.2, { type: "triangle", gain: 0.15, to: 120 }),
  startup: () => [261.6, 329.6, 392, 523.2].forEach((f, i) => tone(f, i * 0.02, 1.8, { gain: 0.06 })),
  alert: () => ALERT[prefs.alert]?.(),
};
/* Plays an interface sound. `force` plays even with sounds off (for previews in Settings). */
export function play(name, force = false) {
  if ((!prefs.sounds && !force) || !SOUNDS[name]) return;
  try {
    if (!audio() || ctx.state !== "running") return;
    SOUNDS[name]();
  } catch {}
}
export function preview(alert) {
  try {
    if (!audio() || ctx.state !== "running") return;
    ALERT[alert]?.();
  } catch {}
}

/* ---------- music ---------- */
export const HOLD = { title: "Please Continue to Hold", artist: "Stillwater IT", synth: true, length: 16 };
export const player = { tracks: [HOLD], index: 0, playing: false, shuffle: false, repeat: false, volume: 0.7, position: 0, duration: HOLD.length, loaded: false, error: "" };
let el = null,
  holdStop = null,
  holdStart = 0,
  onChange = () => {};
export function onMusic(fn) {
  onChange = fn;
}
export async function loadTracks() {
  try {
    const res = await fetch("assets/music/tracks.json", { cache: "no-cache" });
    if (!res.ok) throw Error("no list");
    const list = await res.json();
    const valid = (Array.isArray(list) ? list : [])
      .filter((t) => t && typeof t.file === "string" && /^[\w ./()&'-]+$/.test(t.file) && !t.file.includes(".."))
      .slice(0, 200)
      .map((t) => ({ title: String(t.title || t.file).slice(0, 80), artist: String(t.artist || "").slice(0, 80), file: "assets/music/" + t.file }));
    player.tracks = [...valid, HOLD];
  } catch {
    player.tracks = [HOLD];
  }
  player.loaded = true;
  onChange();
}
const current = () => player.tracks[player.index];
/* Four bars of gentle hold music, looped. Bossa-ish, mostly. */
const CHORDS = [
  [220, 261.6, 329.6, 392],
  [196, 246.9, 293.7, 370],
  [174.6, 220, 261.6, 329.6],
  [164.8, 207.7, 246.9, 329.6],
];
function holdLoop() {
  const c = audio();
  if (!c) return () => {};
  const gain = c.createGain();
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 1800;
  gain.gain.value = player.volume * 0.8;
  gain.connect(lp).connect(master);
  let stopped = false,
    timer = 0;
  const bar = 2;
  const schedule = (start) => {
    if (stopped) return;
    CHORDS.forEach((chord, b) => {
      for (let k = 0; k < 8; k++) {
        const f = chord[[0, 2, 1, 3, 2, 1, 3, 2][k]];
        const at = start + b * bar * 2 + k * 0.5 - c.currentTime;
        if (at >= -0.01) tone(f * 2, Math.max(0, at), 0.45, { type: "triangle", gain: 0.05, out: gain });
      }
      const bassAt = start + b * bar * 2 - c.currentTime;
      if (bassAt >= -0.01) tone(chord[0] / 2, Math.max(0, bassAt), 1.8, { gain: 0.08, out: gain });
    });
    const next = start + CHORDS.length * bar * 2;
    timer = setTimeout(() => schedule(next), (next - c.currentTime - 1) * 1000);
  };
  schedule(c.currentTime + 0.05);
  return (v) => {
    if (v !== undefined) return void (gain.gain.value = v * 0.8);
    stopped = true;
    clearTimeout(timer);
    gain.gain.setTargetAtTime(0.0001, c.currentTime, 0.05);
    setTimeout(() => gain.disconnect(), 400);
  };
}
function stopAll() {
  if (el) {
    el.pause();
    el.onended = el.ontimeupdate = el.onloadedmetadata = el.onerror = null;
    el = null;
  }
  if (holdStop) holdStop(), (holdStop = null);
}
export function playTrack(i) {
  stopAll();
  player.index = (i + player.tracks.length) % player.tracks.length;
  player.position = 0;
  player.error = "";
  const t = current();
  if (t.synth) {
    holdStop = holdLoop();
    holdStart = Date.now();
    player.duration = t.length;
  } else {
    audio();
    el = new Audio(t.file);
    el.volume = player.volume;
    el.onloadedmetadata = () => ((player.duration = el.duration || 0), onChange());
    el.ontimeupdate = () => (player.position = el.currentTime);
    el.onended = () => next(true);
    el.onerror = () => ((player.error = `Couldn’t play ${t.file}.`), (player.playing = false), onChange());
    el.play().catch(() => {});
  }
  player.playing = true;
  onChange();
}
export function toggle() {
  if (!player.playing) {
    const t = current();
    if (el && !t.synth) {
      el.play().catch(() => {});
      player.playing = true;
      onChange();
    } else playTrack(player.index);
    return;
  }
  if (el) el.pause();
  if (holdStop) holdStop(), (holdStop = null);
  player.playing = false;
  onChange();
}
export function next(auto = false) {
  if (auto && player.repeat) return playTrack(player.index);
  if (player.shuffle && player.tracks.length > 1) {
    let i;
    do i = Math.floor(Math.random() * player.tracks.length);
    while (i === player.index);
    return playTrack(i);
  }
  playTrack(player.index + 1);
}
export function prev() {
  if (player.position > 3) return playTrack(player.index);
  playTrack(player.index - 1);
}
export function setVolume(v) {
  player.volume = Math.min(1, Math.max(0, v));
  if (el) el.volume = player.volume;
  if (holdStop) holdStop(player.volume);
}
export function seek(t) {
  if (el && Number.isFinite(t)) el.currentTime = t;
}
/* Called by the desktop clock: advances the synthesized track's position. */
export function step() {
  if (player.playing && current().synth) player.position = ((Date.now() - holdStart) / 1000) % HOLD.length;
}
/* Seconds the hold music has been playing without a break. */
export const holdHeard = () => (player.playing && current().synth ? (Date.now() - holdStart) / 1000 : 0);
