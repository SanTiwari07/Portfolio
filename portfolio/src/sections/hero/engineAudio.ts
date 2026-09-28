import { drive, onDriveFrame } from './driveState';

// Opt-in engine sound, driven by scroll speed.
//
// By default this synthesises a turbocharged flat-six in Web Audio: firing pulses at
// 3× crank frequency, a boxer half-order rumble, intake rasp, turbo spool whistle,
// blow-off on lift and overrun crackle. RPM climbs through PDK-style gears (the same
// bands the HUD shows), so upshifts drop the revs like the real car.
//
// Drop a licensed recording at RECORDING_URL (a seamless loop at ~3000 rpm) and it
// is used instead of the synth, pitch-shifted by RPM.

const RECORDING_URL = '/sounds/porsche/911-turbo-loop.mp3';
const IDLE_RPM = 950;
const REDLINE_RPM = 7200;
const KMH_PER_GEAR = 42;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let engine: { update: (rpm: number, throttle: number, dt: number) => void; stop: () => void } | null = null;
let unsubscribe: (() => void) | null = null;
const buffers = new Map<string, Promise<AudioBuffer | null>>();

function load(url: string): Promise<AudioBuffer | null> {
  const audio = ctx!;
  let buf = buffers.get(url);
  if (!buf) {
    buf = fetch(url)
      .then((r) => {
        const type = r.headers.get('content-type') ?? '';
        // dev servers answer missing files with index.html — treat that as "not there"
        if (!r.ok || !type.startsWith('audio')) return null;
        return r.arrayBuffer().then((data) => audio.decodeAudioData(data));
      })
      .catch(() => null);
    buffers.set(url, buf);
  }
  return buf;
}

function noiseBuffer(audio: AudioContext, seconds = 2) {
  const buffer = audio.createBuffer(1, audio.sampleRate * seconds, audio.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
}

function softClip(amount: number) {
  const curve = new Float32Array(1024);
  for (let i = 0; i < curve.length; i++) {
    const x = (i / (curve.length - 1)) * 2 - 1;
    curve[i] = Math.tanh(x * amount) / Math.tanh(amount);
  }
  return curve;
}

// ─── Synthesised flat-six ─────────────────────────────────────────
function createSynthEngine(audio: AudioContext, out: AudioNode) {
  const now = audio.currentTime;
  const bus = audio.createGain();
  const shaper = audio.createWaveShaper();
  shaper.curve = softClip(2.4);
  shaper.oversample = '4x';
  const tone = audio.createBiquadFilter();
  tone.type = 'lowpass';
  tone.Q.value = 1.2;
  bus.connect(shaper).connect(tone).connect(out);

  // firing pulses (3 per crank revolution on a flat-six)
  const fire = audio.createOscillator();
  fire.type = 'sawtooth';
  const fireGain = audio.createGain();
  fireGain.gain.value = 0.5;
  fire.connect(fireGain).connect(bus);

  // boxer half-order rumble — the throaty undertone
  const rumble = audio.createOscillator();
  rumble.type = 'square';
  const rumbleGain = audio.createGain();
  rumbleGain.gain.value = 0.28;
  rumble.connect(rumbleGain).connect(bus);

  // upper harmonic for the rasp at high rpm
  const rasp = audio.createOscillator();
  rasp.type = 'sawtooth';
  const raspGain = audio.createGain();
  raspGain.gain.value = 0;
  rasp.connect(raspGain).connect(bus);

  // intake / exhaust breath
  const noise = audio.createBufferSource();
  noise.buffer = noiseBuffer(audio);
  noise.loop = true;
  const intake = audio.createBiquadFilter();
  intake.type = 'bandpass';
  intake.Q.value = 2.5;
  const intakeGain = audio.createGain();
  intakeGain.gain.value = 0.1;
  noise.connect(intake).connect(intakeGain).connect(bus);

  // turbo spool whistle (bypasses the distortion so it stays clean)
  const turbo = audio.createOscillator();
  turbo.type = 'sine';
  const turboGain = audio.createGain();
  turboGain.gain.value = 0;
  turbo.connect(turboGain).connect(out);

  [fire, rumble, rasp, noise, turbo].forEach((n) => n.start(now));

  let boost = 0;
  let lastThrottle = 0;

  const blowOff = (strength: number) => {
    const t = audio.currentTime;
    const src = audio.createBufferSource();
    src.buffer = noise.buffer;
    const bp = audio.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(2600, t);
    bp.frequency.exponentialRampToValueAtTime(900, t + 0.45);
    bp.Q.value = 0.9;
    const g = audio.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22 * strength, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    src.connect(bp).connect(g).connect(out);
    src.start(t, Math.random());
    src.stop(t + 0.55);
  };

  const crackle = () => {
    const t = audio.currentTime;
    const src = audio.createBufferSource();
    src.buffer = noise.buffer;
    const hp = audio.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 400;
    const g = audio.createGain();
    g.gain.setValueAtTime(0.18, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04 + Math.random() * 0.05);
    src.connect(hp).connect(g).connect(out);
    src.start(t, Math.random());
    src.stop(t + 0.1);
  };

  return {
    update(rpm: number, throttle: number, dt: number) {
      const t = audio.currentTime;
      const crankHz = rpm / 60;
      const load = Math.max(throttle, 0.15);
      fire.frequency.setTargetAtTime(crankHz * 3, t, 0.03);
      rumble.frequency.setTargetAtTime(crankHz * 1.5, t, 0.03);
      rasp.frequency.setTargetAtTime(crankHz * 6, t, 0.03);
      intake.frequency.setTargetAtTime(crankHz * 7.5, t, 0.05);
      tone.frequency.setTargetAtTime(350 + load * 2600 + (rpm / REDLINE_RPM) * 1400, t, 0.06);
      raspGain.gain.setTargetAtTime(0.18 * (rpm / REDLINE_RPM) * load, t, 0.06);
      intakeGain.gain.setTargetAtTime(0.05 + 0.2 * load, t, 0.06);
      bus.gain.setTargetAtTime(0.35 + 0.45 * load, t, 0.05);

      // boost builds with load × rpm and bleeds off when you lift
      const targetBoost = throttle * Math.min(1, rpm / 4200);
      boost += (targetBoost - boost) * Math.min(1, dt * (targetBoost > boost ? 2.2 : 6));
      turbo.frequency.setTargetAtTime(1800 + boost * 5200, t, 0.05);
      turboGain.gain.setTargetAtTime(boost * 0.035, t, 0.05);

      if (lastThrottle > 0.55 && throttle < 0.2 && boost > 0.35) blowOff(boost);
      if (throttle < 0.1 && rpm > 3000 && Math.random() < dt * 5) crackle();
      lastThrottle = throttle;
    },
    stop() {
      const t = audio.currentTime;
      bus.gain.setTargetAtTime(0, t, 0.08);
      turboGain.gain.setTargetAtTime(0, t, 0.08);
      setTimeout(() => [fire, rumble, rasp, noise, turbo].forEach((n) => n.stop()), 500);
    },
  };
}

// ─── Recorded loop (used when RECORDING_URL is present) ───────────
function createSampleEngine(audio: AudioContext, out: AudioNode, buffer: AudioBuffer) {
  const src = audio.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const g = audio.createGain();
  src.connect(g).connect(out);
  src.start();
  return {
    update(rpm: number, throttle: number) {
      const t = audio.currentTime;
      src.playbackRate.setTargetAtTime(rpm / 3000, t, 0.04);
      g.gain.setTargetAtTime(0.45 + throttle * 0.55, t, 0.06);
    },
    stop() {
      g.gain.setTargetAtTime(0, audio.currentTime, 0.08);
      setTimeout(() => src.stop(), 500);
    },
  };
}

// ─── Drive state → rpm / throttle ─────────────────────────────────
function rpmFor(kmh: number) {
  if (kmh < 2) return IDLE_RPM;
  const gearFraction = (kmh % KMH_PER_GEAR) / KMH_PER_GEAR;
  // first gear revs from idle; later gears land at ~3800 rpm after the upshift
  const floor = kmh < KMH_PER_GEAR ? 1400 : 3800;
  return floor + gearFraction * (REDLINE_RPM - floor);
}

export async function startEngine() {
  ctx ??= new AudioContext();
  // don't block on resume(): some browsers only settle it once audio is audible
  void ctx.resume();
  if (engine || master) return;
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  master.gain.setTargetAtTime(0.4, ctx.currentTime, 0.3);

  const recording = await load(RECORDING_URL);
  if (!ctx || !master) return;
  engine = recording ? createSampleEngine(ctx, master, recording) : createSynthEngine(ctx, master);

  let rpm = IDLE_RPM;
  let lastSpeed = 0;
  let last = performance.now();
  unsubscribe = onDriveFrame(() => {
    const t = performance.now();
    const dt = Math.min((t - last) / 1000, 0.1);
    last = t;
    const speed = Math.abs(drive.speed);
    const kmh = Math.min(speed * 4, 330);
    const accelerating = speed - lastSpeed > dt * 0.8;
    lastSpeed = speed;
    const throttle = accelerating ? Math.min(1, 0.55 + kmh / 300) : kmh > 2 ? 0.08 : 0;
    rpm += (rpmFor(kmh) - rpm) * Math.min(1, dt * 9);
    engine?.update(rpm, throttle, dt);
  });
}

export function stopEngine() {
  unsubscribe?.();
  unsubscribe = null;
  engine?.stop();
  engine = null;
  if (ctx && master) {
    const m = master;
    m.gain.setTargetAtTime(0, ctx.currentTime, 0.1);
    setTimeout(() => m.disconnect(), 600);
    master = null;
  }
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

