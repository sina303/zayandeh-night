/* =========================================
🌵 ZAYANDEH NIGHT — Day 2: House
========================================= */
import * as THREE from 'three';
import { createHouse } from './house.js';

const canvas = document.getElementById('gameCanvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x05050a);
scene.fog = new THREE.Fog(0x05050a, 5, 60);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.7, 15);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7;

/* LIGHTS */
const ambient = new THREE.AmbientLight(0x404060, 0.4);
scene.add(ambient);

const moonLight = new THREE.DirectionalLight(0x8899ff, 0.4);
moonLight.position.set(-10, 20, 5);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 2048;
moonLight.shadow.mapSize.height = 2048;
moonLight.shadow.camera.left = -30;
moonLight.shadow.camera.right = 30;
moonLight.shadow.camera.top = 30;
moonLight.shadow.camera.bottom = -30;
scene.add(moonLight);

/* GROUND — Desert */
const groundGeometry = new THREE.PlaneGeometry(200, 200, 50, 50);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0x2a2015,
  roughness: 1,
  metalness: 0
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

/* STARS */
function createStars() {
  const starsGeometry = new THREE.BufferGeometry();
  const starsCount = 2000;
  const positions = new Float32Array(starsCount * 3);

  for (let i = 0; i < starsCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 500;
    positions[i + 1] = Math.random() * 100 + 20;
    positions[i + 2] = (Math.random() - 0.5) * 500;
  }

  starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    transparent: true,
    opacity: 0.8
  });

  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
}
createStars();

/* HOUSE */
createHouse(scene);

/* INPUT */
const keys = {};

document.addEventListener('keydown', (e) => {
  keys[e.key.toLowerCase()] = true;
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

/* ANIMATION */
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  const speed = keys['shift'] ? 8 : 3;
  const forward = new THREE.Vector3(-Math.sin(mouseX), 0, -Math.cos(mouseX));
  const right = new THREE.Vector3(Math.cos(mouseX), 0, -Math.sin(mouseX));

  if (keys['w'] || keys['arrowup']) {
    camera.position.addScaledVector(forward, speed * delta);
  }
  if (keys['s'] || keys['arrowdown']) {
    camera.position.addScaledVector(forward, -speed * delta);
  }
  if (keys['a'] || keys['arrowleft']) {
    camera.position.addScaledVector(right, -speed * delta);
  }
  if (keys['d'] || keys['arrowright']) {
    camera.position.addScaledVector(right, speed * delta);
  }

  camera.rotation.order = 'YXZ';
  camera.rotation.y = mouseX;
  camera.rotation.x = mouseY;

  renderer.render(scene, camera);
}

/* RESIZE */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* START */
window.startGame = function() {
  document.getElementById('startScreen').classList.add('hidden');
  animate();
};

console.log('🌵 Zayandeh Night — Day 2 loaded');
