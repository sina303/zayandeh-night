/* =========================================
🏠 HOUSE — Simple Traditional House
========================================= */
import * as THREE from 'three';

/* =========================================
MATERIALS
========================================= */
const kahgelMat = new THREE.MeshStandardMaterial({
  color: 0xb89d78,
  roughness: 0.9,
  metalness: 0
});

const brickMat = new THREE.MeshStandardMaterial({
  color: 0x9a6b4a,
  roughness: 0.9,
  metalness: 0
});

const woodMat = new THREE.MeshStandardMaterial({
  color: 0x5a3a20,
  roughness: 0.8,
  metalness: 0
});

const tileMat = new THREE.MeshStandardMaterial({
  color: 0x2a7a9a,
  roughness: 0.4,
  metalness: 0.1
});

const waterMat = new THREE.MeshStandardMaterial({
  color: 0x3a6a9a,
  roughness: 0.2,
  metalness: 0.3,
  transparent: true,
  opacity: 0.85
});

const glassMat = new THREE.MeshStandardMaterial({
  color: 0x334455,
  roughness: 0.2,
  metalness: 0.3,
  transparent: true,
  opacity: 0.5
});

const carpetMat = new THREE.MeshStandardMaterial({
  color: 0x8a2a2a,
  roughness: 1,
  metalness: 0
});

/* =========================================
HELPER: CREATE WALL
========================================= */
function makeWall(width, height, depth, material, x, y, z) {
  const geo = new THREE.BoxGeometry(width, height, depth);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y + height / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/* =========================================
CREATE HOUSE
========================================= */
export function createHouse(scene) {
  console.log("🏠 Building house...");

  const house = new THREE.Group();

  const YARD = 14;
  const WALL_H = 4;
  const WALL_T = 0.3;
  const HALF = YARD / 2;

  /* =========================================
  کف حیاط
  ========================================= */
  const yardFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(YARD, YARD),
    new THREE.MeshStandardMaterial({ color: 0x8a7a5a, roughness: 1 })
  );
  yardFloor.rotation.x = -Math.PI / 2;
  yardFloor.receiveShadow = true;
  house.add(yardFloor);

  /* =========================================
  حوض وسط حیاط
  ========================================= */
  const poolGeo = new THREE.BoxGeometry(3, 0.5, 3);
  const pool = new THREE.Mesh(poolGeo, tileMat);
  pool.position.y = 0.25;
  pool.castShadow = true;
  pool.receiveShadow = true;
  house.add(pool);

  const waterGeo = new THREE.PlaneGeometry(2.7, 2.7);
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.45;
  house.add(water);

  /* =========================================
  دیوارهای چهار طرف حیاط
  ========================================= */
  /* شمالی */
  house.add(makeWall(YARD, WALL_H, WALL_T, kahgelMat, 0, 0, -HALF));
  /* جنوبی */
  house.add(makeWall(YARD, WALL_H, WALL_T, kahgelMat, 0, 0, HALF));
  /* شرقی */
  house.add(makeWall(WALL_T, WALL_H, YARD, kahgelMat, HALF, 0, 0));
  /* غربی */
  house.add(makeWall(WALL_T, WALL_H, YARD, kahgelMat, -HALF, 0, 0));

  /* =========================================
  اتاق شمالی (اتاق اصلی)
  ========================================= */
  const NW = 7;
  const ND = 5;
  const NH = 3.5;

  /* کف */
  const northFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(NW, ND),
    carpetMat
  );
  northFloor.rotation.x = -Math.PI / 2;
  northFloor.position.set(0, 0.02, -HALF - ND / 2);
  northFloor.receiveShadow = true;
  house.add(northFloor);

  /* دیوار پشت */
  house.add(makeWall(NW, NH, WALL_T, brickMat, 0, 0, -HALF - ND));
  /* دیوار چپ */
  house.add(makeWall(WALL_T, NH, ND, brickMat, -NW / 2, 0, -HALF - ND / 2));
  /* دیوار راست */
  house.add(makeWall(WALL_T, NH, ND, brickMat, NW / 2, 0, -HALF - ND / 2));

  /* سقف */
  const northCeiling = new THREE.Mesh(
    new THREE.BoxGeometry(NW, 0.2, ND),
    brickMat
  );
  northCeiling.position.set(0, NH, -HALF - ND / 2);
  northCeiling.castShadow = true;
  northCeiling.receiveShadow = true;
  house.add(northCeiling);

  /* در ورودی اتاق شمالی — توی دیوار جنوبی‌اش */
  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 2.5, WALL_T + 0.1),
    woodMat
  );
  doorFrame.position.set(0, 1.25, -HALF);
  doorFrame.castShadow = true;
  house.add(doorFrame);

  /* =========================================
  اتاق شرقی
  ========================================= */
  const EW = 5;
  const ED = 6;
  const EH = 3.5;

  const eastFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(EW, ED),
    carpetMat
  );
  eastFloor.rotation.x = -Math.PI / 2;
  eastFloor.position.set(HALF + EW / 2, 0.02, 0);
  eastFloor.receiveShadow = true;
  house.add(eastFloor);

  /* دیوارها */
  house.add(makeWall(EW, EH, WALL_T, brickMat, HALF + EW / 2, 0, -ED / 2));
  house.add(makeWall(EW, EH, WALL_T, brickMat, HALF + EW / 2, 0, ED / 2));
  house.add(makeWall(WALL_T, EH, ED, brickMat, HALF + EW, 0, 0));

  /* سقف */
  const eastCeiling = new THREE.Mesh(
    new THREE.BoxGeometry(EW, 0.2, ED),
    brickMat
  );
  eastCeiling.position.set(HALF + EW / 2, EH, 0);
  eastCeiling.castShadow = true;
  eastCeiling.receiveShadow = true;
  house.add(eastCeiling);

  /* =========================================
  اتاق غربی
  ========================================= */
  const WW = 5;
  const WD = 6;
  const WH = 3.5;

  const westFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(WW, WD),
    carpetMat
  );
  westFloor.rotation.x = -Math.PI / 2;
  westFloor.position.set(-HALF - WW / 2, 0.02, 0);
  westFloor.receiveShadow = true;
  house.add(westFloor);

  house.add(makeWall(WW, WH, WALL_T, brickMat, -HALF - WW / 2, 0, -WD / 2));
  house.add(makeWall(WW, WH, WALL_T, brickMat, -HALF - WW / 2, 0, WD / 2));
  house.add(makeWall(WALL_T, WH, WD, brickMat, -HALF - WW, 0, 0));

  const westCeiling = new THREE.Mesh(
    new THREE.BoxGeometry(WW, 0.2, WD),
    brickMat
  );
  westCeiling.position.set(-HALF - WW / 2, WH, 0);
  westCeiling.castShadow = true;
  westCeiling.receiveShadow = true;
  house.add(westCeiling);

  /* =========================================
  پنجره‌های حیاط
  ========================================= */
  const winGeo1 = new THREE.BoxGeometry(1.2, 1.5, 0.15);
  const win1 = new THREE.Mesh(winGeo1, glassMat);
  win1.position.set(2.5, 1.8, -HALF + 0.05);
  house.add(win1);

  const winGeo2 = new THREE.BoxGeometry(0.15, 1.5, 1.2);
  const win2 = new THREE.Mesh(winGeo2, glassMat);
  win2.position.set(HALF - 0.05, 1.8, 2.5);
  house.add(win2);

  const win3 = new THREE.Mesh(winGeo2, glassMat);
  win3.position.set(-HALF + 0.05, 1.8, -2.5);
  house.add(win3);

  /* =========================================
  اضافه کردن به صحنه
  ========================================= */
  scene.add(house);
  console.log("✅ House added. Total children:", house.children.length);

  return house;
}
