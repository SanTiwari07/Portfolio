import gsap from 'gsap';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import carModelUrl from '../../Car Stock Image/porsche_911_turbo_s.glb?url';

let gameActive = false;
let rafId: number | null = null;
let audioCtx: AudioContext | null = null;
let engineOsc: OscillatorNode | null = null;
let engineGain: GainNode | null = null;

// Persistence
const BEST_SCORE_KEY = 'gt3rs_best';

async function loadCarSprite(): Promise<HTMLCanvasElement> {
  return new Promise((resolve) => {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(300, 200);
    
    const scene = new THREE.Scene();
    
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(2, 4, 3);
    scene.add(mainLight);
    
    const rearLight = new THREE.DirectionalLight(0xff4444, 0.4);
    rearLight.position.set(-2, 1, -3);
    scene.add(rearLight);
    
    const camera = new THREE.PerspectiveCamera(45, 300 / 200, 0.1, 100);
    camera.position.set(0, 1.2, 4.5);
    camera.lookAt(0, 0.5, 0);
    
    const loader = new GLTFLoader();
    loader.load(carModelUrl, (gltf) => {
      const car = gltf.scene;
      
      car.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          // Make light parts Shark Blue
          if (child.material.color.getHex() > 0xcccccc) {
             child.material = child.material.clone();
             child.material.color.set('#1B4F8A');
          }
        }
      });
      
      scene.add(car);
      renderer.render(scene, camera);
      
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = 300;
      offscreenCanvas.height = 200;
      const offCtx = offscreenCanvas.getContext('2d')!;
      offCtx.drawImage(renderer.domElement, 0, 0);
      
      renderer.dispose();
      resolve(offscreenCanvas);
    });
  });
}

export function initGame() {
  if (gameActive) return;
  gameActive = true;

  // DOM Setup
  const body = document.body;
  const originalRoot = document.getElementById('root');

  // GSAP Black Overlay
  const curtain = document.createElement('div');
  curtain.style.position = 'fixed';
  curtain.style.inset = '0';
  curtain.style.backgroundColor = '#000';
  curtain.style.zIndex = '9998';
  curtain.style.transformOrigin = 'bottom right';
  curtain.style.transform = 'scale(0)';
  body.appendChild(curtain);

  // Canvas
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.inset = '0';
  canvas.style.zIndex = '9999';
  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 0.3s';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  body.appendChild(canvas);
  const ctx = canvas.getContext('2d')!;

  // HUD
  const hudContainer = document.createElement('div');
  hudContainer.style.position = 'fixed';
  hudContainer.style.inset = '0';
  hudContainer.style.zIndex = '10000';
  hudContainer.style.pointerEvents = 'none';
  hudContainer.style.fontFamily = 'monospace';
  hudContainer.style.color = 'white';
  hudContainer.style.opacity = '0';
  hudContainer.style.transition = 'opacity 0.3s';
  body.appendChild(hudContainer);

  const distanceEl = document.createElement('div');
  distanceEl.style.position = 'absolute';
  distanceEl.style.top = '20px';
  distanceEl.style.left = '20px';
  distanceEl.style.fontSize = '24px';
  distanceEl.style.fontWeight = 'bold';
  hudContainer.appendChild(distanceEl);

  const speedEl = document.createElement('div');
  speedEl.style.position = 'absolute';
  speedEl.style.top = '20px';
  speedEl.style.right = '20px';
  speedEl.style.fontSize = '24px';
  speedEl.style.fontWeight = 'bold';
  hudContainer.appendChild(speedEl);

  const gearEl = document.createElement('div');
  gearEl.style.position = 'absolute';
  gearEl.style.bottom = '30px';
  gearEl.style.left = '50%';
  gearEl.style.transform = 'translateX(-50%)';
  gearEl.style.fontSize = '32px';
  gearEl.style.fontWeight = 'bold';
  gearEl.style.color = '#ff3333';
  hudContainer.appendChild(gearEl);

  const exitBtn = document.createElement('div');
  exitBtn.innerText = 'X';
  exitBtn.style.position = 'absolute';
  exitBtn.style.top = '20px';
  exitBtn.style.left = '50%';
  exitBtn.style.transform = 'translateX(-50%)';
  exitBtn.style.fontSize = '24px';
  exitBtn.style.cursor = 'pointer';
  exitBtn.style.pointerEvents = 'auto';
  exitBtn.style.color = '#fff';
  exitBtn.style.fontWeight = 'bold';
  exitBtn.style.padding = '10px';
  hudContainer.appendChild(exitBtn);

  // Result Screen (hidden initially)
  const resultScreen = document.createElement('div');
  resultScreen.style.position = 'absolute';
  resultScreen.style.inset = '0';
  resultScreen.style.display = 'none';
  resultScreen.style.flexDirection = 'column';
  resultScreen.style.alignItems = 'center';
  resultScreen.style.justifyContent = 'center';
  resultScreen.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
  resultScreen.style.pointerEvents = 'auto';
  hudContainer.appendChild(resultScreen);

  const resultTitle = document.createElement('h2');
  resultTitle.style.color = '#ff3333';
  resultTitle.style.fontSize = '48px';
  resultTitle.style.marginBottom = '20px';
  resultScreen.appendChild(resultTitle);

  const resultBest = document.createElement('p');
  resultBest.style.color = '#fff';
  resultBest.style.fontSize = '24px';
  resultBest.style.marginBottom = '40px';
  resultScreen.appendChild(resultBest);

  const tryAgainBtn = document.createElement('button');
  tryAgainBtn.innerText = 'TRY AGAIN';
  tryAgainBtn.style.padding = '12px 24px';
  tryAgainBtn.style.marginBottom = '16px';
  tryAgainBtn.style.backgroundColor = '#fff';
  tryAgainBtn.style.color = '#000';
  tryAgainBtn.style.border = 'none';
  tryAgainBtn.style.fontWeight = 'bold';
  tryAgainBtn.style.cursor = 'pointer';
  resultScreen.appendChild(tryAgainBtn);

  const backBtn = document.createElement('button');
  backBtn.innerText = 'BACK TO PORTFOLIO';
  backBtn.style.padding = '12px 24px';
  backBtn.style.backgroundColor = 'transparent';
  backBtn.style.color = '#fff';
  backBtn.style.border = '1px solid #fff';
  backBtn.style.fontWeight = 'bold';
  backBtn.style.cursor = 'pointer';
  resultScreen.appendChild(backBtn);

  // Audio setup
  const initAudio = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      engineOsc = audioCtx.createOscillator();
      engineGain = audioCtx.createGain();
      engineOsc.type = 'sawtooth';
      engineOsc.frequency.value = 80;
      engineGain.gain.value = 0;
      engineOsc.connect(engineGain);
      engineGain.connect(audioCtx.destination);
      engineOsc.start();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  const playCrashSound = () => {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 0.5; // 0.5 seconds
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  };

  const playMilestoneSound = () => {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 880;
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  };

  // Game State
  let carSprite: HTMLCanvasElement;
  let vpX = canvas.width / 2;
  let vpY = canvas.height * 0.35;
  let currentLane = 1; // 0, 1, 2
  let targetLaneX = 0;
  let playerX = 0;
  const laneWidths = [-1, 0, 1]; // logic positions
  let speed = 4; // px per frame road scroll equivalent
  let distance = 0;
  let nextMilestone = 500;
  let gameOver = false;
  let linesOffset = 0;
  
  type ObstacleType = 'truck' | 'cones' | 'barrier' | 'car';
  interface Obstacle {
    z: number;
    lane: number; // 0, 1, 2
    type: ObstacleType;
    width: number;
  }
  let obstacles: Obstacle[] = [];
  let frameCount = 0;
  let obstacleSpawnRate = 120; // Frames between spawns

  // Resize handler
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    vpX = canvas.width / 2;
    vpY = canvas.height * 0.35;
  };
  window.addEventListener('resize', resize);

  // Input
  let touchStartX = 0;
  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameOver && e.key === 'Escape') exitGame();
    if (gameOver) return;
    if (e.key === 'Escape') exitGame();
    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      currentLane = Math.max(0, currentLane - 1);
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      currentLane = Math.min(2, currentLane + 1);
    }
  };
  const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: TouchEvent) => {
    if (gameOver) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchEndX - touchStartX;
    if (diff > 30) currentLane = Math.min(2, currentLane + 1);
    else if (diff < -30) currentLane = Math.max(0, currentLane - 1);
  };

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchend', handleTouchEnd);

  // Projection logic
  const project = (xLogic: number, yLogic: number, zLogic: number) => {
    const scale = vpY / (vpY + zLogic);
    const projX = vpX + xLogic * scale * (canvas.width * 0.8);
    const projY = vpY + yLogic * scale * (canvas.height * 0.65);
    return { x: projX, y: projY, scale };
  };

  const spawnObstacle = () => {
    const types: ObstacleType[] = ['truck', 'cones', 'barrier'];
    if (distance > 2000) types.push('car');
    
    const type = types[Math.floor(Math.random() * types.length)];
    let lane = Math.floor(Math.random() * 3);
    
    // Barrier takes 2 lanes
    if (type === 'barrier' && lane === 2) lane = 1; 

    obstacles.push({
      z: 5000,
      lane,
      type,
      width: type === 'barrier' ? 2 : 1
    });
  };

  const update = () => {
    if (gameOver) return;

    distance += (speed * 0.05); // Rough m conversion
    linesOffset -= speed * 2;
    if (linesOffset < -100) linesOffset += 100;

    // Difficulty scaling
    if (distance > nextMilestone) {
      speed = Math.min(12, speed + 0.5);
      obstacleSpawnRate = Math.max(40, obstacleSpawnRate * 0.85);
      nextMilestone += 500;
      playMilestoneSound();
    }

    // Audio update
    if (engineGain && audioCtx) {
      engineGain.gain.setTargetAtTime(0.15, audioCtx.currentTime, 0.1);
      const targetFreq = 80 + (speed / 12) * 320;
      if (engineOsc) {
         engineOsc.frequency.setTargetAtTime(targetFreq, audioCtx.currentTime, 0.1);
      }
    }

    // Player Movement (lerp)
    targetLaneX = laneWidths[currentLane];
    playerX += (targetLaneX - playerX) * 0.15;

    // Obstacles
    frameCount++;
    if (frameCount > obstacleSpawnRate) {
      spawnObstacle();
      frameCount = 0;
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i];
      obs.z -= speed * 15;

      // Collision
      if (obs.z < 200 && obs.z > 0) {
        let hit = false;
        if (obs.type === 'barrier') {
           if (currentLane === obs.lane || currentLane === obs.lane + 1) hit = true;
        } else {
           if (currentLane === obs.lane) hit = true;
        }

        if (hit) {
          triggerGameOver();
          return;
        }
      }

      if (obs.z < -200) {
        obstacles.splice(i, 1);
      }
    }

    // HUD Update
    distanceEl.innerText = `${(distance / 1000).toFixed(2)} KM`;
    const kmh = Math.floor(80 + (speed / 12) * 240);
    speedEl.innerText = `${kmh} KM/H`;
    const gear = Math.min(6, Math.max(1, Math.floor(speed / 2)));
    gearEl.innerText = `GEAR ${gear}`;
  };

  const draw = () => {
    // Clear and draw sky/ground
    ctx.fillStyle = '#050510'; // Dark night sky
    ctx.fillRect(0, 0, canvas.width, vpY);
    
    ctx.fillStyle = '#111'; // Dark asphalt
    ctx.fillRect(0, vpY, canvas.width, canvas.height - vpY);

    // Draw Road Horizon
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(vpX - canvas.width * 0.05, vpY);
    ctx.lineTo(vpX + canvas.width * 0.05, vpY);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.fill();

    // Road Lines
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    for (let l = -0.5; l <= 0.5; l += 1) { // 2 separating lines for 3 lanes
      for (let z = 100 + (linesOffset % 100); z < 5000; z += 200) {
        const p1 = project(l * 0.33, 1, z);
        const p2 = project(l * 0.33, 1, z + 100);
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(255, 255, 255, ${Math.min(1, 1000/z)})`;
        ctx.lineWidth = p1.scale * 20;
        ctx.stroke();
      }
    }

    // Draw Obstacles (sort by Z for painter's algorithm)
    const sortedObs = [...obstacles].sort((a, b) => b.z - a.z);
    sortedObs.forEach(obs => {
      const xLogic = (obs.lane - 1) * 0.33 + (obs.width > 1 ? 0.165 : 0);
      const p = project(xLogic, 0.8, obs.z); // Slightly above ground
      
      const width = p.scale * canvas.width * 0.25 * obs.width;
      const height = p.scale * canvas.height * 0.2;

      ctx.save();
      ctx.translate(p.x, p.y - height);
      
      if (obs.type === 'truck') {
        ctx.fillStyle = '#555';
        ctx.fillRect(-width/2, 0, width, height);
        // taillights
        ctx.fillStyle = '#f00';
        ctx.fillRect(-width/2 + width*0.1, height*0.8, width*0.2, height*0.1);
        ctx.fillRect(width/2 - width*0.3, height*0.8, width*0.2, height*0.1);
      } else if (obs.type === 'cones') {
        ctx.fillStyle = '#ff6600';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-width/4, height);
        ctx.lineTo(width/4, height);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillRect(-width/6, height*0.4, width/3, height*0.2);
      } else if (obs.type === 'barrier') {
        ctx.fillStyle = '#ccc';
        ctx.fillRect(-width/2, height*0.5, width, height*0.5);
        // stripes
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        ctx.moveTo(-width/2, height*0.5);
        ctx.lineTo(-width/2 + width*0.2, height);
        ctx.lineTo(-width/2 + width*0.4, height);
        ctx.lineTo(-width/2 + width*0.2, height*0.5);
        ctx.fill();
      } else if (obs.type === 'car') {
        ctx.fillStyle = '#222';
        ctx.fillRect(-width/2, height*0.5, width, height*0.5);
        // oncoming headlights (strobe effect)
        if (Math.floor(Date.now() / 50) % 2 === 0) {
           ctx.fillStyle = '#fff';
           ctx.shadowColor = '#fff';
           ctx.shadowBlur = 20;
           ctx.beginPath();
           ctx.arc(-width*0.3, height*0.7, width*0.15, 0, Math.PI*2);
           ctx.arc(width*0.3, height*0.7, width*0.15, 0, Math.PI*2);
           ctx.fill();
           ctx.shadowBlur = 0;
        }
      }
      ctx.restore();
    });

    // Draw Player Car (Bottom Center, pseudo 3D)
    const pPlayer = project(playerX * 0.33, 1, 150); // z=150 is close to camera

    // Use rendered car sprite
    if (carSprite) {
      ctx.drawImage(carSprite, pPlayer.x - 100, canvas.height * 0.85 - 80, 200, 130);
    }

    // Red Vignette if Game Over
    if (gameOver) {
      ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  const loop = () => {
    update();
    draw();
    if (!gameOver) {
      rafId = requestAnimationFrame(loop);
    }
  };

  const triggerGameOver = () => {
    gameOver = true;
    playCrashSound();
    if (engineGain && audioCtx) {
       engineGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.1);
    }
    
    // Shake animation
    canvas.style.animation = 'shake 0.4s';
    if (!document.getElementById('shake-style')) {
      const style = document.createElement('style');
      style.id = 'shake-style';
      style.innerHTML = `
        @keyframes shake {
          0% { transform: translate(1px, 1px) rotate(0deg); }
          10% { transform: translate(-1px, -2px) rotate(-1deg); }
          20% { transform: translate(-3px, 0px) rotate(1deg); }
          30% { transform: translate(3px, 2px) rotate(0deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          50% { transform: translate(-1px, 2px) rotate(-1deg); }
          60% { transform: translate(-3px, 1px) rotate(0deg); }
          70% { transform: translate(3px, 1px) rotate(-1deg); }
          80% { transform: translate(-1px, -1px) rotate(1deg); }
          90% { transform: translate(1px, 2px) rotate(0deg); }
          100% { transform: translate(1px, -2px) rotate(-1deg); }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(() => {
      // Save Score
      const km = (distance / 1000).toFixed(2);
      let bestStr = localStorage.getItem(BEST_SCORE_KEY);
      let best = bestStr ? parseFloat(bestStr) : 0;
      if (parseFloat(km) > best) {
        best = parseFloat(km);
        localStorage.setItem(BEST_SCORE_KEY, best.toFixed(2));
      }

      resultTitle.innerText = `YOU CRASHED AT ${km} KM`;
      resultBest.innerText = `BEST: ${best.toFixed(2)} KM`;
      resultScreen.style.display = 'flex';
    }, 400); // 400ms freeze
  };

  const exitGame = () => {
    if (rafId) cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('touchstart', handleTouchStart);
    window.removeEventListener('touchend', handleTouchEnd);
    
    if (audioCtx) {
      audioCtx.close();
      audioCtx = null;
    }

    // GSAP Transition Out
    const tl = gsap.timeline({
      onComplete: () => {
        body.removeChild(curtain);
        body.removeChild(canvas);
        body.removeChild(hudContainer);
        gameActive = false;
      }
    });

    tl.to(canvas, { opacity: 0, duration: 0.3 })
      .to(hudContainer, { opacity: 0, duration: 0.3 }, "<")
      .to(originalRoot, { opacity: 1, duration: 0.4 }, "<")
      .to(curtain, { scale: 0, duration: 0.6, ease: 'power4.inOut' }, "-=0.2");
  };

  const resetGame = () => {
    distance = 0;
    speed = 4;
    nextMilestone = 500;
    obstacles = [];
    currentLane = 1;
    playerX = 0;
    gameOver = false;
    resultScreen.style.display = 'none';
    canvas.style.animation = ''; // remove shake
    initAudio();
    rafId = requestAnimationFrame(loop);
  };

  tryAgainBtn.onclick = resetGame;
  backBtn.onclick = exitGame;
  exitBtn.onclick = exitGame;

  // Intro Transition
  const tl = gsap.timeline({
    onComplete: async () => {
      // Draw Loading State
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('LOADING GT3 RS...', canvas.width / 2, canvas.height / 2);
      
      carSprite = await loadCarSprite();
      
      initAudio();
      rafId = requestAnimationFrame(loop);
    }
  });

  tl.to(curtain, { scale: 3, duration: 0.8, ease: 'power4.inOut' })
    .to(originalRoot, { opacity: 0, duration: 0.4 }, "-=0.4")
    .to(canvas, { opacity: 1, duration: 0.3 })
    .to(hudContainer, { opacity: 1, duration: 0.3 }, "<");
}
