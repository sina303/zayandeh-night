/* =========================================
🏠 HOUSE — Fixed
========================================= */
import * as THREE from 'three';

const kahgelMat = new THREE.MeshStandardMaterial({
  color: 0xb89d78, roughness: 0.9, metalness: 0
});
const brickMat = new THREE.MeshStandardMaterial({
  color: 0x9a6b4a, roughness: 0.9, metalness: 0
});
const woodMat = new THREE.MeshStandardMaterial({
  color: 0x5a3a20, roughness: 0.8, metalness: 0
});
const tileMat = new THREE.MeshStandardMaterial({
  color: 0x2a7a9a, roughness: 0.4, metalness: 0.1
});
const waterMat = new THREE.MeshStandardMaterial({
  color: 0x3a6a9a, roughness: 0.2, metalness: 0.3,
  transparent: true, opacity: 0.9
});
const glassMat = new THREE.MeshStandardMaterial({
  color: 0x334455, roughness: 0.2, metalness: 0.3,
  transparent: true, opacity: 0.5
});
const carpetMat = new THREE.MeshStandardMaterial({
  color: 0x8a2a2a, roughness: 1, metalness: 0
});

function makeWall(width, height, depth, material, x, y, z) {
  const geo = new THREE.BoxGeometry(width, height, depth);
  const mesh = new THREE.Mesh(geo, material);
  mesh.position.set(x, y + height / 2, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

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
  حوض — کوچیک‌تر
  ========================================= */
  const poolSize = 2.5;
  const poolGeo = new THREE.BoxGeometry(poolSize, 0.4, poolSize);
  const pool = new THREE.Mesh(poolGeo, tileMat);
  pool.position.y = 0.2;
  pool.castShadow = true;
  pool.receiveShadow = true;
  house.add(pool);

  /* آب — کمی کوچیک‌تر از حوض */
  const waterSize = poolSize * 0.85;
  const waterGeo = new THREE.PlaneGeometry(waterSize, waterSize);
  const water = new THREE.Mesh(waterGeo, waterMat);
  water.rotation.x = -Math.PI / 2;
  water.position.y = 0.38;
  house.add(water);

  /* =========================================
  دیوارهای چهار طرف حیاط — با در
  ========================================= */

  /* دیوار شمالی — با در اتاق شمالی */
  house.add(makeWall(3, WALL_H, WALL_T, kahgelMat, -3.5, 0, -HALF));
  house.add(makeWall(3, WALL_H, WALL_T, kahgelMat, 3.5, 0, -HALF));
  /* بالای در */
  house.add(makeWall(1.5, WALL_H - 2.5, WALL_T, kahgelMat, 0, 2.5, -HALF));

  /* دیوار جنوبی */
  house.add(makeWall(YARD, WALL_H, WALL_T, kahgelMat, 0, 0, HALF));

  /* دیوار شرقی — با در اتاق شرقی */
  house.add(makeWall(WALL_T, WALL_H, 3, kahgelMat, HALF, 0, -4.5));
  house.add(makeWall(WALL_T, WALL_H, 3, kahgelMat, HALF, 0, 4.5));
  house.add(makeWall(WALL_T, WALL_H - 2.5, 1.5, kahgelMat, HALF, 2.5, 0));

  /* دیوار غربی — با در اتاق غربی */
  house.add(makeWall(WALL_T, WALL_H, 3, kahgelMat, -HALF, 0, -4.5));
  house.add(makeWall(WALL_T, WALL_H, 3, kahgelMat, -HALF, 0, 4.5));
  house.add(makeWall(WALL_T, WALL_H - 2.5, 1.5, kahgelMat, -HALF, 2.5, 0));

  /* =========================================
  اتاق شمالی (اتاق اصلی)
  ========================================= */
  const NW = 7;
  const ND = 5;
  const NH = 3.5;

  const northFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(NW, ND),
    carpetMat
  );
  northFloor.rotation.x = -Math.PI / 2;
  northFloor.position.set(0, 0.02, -HALF - ND / 2);
  northFloor.receiveShadow = true;
  house.add(northFloor);

  /* دیوارها */
  house.add(makeWall(NW, NH, WALL_T, brickMat, 0, 0, -HALF - ND));
  house.add(makeWall(WALL_T, NH, ND, brickMat, -NW / 2, 0, -HALF - ND / 2));
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

  house.add(makeWall(EW, EH, WALL_T, brickMat, HALF + EW / 2, 0, -ED / 2));
  house.add(makeWall(EW, EH, WALL_T, brickMat, HALF + EW / 2, 0, ED / 2));
  house.add(makeWall(WALL_T, EH, ED, brickMat, HALF + EW, 0, 0));

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
  پنجره‌ها
  ========================================= */
  const win1 = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.5, 0.15),
    glassMat
  );
  win1.position.set(3, 1.8, -HALF + 0.05);
  house.add(win1);

  const win2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 1.5, 1.2),
    glassMat
  );
  win2.position.set(HALF - 0.05, 1.8, 3);
  house.add(win2);

  const win3 = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 1.5, 1.2),
    glassMat
  );
  win3.position.set(-HALF + 0.05, 1.8, -3);
  house.add(win3);

  /* =========================================
  درها
  ========================================= */
  /* در اتاق شمالی */
  const doorN = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 2.4, 0.1),
    woodMat
  );
  doorN.position.set(0, 1.2, -HALF + 0.1);
  house.add(doorN);

  /* در اتاق شرقی */
  const doorE = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 2.4, 1.4),
    woodMat
  );
  doorE.position.set(HALF - 0.1, 1.2, 0);
  house.add(doorE);

  /* در اتاق غربی */
  const doorW = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 2.4, 1.4),
    woodMat
  );
  doorW.position.set(-HALF + 0.1, 1.2, 0);
  house.add(doorW);

  scene.add(house);
  console.log("✅ House added. Total children:", house.children.length);
  return house;
}
