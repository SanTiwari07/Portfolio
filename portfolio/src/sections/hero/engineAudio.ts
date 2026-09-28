import { drive, onDriveFrame } from './driveState';

// Opt-in engine sound built from a real recording of a Porsche 911R
// (Goodwood Festival of Speed, 2009 — see public/sounds/porsche/LICENSE.txt).
//
//  • 911-launch.mp3 — the car pulling away from the line, played when the engine starts
//  • 911-loop.wav   — a seamless loop cut from the same run, pitch-shifted by rpm
//
// RPM climbs through PDK-style gears (the same bands the HUD shows), so the real
// engine note drops on each upshift as you scroll faster.

const LAUNCH_URL = '/sounds/porsche/911-launch.mp3';
const LOOP_URL = '/sounds/porsche/911-loop.wav';
/** Approximate rpm the loop was recorded at; playback rate = rpm / LOOP_RPM. */
const LOOP_RPM = 4400;
const IDLE_RPM = 3000;
const REDLINE_RPM = 7200;
const KMH_PER_GEAR = 42;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let loop: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
let unsubscribe: (() => void) | null = null;
const buffers = new Map<string, Promise<AudioBuffer | null>>();

function load(url: string): Promise<AudioBuffer | null> {
  const audio = ctx!;
  let buf = buffers.get(url);
  if (!buf) {
    buf = fetch(url)
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(`${r.status} ${url}`))))
      .then((data) => audio.decodeAudioData(data))
      .catch(() => null);
    buffers.set(url, buf);
  }
  return buf;
}

function rpmFor(kmh: number) {
  if (kmh < 2) return IDLE_RPM;
  const gearFraction = (kmh % KMH_PER_GEAR) / KMH_PER_GEAR;
  // first gear revs from idle; later gears land at ~4200 rpm after the upshift
  const floor = kmh < KMH_PER_GEAR ? 3000 : 4200;
  return floor + gearFraction * (REDLINE_RPM - floor);
}

export async function startEngine() {
  ctx ??= new AudioContext();
  // don't block on resume(): some browsers only settle it once audio is audible
  void ctx.resume();
  if (master) return;
  const audio = ctx;
  const out = audio.createGain();
  out.gain.value = 0.5;
  out.connect(audio.destination);
  master = out;

  const [launch, loopBuffer] = await Promise.all([load(LAUNCH_URL), load(LOOP_URL)]);
  if (master !== out) return; // stopped while loading

  // the real car pulling away
  const launchDelay = launch ? Math.max(0, launch.duration - 1.2) : 0;
  if (launch) {
    const s = audio.createBufferSource();
    s.buffer = launch;
    s.connect(out);
    s.start();
  }
  if (!loopBuffer) return;

  // then settle into the looped engine note, faded in under the tail of the launch
  const src = audio.createBufferSource();
  src.buffer = loopBuffer;
  src.loop = true;
  const gain = audio.createGain();
  gain.gain.value = 0;
  src.connect(gain).connect(out);
  src.start(audio.currentTime + launchDelay);
  loop = { src, gain };

  let rpm = IDLE_RPM;
  let lastSpeed = 0;
  let last = performance.now();
  const loopStartsAt = performance.now() + launchDelay * 1000;
  unsubscribe = onDriveFrame(() => {
    const t = performance.now();
    const dt = Math.min((t - last) / 1000, 0.1);
    last = t;
    if (!loop || t < loopStartsAt) return;
    const speed = Math.abs(drive.speed);
    const kmh = Math.min(speed * 4, 330);
    const accelerating = speed - lastSpeed > dt * 0.8;
    lastSpeed = speed;
    rpm += (rpmFor(kmh) - rpm) * Math.min(1, dt * 9);
    const now = audio.currentTime;
    // stay near the recording's natural pitch so it keeps sounding like the real car
    loop.src.playbackRate.setTargetAtTime(Math.min(rpm / LOOP_RPM, 1.35), now, 0.05);
    const level = kmh < 2 ? 0.18 : accelerating ? 0.75 : 0.45;
    loop.gain.gain.setTargetAtTime(level, now, 0.12);
  });
}

export function stopEngine() {
  unsubscribe?.();
  unsubscribe = null;
  if (!ctx || !master) return;
  const out = master;
  const current = loop;
  out.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
  setTimeout(() => {
    current?.src.stop();
    out.disconnect();
  }, 600);
  master = null;
  loop = null;
}

export async function honk() {
  if (!ctx) return;
  const buffer = await load('/sounds/game/honk.mp3');
  if (!buffer) return;
  const s = ctx.createBufferSource();
  const g = ctx.createGain();
  g.gain.value = 0.35;
  s.buffer = buffer;
  s.connect(g).connect(ctx.destination);
  s.start();
  s.stop(ctx.currentTime + 0.6);
}
