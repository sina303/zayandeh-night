/* =========================================
🌵 ZAYANDEH NIGHT — Day 3: Flashlight + Audio
========================================= */
import * as THREE from 'three';
import { createHouse } from './house.js';
import { initAudio, updateFootsteps, startAmbientWind } from './audio.js';

const canvas = document.getElementById('gameCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05050a);
scene.fog = new THREE.Fog(0x05050a, 3, 30);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(4, 1.7, 4);
camera.lookAt(0, 1.5, -7);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;

/* =========================================
LIGHTS
========================================= */
const ambient = new THREE.AmbientLight(0x223344, 0.4);
scene.add(ambient);

const moonLight = new THREE.DirectionalLight(0x8899bb, 0.5);
moonLight.position.set(-10, 20, 5);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 2048;
moonLight.shadow.mapSize.height = 2048;
scene.add(moonLight);

/* =========================================
FLASHLIGHT 🔦
========================================= */
const flashlight = new THREE.SpotLight(0xffdd99, 3, 25, Math.PI / 7, 0.5, 1.5);
flashlight.castShadow = true;
flashlight.shadow.mapSize.width = 1024;
flashlight.shadow.mapSize.height = 1024;
flashlight.shadow.camera.near = 0.5;
flashlight.shadow.camera.far = 25;
scene.add(flashlight);

/* هدف چراغ‌قوه (جلو دوربین) */
const flashlightTarget = new THREE.Object3D();
scene.add(flashlightTarget);
flashlight.target = flashlightTarget;

/* =========================================
FLASHLIGHT STATE
========================================= */
let flashlightOn = true;
let battery = 100;
const batteryDrainRate = 3; /* % per second */

/* =========================================
GROUND
========================================= */
const groundGeometry = new THREE.PlaneGeometry(200, 200);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x6a5a40,
  roughness: 1,
  metalness: 0
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

/* =========================================
STARS
========================================= */
function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 1500;
  const positions = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 500;
    positions[i + 1] = Math.random() * 100 + 30;
    positions[i + 2] = (Math.random() - 0.5) * 500;
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.7,
    transparent: true,
    opacity: 0.9
  });

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}
createStars();

/* HOUSE */
createHouse(scene);

/* =========================================
INPUT
========================================= */
const keys = {};

document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  keys[key] = true;

  /* چراغ‌قوه */
  if (key === "f") {
    if (battery > 0) {
      flashlightOn = !flashlightOn;
      flashlight.visible = flashlightOn;
      console.log("🔦 Flashlight:", flashlightOn ? "ON" : "OFF");
    }
  }
});

document.addEventListener('keyup', (e) => {
  keys[e.key.toLowerCase()] = false;
});

let mouseX = 0;
let mouseY = 0;
let isLocked = false;

canvas.addEventListener('click', () => {
  canvas.requestPointerLock();
});

document.addEventListener('pointerlockchange', () => {
  isLocked = document.pointerLockElement === canvas;
});

document.addEventListener('mousemove', (e) => {
  if (!isLocked) return;
  mouseX -= e.movementX * 0.002;
  mouseY -= e.movementY * 0.002;
  mouseY = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, mouseY));
});

/* =========================================
ANIMATION
========================================= */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.1);

  const isRunning = !!keys['shift'];
  const speed = isRunning ? 6 : 2.8;

  /* حرکت */
  const forward = new THREE.Vector3(-Math.sin(mouseX), 0, -Math.cos(mouseX));
  const right = new THREE.Vector3(Math.cos(mouseX), 0, -Math.sin(mouseX));

  let moved = false;

  if (keys['w'] || keys['arrowup']) {
    camera.position.addScaledVector(forward, speed * delta);
    moved = true;
  }
  if (keys['s'] || keys['arrowdown']) {
    camera.position.addScaledVector(forward, -speed * delta);
    moved = true;
  }
  if (keys['a'] || keys['arrowleft']) {
    camera.position.addScaledVector(right, -speed * delta);
    moved = true;
  }
  if (keys['d'] || keys['arrowright']) {
    camera.position.addScaledVector(right, speed * delta);
    moved = true;
  }

  /* چرخش دوربین */
  camera.rotation.order = 'YXZ';
  camera.rotation.y = mouseX;
  camera.rotation.x = mouseY;

  /* چراغ‌قوه — جلوی دوربین */
  flashlight.position.copy(camera.position);
  flashlight.position.y -= 0.2;

  const targetPos = camera.position.clone().add(forward.clone().multiplyScalar(10));
  targetPos.y = camera.position.y - 0.3;
  flashlightTarget.position.copy(targetPos);

  /* باتری */
  if (flashlightOn && battery > 0) {
    battery -= batteryDrainRate * delta;
    if (battery <= 0) {
      battery = 0;
      flashlightOn = false;
      flashlight.visible = false;
      console.log("🔋 Battery empty!");
    }
    updateBatteryHUD();
  }

  /* صدای پا */
  updateFootsteps(delta, moved, isRunning);

  renderer.render(scene, camera);
}

/* =========================================
HUD BATTERY
========================================= */
function updateBatteryHUD() {
  const fill = document.getElementById('batteryFill');
  if (fill) {
    fill.style.width = battery + '%';
  }
}

/* =========================================
RESIZE
========================================= */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* =========================================
START
========================================= */
window.startGame = function() {
  document.getElementById('startScreen').classList.add('hidden');

  /* راه‌اندازی صدا */
  initAudio();
  startAmbientWind();

  /* شروع حلقه */
  animate();
};

console.log('🌵 Zayandeh Night — Day 3 loaded');
