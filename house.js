/* =========================================
🏠 HOUSE — Traditional Isfahani House
========================================= */
import * as THREE from 'three';

/* =========================================
MATERIALS
========================================= */
export const materials = {
  /* کاهگل — دیوارهای بیرونی */
  kahgel: new THREE.MeshStandardMaterial({
    color: 0x8b7355,
    roughness: 0.95,
    metalness: 0
  }),

  /* آجر — دیوارهای داخلی */
  brick: new THREE.MeshStandardMaterial({
    color: 0x6b4a3a,
    roughness: 0.9,
    metalness: 0
  }),

  /* چوب — درها و پنجره‌ها */
  wood: new THREE.MeshStandardMaterial({
    color: 0x4a2f1a,
    roughness: 0.8,
    metalness: 0
  }),

  /* کاشی — حوض */
  tile: new THREE.MeshStandardMaterial({
    color: 0x1e5a7a,
    roughness: 0.3,
    metalness: 0.1
  }),

  /* آب */
  water: new THREE.MeshStandardMaterial({
    color: 0x2a4a6a,
    roughness: 0.1,
    metalness: 0.3,
    transparent: true,
    opacity: 0.85
  }),

  /* شیشه */
  glass: new THREE.MeshStandardMaterial({
    color: 0x223344,
    roughness: 0.1,
    metalness: 0.2,
    transparent: true,
    opacity: 0.6
  }),

  /* فرش */
  carpet: new THREE.MeshStandardMaterial({
    color: 0x7a1e1e,
    roughness: 1,
    metalness: 0
  })
};

/* =========================================
WALL BUILDER
========================================= */
function createWall(width, height, depth, material, position) {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const wall = new THREE.Mesh(geometry, material);
  wall.position.set(position.x, position.y + height / 2, position.z);
  wall.castShadow = true;
  wall.receiveShadow = true;
  return wall;
}

/* =========================================
CREATE HOUSE
========================================= */
export function createHouse(scene) {
  const house = new THREE.Group();

  /* ابعاد حیاط */
  const yardSize = 12;
  const wallHeight = 4;
  const wallThickness = 0.4;

  /* =========================================
  حیاط — کف
  ========================================= */
  const yardFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(yardSize, yardSize),
    new THREE.MeshStandardMaterial({
      color: 0x5a4a35,
      roughness: 1
    })
  );
  yardFloor.rotation.x = -Math.PI / 2;
  yardFloor.receiveShadow = true;
  house.add(yardFloor);

  /* =========================================
  حوض وسط حیاط
  ========================================= */
  const poolSize = 3;
  const poolDepth = 0.5;

  /* لبه حوض */
  const poolRimGeo = new THREE.BoxGeometry(poolSize, poolDepth, poolSize);
  const poolRim = new THREE.Mesh(poolRimGeo, materials.tile);
  poolRim.position.y = poolDepth / 2;
  poolRim.castShadow = true;
  poolRim.receiveShadow = true;
  house.add(poolRim);

  /* آب حوض */
  const waterGeo = new THREE.PlaneGeometry(poolSize * 0.9, poolSize * 0.9);
  const water = new THREE.Mesh(waterGeo, materials.water);
  water.rotation.x = -Math.PI / 2;
  water.position.y = poolDepth * 0.9;
  house.add(water);

  /* =========================================
  دیوارهای چهار طرف حیاط
  ========================================= */
  const half = yardSize / 2;

  /* دیوار شمالی */
  house.add(createWall(
    yardSize, wallHeight, wallThickness,
    materials.kahgel,
    { x: 0, y: 0, z: -half }
  ));

  /* دیوار جنوبی */
  house.add(createWall(
    yardSize, wallHeight, wallThickness,
    materials.kahgel,
    { x: 0, y: 0, z: half }
  ));

  /* دیوار شرقی */
  house.add(createWall(
    wallThickness, wallHeight, yardSize,
    materials.kahgel,
    { x: half, y: 0, z: 0 }
  ));

  /* دیوار غربی */
  house.add(createWall(
    wallThickness, wallHeight, yardSize,
    materials.kahgel,
    { x: -half, y: 0, z: 0 }
  ));

  /* =========================================
  اتاق شمالی (اتاق اصلی)
  ========================================= */
  const roomW = 6;
  const roomD = 4;
  const roomH = 3;

  /* کف اتاق */
  const roomFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(roomW, roomD),
    materials.carpet
  );
  roomFloor.rotation.x = -Math.PI / 2;
  roomFloor.position.set(0, 0.01, -half - roomD / 2);
  roomFloor.receiveShadow = true;
  house.add(roomFloor);

  /* دیوار پشت */
  house.add(createWall(
    roomW, roomH, wallThickness,
    materials.brick,
    { x: 0, y: 0, z: -half - roomD }
  ));

  /* دیوار چپ */
  house.add(createWall(
    wallThickness, roomH, roomD,
    materials.brick,
    { x: -roomW / 2, y: 0, z: -half - roomD / 2 }
  ));

  /* دیوار راست */
  house.add(createWall(
    wallThickness, roomH, roomD,
    materials.brick,
    { x: roomW / 2, y: 0, z: -half - roomD / 2 }
  ));

  /* سقف اتاق شمالی */
  const ceilingN = new THREE.Mesh(
    new THREE.BoxGeometry(roomW, 0.2, roomD),
    materials.brick
  );
  ceilingN.position.set(0, roomH, -half - roomD / 2);
  ceilingN.castShadow = true;
  ceilingN.receiveShadow = true;
  house.add(ceilingN);

  /* =========================================
  در ورودی اتاق شمالی
  ========================================= */
  const doorW = 1.2;
  const doorH = 2.2;

  /* چارچوب در */
  house.add(createWall(
    doorW + 0.3, doorH + 0.3, wallThickness + 0.1,
    materials.wood,
    { x: -1.5, y: 0, z: -half }
  ));

  /* =========================================
  اتاق شرقی
  ========================================= */
  const roomEW = 4;
  const roomED = 5;

  const roomEastFloor = new THREE.Mesh(
    new THREE.PlaneGeometry(roomEW, roomED),
    materials.carpet
  );
  roomEastFloor.rotation.x = -Math.PI / 2;
  roomEastFloor.position.set(half + roomEW / 2, 0.01, 0);
  roomEastFloor.receiveShadow = true;
  house.add(roomEastFloor);

  /* دیوارها */
  house.add(createWall(
    roomEW, roomH, wallThickness,
    materials.brick,
    { x: half + roomEW / 2, y: 0, z: -roomED / 2 }
  ));

  house.add(createWall(
    roomEW, roomH, wallThickness,
    materials.brick,
    { x: half + roomEW / 2, y: 0, z: roomED / 2 }
  ));

  house.add(createWall(
    wallThickness, roomH, roomED,
    materials.brick,
    { x: half + roomEW, y: 0, z: 0 }
  ));

  /* سقف */
  const ceilingE = new THREE.Mesh(
    new THREE.BoxGeometry(roomEW, 0.2, roomED),
    materials.brick
  );
  ceilingE.position.set(half + roomEW / 2, roomH, 0);
  ceilingE.castShadow = true;
  ceilingE.receiveShadow = true;
  house.add(ceilingE);

  /* =========================================
  پنجره‌های حیاط
  ========================================= */
  const windowW = 0.8;
  const windowH = 1.2;

  /* پنجره‌ی شمالی */
  const winN = new THREE.Mesh(
    new THREE.BoxGeometry(windowW, windowH, 0.1),
    materials.glass
  );
  winN.position.set(1.5, 1.5, -half + 0.01);
  house.add(winN);

  /* پنجره‌ی شرقی */
  const winE = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, windowH, windowW),
    materials.glass
  );
  winE.position.set(half - 0.01, 1.5, 1.5);
  house.add(winE);

  /* =========================================
  موقعیت خونه توی دنیا
  ========================================= */
  house.position.set(0, 0, 0);

  scene.add(house);
  return house;
}
