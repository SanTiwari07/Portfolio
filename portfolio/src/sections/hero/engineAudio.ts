import { drive, onDriveFrame } from './driveState';

// Opt-in engine note: a looped sample whose pitch and level follow scroll speed.
// Created lazily on the first user gesture so browsers allow playback.

let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let source: AudioBufferSourceNode | null = null;
let unsubscribe: (() => void) | null = null;
const buffers = new Map<string, Promise<AudioBuffer>>();

function load(url: string) {
  if (!ctx) throw new Error('audio context not started');
  let buf = buffers.get(url);
  if (!buf) {
    const audio = ctx;
    buf = fetch(url)
      .then((r) => r.arrayBuffer())
      .then((data) => audio.decodeAudioData(data));
    buffers.set(url, buf);
  }
  return buf;
}

export async function startEngine() {
  ctx ??= new AudioContext();
  await ctx.resume();
  if (source) return;
  gain = ctx.createGain();
  gain.gain.value = 0;
  gain.connect(ctx.destination);
  const buffer = await load('/sounds/game/engine.mp3');
  source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(gain);
  source.start();

  unsubscribe = onDriveFrame(() => {
    if (!ctx || !source || !gain) return;
    const v = Math.min(Math.abs(drive.speed) / 60, 1);
    const now = ctx.currentTime;
    source.playbackRate.setTargetAtTime(0.75 + v * 1.5, now, 0.08);
    gain.gain.setTargetAtTime(0.08 + v * 0.32, now, 0.1);
  });
}

export function stopEngine() {
  unsubscribe?.();
  unsubscribe = null;
  if (ctx && gain) gain.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
  const s = source;
  source = null;
  if (s) setTimeout(() => s.stop(), 400);
}

export async function honk() {
  if (!ctx) return;
  const buffer = await load('/sounds/game/honk.mp3');
  const s = ctx.createBufferSource();
  const g = ctx.createGain();
  g.gain.value = 0.35;
  s.buffer = buffer;
  s.connect(g).connect(ctx.destination);
  s.start();
  s.stop(ctx.currentTime + 0.6);
}
