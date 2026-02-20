import * as THREE from "./vendor/three.module.js";

const canvas = document.getElementById("scene");
const form = document.getElementById("person-form");
const torqueValue = document.getElementById("torque");
const balanceValue = document.getElementById("balance");
const hint = document.getElementById("hint");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa7dafc);
scene.fog = new THREE.Fog(0xa7dafc, 28, 85);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.set(0, 7.2, 15.5);
camera.lookAt(0, 0.8, 0);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const hemi = new THREE.HemisphereLight(0xffffff, 0xb6b6b6, 0.5);
scene.add(hemi);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
keyLight.position.set(10, 14, 9);
keyLight.castShadow = true;
keyLight.shadow.mapSize.set(2048, 2048);
keyLight.shadow.camera.near = 1;
keyLight.shadow.camera.far = 45;
keyLight.shadow.camera.left = -16;
keyLight.shadow.camera.right = 16;
keyLight.shadow.camera.top = 16;
keyLight.shadow.camera.bottom = -16;
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xcfe0ff, 0.35);
rimLight.position.set(-8, 7, -10);
scene.add(rimLight);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(80, 80),
  new THREE.MeshStandardMaterial({ color: 0x8ccb6b, roughness: 0.96, metalness: 0.02 })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.6;
floor.receiveShadow = true;
scene.add(floor);

const grid = new THREE.GridHelper(60, 60, 0x8ab58f, 0x9fce9c);
grid.position.y = -0.59;
scene.add(grid);

const grassMounds = new THREE.Group();
scene.add(grassMounds);
for (let i = 0; i < 28; i += 1) {
  const mound = new THREE.Mesh(
    new THREE.SphereGeometry(0.45 + Math.random() * 0.65, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0x78bb5a, roughness: 0.95 })
  );
  mound.scale.y = 0.38;
  mound.position.set((Math.random() - 0.5) * 46, -0.45, (Math.random() - 0.5) * 38);
  mound.receiveShadow = true;
  grassMounds.add(mound);
}

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 24, 24),
  new THREE.MeshBasicMaterial({ color: 0xffde73 })
);
sun.position.set(-18, 16, -22);
scene.add(sun);

const makeCloud = (x, y, z) => {
  const cloud = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
  const p1 = new THREE.Mesh(new THREE.SphereGeometry(1.1, 16, 16), mat);
  const p2 = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 16), mat);
  const p3 = new THREE.Mesh(new THREE.SphereGeometry(0.8, 16, 16), mat);
  p1.position.set(0, 0, 0);
  p2.position.set(1.0, 0.1, 0);
  p3.position.set(-1.0, -0.1, 0);
  cloud.add(p1, p2, p3);
  cloud.position.set(x, y, z);
  scene.add(cloud);
};
makeCloud(-10, 12, -18);
makeCloud(8, 11, -16);
makeCloud(15, 13, -24);
makeCloud(-18, 10.5, -20);

const playground = new THREE.Group();
scene.add(playground);

const pathMat = new THREE.MeshStandardMaterial({ color: 0xcdbba7, roughness: 0.92 });
const pathMain = new THREE.Mesh(new THREE.PlaneGeometry(36, 6.5), pathMat);
pathMain.rotation.x = -Math.PI / 2;
pathMain.position.set(0, -0.585, 6.5);
pathMain.receiveShadow = true;
playground.add(pathMain);

const pathCross = new THREE.Mesh(new THREE.PlaneGeometry(7, 20), pathMat);
pathCross.rotation.x = -Math.PI / 2;
pathCross.position.set(-12.5, -0.584, -1.5);
pathCross.receiveShadow = true;
playground.add(pathCross);

const sandbox = new THREE.Group();
playground.add(sandbox);
const sandBorderMat = new THREE.MeshStandardMaterial({ color: 0xc07f43, roughness: 0.76 });
const sandMat = new THREE.MeshStandardMaterial({ color: 0xe8cf89, roughness: 1.0 });
const sandBase = new THREE.Mesh(new THREE.BoxGeometry(9, 0.3, 6), sandBorderMat);
sandBase.position.set(-1.4, -0.42, 4.6);
sandBase.receiveShadow = true;
sandbox.add(sandBase);
const sandFill = new THREE.Mesh(new THREE.PlaneGeometry(8.3, 5.3), sandMat);
sandFill.rotation.x = -Math.PI / 2;
sandFill.position.set(-1.4, -0.25, 4.6);
sandFill.receiveShadow = true;
sandbox.add(sandFill);

const createTree = (x, z, scale = 1) => {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18 * scale, 0.24 * scale, 2.0 * scale, 10),
    new THREE.MeshStandardMaterial({ color: 0x7a4b2d, roughness: 0.86 })
  );
  trunk.position.y = 0.45 * scale;
  trunk.castShadow = true;
  tree.add(trunk);

  const crownMat = new THREE.MeshStandardMaterial({ color: 0x4f9e44, roughness: 0.9 });
  const c1 = new THREE.Mesh(new THREE.SphereGeometry(0.9 * scale, 14, 12), crownMat);
  const c2 = new THREE.Mesh(new THREE.SphereGeometry(0.8 * scale, 14, 12), crownMat);
  const c3 = new THREE.Mesh(new THREE.SphereGeometry(0.72 * scale, 14, 12), crownMat);
  c1.position.set(0, 1.8 * scale, 0);
  c2.position.set(0.65 * scale, 1.55 * scale, 0.1 * scale);
  c3.position.set(-0.62 * scale, 1.5 * scale, -0.1 * scale);
  c1.castShadow = true;
  c2.castShadow = true;
  c3.castShadow = true;
  tree.add(c1, c2, c3);

  tree.position.set(x, -0.45, z);
  playground.add(tree);
};

createTree(-15, -5.5, 1.15);
createTree(-17, 5.5, 0.95);
createTree(15.5, -5.8, 1.05);
createTree(16.5, 5.2, 0.9);

const bushes = new THREE.Group();
playground.add(bushes);
for (let i = 0; i < 20; i += 1) {
  const bush = new THREE.Mesh(
    new THREE.SphereGeometry(0.32 + Math.random() * 0.3, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0x5fae52, roughness: 0.95 })
  );
  bush.scale.y = 0.7;
  bush.position.set((Math.random() - 0.5) * 30, -0.38, -11 + Math.random() * 2.8);
  bush.receiveShadow = true;
  bushes.add(bush);
}

const benchGroup = new THREE.Group();
playground.add(benchGroup);
const benchWood = new THREE.MeshStandardMaterial({ color: 0xb87a49, roughness: 0.7 });
const benchMetal = new THREE.MeshStandardMaterial({ color: 0x5f6f7c, roughness: 0.55 });
const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.16, 0.65), benchWood);
benchSeat.position.set(4.2, 0.05, 6.2);
const benchBack = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.16, 0.65), benchWood);
benchBack.position.set(4.2, 0.62, 5.95);
benchBack.rotation.x = -0.2;
const benchLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.75, 0.42), benchMetal);
benchLeg1.position.set(3.0, -0.25, 6.18);
const benchLeg2 = benchLeg1.clone();
benchLeg2.position.x = 5.4;
benchGroup.add(benchSeat, benchBack, benchLeg1, benchLeg2);

const lampGroup = new THREE.Group();
playground.add(lampGroup);
const lampPole = new THREE.Mesh(
  new THREE.CylinderGeometry(0.08, 0.11, 4.2, 12),
  new THREE.MeshStandardMaterial({ color: 0x506271, roughness: 0.55 })
);
lampPole.position.set(-5.4, 1.45, 8.4);
const lampHead = new THREE.Mesh(
  new THREE.SphereGeometry(0.24, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xfff2c7, emissive: 0xffd773, emissiveIntensity: 0.35 })
);
lampHead.position.set(-5.4, 3.68, 8.4);
lampGroup.add(lampPole, lampHead);

const colorfulToys = new THREE.Group();
playground.add(colorfulToys);
const ballColors = [0xff6e6e, 0x5fc4ff, 0xffd25f, 0x74d67a];
for (let i = 0; i < 8; i += 1) {
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.24 + Math.random() * 0.12, 14, 14),
    new THREE.MeshStandardMaterial({ color: ballColors[i % ballColors.length], roughness: 0.5 })
  );
  ball.position.set(-3.8 + Math.random() * 5.2, -0.3, 3.1 + Math.random() * 2.6);
  ball.castShadow = true;
  colorfulToys.add(ball);
}

const fenceMat = new THREE.MeshStandardMaterial({ color: 0xdedee6, roughness: 0.8 });
for (let i = -6; i <= 6; i += 1) {
  const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.2, 0.2), fenceMat);
  post.position.set(i * 1.8, 0, -10.5);
  playground.add(post);
}
const rail = new THREE.Mesh(new THREE.BoxGeometry(24, 0.2, 0.2), fenceMat);
rail.position.set(0, 0.5, -10.5);
playground.add(rail);

const swingMat = new THREE.MeshStandardMaterial({ color: 0x5f7f92, roughness: 0.5 });
const swingFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 5.2, 0.26), swingMat);
const swingFrameR = swingFrameL.clone();
const swingTop = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.26, 0.26), swingMat);
swingFrameL.position.set(6.9, 2.1, -7.8);
swingFrameR.position.set(12.1, 2.1, -7.8);
swingTop.position.set(9.5, 4.7, -7.8);
playground.add(swingFrameL, swingFrameR, swingTop);

const chainMat = new THREE.MeshStandardMaterial({ color: 0x3b3b3b, roughness: 0.4 });
const swingRig = new THREE.Group();
swingRig.position.set(9.5, 4.7, -7.8);
playground.add(swingRig);

const chainL = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.1, 8), chainMat);
const chainR = chainL.clone();
const swingSeat = new THREE.Mesh(
  new THREE.BoxGeometry(1.65, 0.12, 0.58),
  new THREE.MeshStandardMaterial({ color: 0x2d2d2d, roughness: 0.7 })
);
chainL.position.set(-0.52, -1.55, 0);
chainR.position.set(0.52, -1.55, 0);
swingSeat.position.set(0, -3.1, 0);
swingRig.add(chainL, chainR, swingSeat);

const swingSeatHitbox = new THREE.Mesh(
  new THREE.BoxGeometry(2.9, 1.8, 2.2),
  new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.0 })
);
swingSeatHitbox.position.copy(swingSeat.position);
swingRig.add(swingSeatHitbox);

const swingRiderAnchor = new THREE.Group();
swingRiderAnchor.position.copy(swingSeat.position);
swingRig.add(swingRiderAnchor);
const swingClickable = [swingSeat, chainL, chainR, swingSeatHitbox];

const slideBlue = new THREE.MeshStandardMaterial({ color: 0x56a0ff, roughness: 0.45, metalness: 0.08 });
const slideBody = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.12, 3.4), slideBlue);
slideBody.rotation.x = -0.5;
slideBody.position.set(-9, 1.2, -8.6);
const slideStand = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2.2, 1.2), swingMat);
slideStand.position.set(-9, 0.5, -7.2);
playground.add(slideBody, slideStand);

const woodTexture = (() => {
  const texCanvas = document.createElement("canvas");
  texCanvas.width = 512;
  texCanvas.height = 128;
  const ctx = texCanvas.getContext("2d");

  ctx.fillStyle = "#bb7a44";
  ctx.fillRect(0, 0, 512, 128);
  for (let x = 0; x < 512; x += 28) {
    ctx.fillStyle = x % 56 === 0 ? "#ad6e3d" : "#ca8a53";
    ctx.fillRect(x, 0, 28, 128);
  }
  for (let y = 0; y < 128; y += 12) {
    ctx.strokeStyle = "rgba(0, 0, 0, 0.10)";
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y + (y % 24 === 0 ? 3 : -3));
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(texCanvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.6, 1);
  return texture;
})();

const seesawRoot = new THREE.Group();
seesawRoot.position.y = 1.55;
scene.add(seesawRoot);

const plank = new THREE.Mesh(
  new THREE.BoxGeometry(12, 0.48, 1.7),
  new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 0.56,
    metalness: 0.04,
  })
);
plank.castShadow = true;
plank.receiveShadow = true;
seesawRoot.add(plank);

const edgeCapMaterial = new THREE.MeshStandardMaterial({ color: 0x3a2a20, roughness: 0.7 });
const capL = new THREE.Mesh(new THREE.CylinderGeometry(0.82, 0.82, 0.2, 22), edgeCapMaterial);
capL.rotation.z = Math.PI / 2;
capL.position.x = -6.05;
capL.castShadow = true;
const capR = capL.clone();
capR.position.x = 6.05;
seesawRoot.add(capL, capR);

const pivot = new THREE.Mesh(
  new THREE.CylinderGeometry(0.85, 1.25, 1.65, 24),
  new THREE.MeshStandardMaterial({ color: 0x4a4a4a, roughness: 0.46, metalness: 0.2 })
);
pivot.position.y = 0.5;
pivot.castShadow = true;
pivot.receiveShadow = true;
scene.add(pivot);

const base = new THREE.Mesh(
  new THREE.CylinderGeometry(1.7, 2.1, 0.28, 36),
  new THREE.MeshStandardMaterial({ color: 0x272727, roughness: 0.74, metalness: 0.1 })
);
base.position.y = -0.48;
base.castShadow = true;
base.receiveShadow = true;
scene.add(base);

const characters = [];
const characterSet = new Set();

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const pickTopCharacter = (object) => {
  let node = object;
  while (node && !characterSet.has(node)) {
    node = node.parent;
  }
  return node || null;
};

const createCharacter = ({ height, weight, gender }) => {
  const person = new THREE.Group();

  const skinPalette = [0xf3c8ab, 0xe9b996, 0xd69f7f];
  const hairPalette = [0x211713, 0x3a2a22, 0x1b1b1b];
  const shirtPalette = [0x4f76ff, 0x3ebc8a, 0xea5b6a];
  const pantsPalette = [0x2f3b4c, 0x1d2730, 0x293443];

  const skinColor = skinPalette[Math.floor(Math.random() * skinPalette.length)];
  const hairColor = hairPalette[Math.floor(Math.random() * hairPalette.length)];
  const shirtColor = shirtPalette[Math.floor(Math.random() * shirtPalette.length)];
  const pantsColor = pantsPalette[Math.floor(Math.random() * pantsPalette.length)];

  const hScale = clamp(height / 170, 0.8, 1.25);
  const wScale = clamp(weight / 65, 0.72, 1.45);

  const skinMat = new THREE.MeshStandardMaterial({ color: skinColor, roughness: 0.4 });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.66 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.58 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.63 });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.44 * wScale, 28, 26), skinMat);
  head.position.y = 1.78 * hScale;
  person.add(head);

  const hairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.48 * wScale, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.63),
    hairMat
  );
  hairTop.position.y = head.position.y + 0.11;
  // Push the hair cap backward so it does not cover eyes/nose/mouth.
  hairTop.position.z = -0.14 * wScale;
  hairTop.scale.z = 0.72;
  person.add(hairTop);

  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.25 });
  const eyeGeometry = new THREE.SphereGeometry(0.04 * wScale, 10, 10);
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMat);
  leftEye.position.set(-0.12 * wScale, head.position.y + 0.03 * wScale, 0.44 * wScale);
  const rightEye = leftEye.clone();
  rightEye.position.x = 0.12 * wScale;
  person.add(leftEye, rightEye);

  const nose = new THREE.Mesh(
    new THREE.ConeGeometry(0.03 * wScale, 0.1 * wScale, 8),
    new THREE.MeshStandardMaterial({ color: 0xd9a589, roughness: 0.4 })
  );
  nose.rotation.x = Math.PI / 2;
  nose.position.set(0, head.position.y - 0.03 * wScale, 0.47 * wScale);
  person.add(nose);

  const mouth = new THREE.Mesh(
    new THREE.TorusGeometry(0.09 * wScale, 0.012 * wScale, 6, 16, Math.PI),
    new THREE.MeshStandardMaterial({ color: 0x8a3d3d, roughness: 0.35 })
  );
  mouth.rotation.x = Math.PI;
  mouth.position.set(0, head.position.y - 0.16 * wScale, 0.46 * wScale);
  person.add(mouth);

  if (gender === "female") {
    const longHair = new THREE.Mesh(new THREE.BoxGeometry(0.62 * wScale, 0.95 * hScale, 0.36), hairMat);
    longHair.position.set(0, head.position.y - 0.48 * hScale, -0.24);
    person.add(longHair);
  }

  const torso = new THREE.Mesh(
    new THREE.BoxGeometry(0.92 * wScale, 1.15 * hScale, 0.56 * wScale),
    shirtMat
  );
  torso.position.y = 0.92 * hScale;
  person.add(torso);

  const armGeometry = new THREE.CapsuleGeometry(0.11 * wScale, 0.58 * hScale, 5, 14);
  const leftArm = new THREE.Mesh(armGeometry, skinMat);
  leftArm.position.set(-0.67 * wScale, 1.03 * hScale, 0.02);
  leftArm.rotation.z = Math.PI / 8;
  person.add(leftArm);
  const rightArm = leftArm.clone();
  rightArm.position.x = 0.67 * wScale;
  rightArm.rotation.z = -Math.PI / 8;
  person.add(rightArm);

  if (gender === "female") {
    const skirt = new THREE.Mesh(
      new THREE.ConeGeometry(0.68 * wScale, 0.72 * hScale, 20, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xff84b2, roughness: 0.6, side: THREE.DoubleSide })
    );
    skirt.position.y = 0.44 * hScale;
    person.add(skirt);
  }

  const legGeometry = new THREE.CapsuleGeometry(0.14 * wScale, 0.72 * hScale, 5, 14);
  const leftLeg = new THREE.Mesh(legGeometry, pantsMat);
  leftLeg.position.set(-0.28 * wScale, 0.14 * hScale, 0);
  person.add(leftLeg);
  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.28 * wScale;
  person.add(rightLeg);

  person.userData = {
    weight,
    seated: false,
    ride: "none",
    sitAmount: 0,
    hScale,
    wScale,
    parts: {
      head,
      torso,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg,
    },
  };

  person.position.set(-4.6 + Math.random() * 2.8, -0.42, 0);
  person.traverse((node) => {
    if (node.isMesh) node.castShadow = true;
  });
  scene.add(person);
  characterSet.add(person);
  return person;
};

let currentAngle = 0;
let angularVelocity = 0;
let swingAngle = 0;
let swingVelocity = 0;

const computeTorque = () =>
  characters.reduce((sum, person) => {
    if (!person.userData.seated || person.userData.ride !== "seesaw") return sum;
    return sum + person.userData.weight * person.position.x;
  }, 0);

const updateSwingPhysics = () => {
  const riderCount = characters.filter((person) => person.userData.ride === "swing").length;
  swingVelocity += -swingAngle * 0.028;
  swingVelocity *= riderCount > 0 ? 0.992 : 0.96;
  if (riderCount > 0) {
    swingVelocity += Math.sin(performance.now() * 0.004) * 0.0007;
  }
  swingAngle += swingVelocity;
  swingAngle = clamp(swingAngle, -0.62, 0.62);
  // Swing moves front/back (pitch), not left/right.
  swingRig.rotation.x = swingAngle;
};

const updateCharacterPose = () => {
  characters.forEach((person) => {
    const { parts, hScale, seated } = person.userData;
    if (!parts) return;

    const target = seated ? 1 : 0;
    person.userData.sitAmount += (target - person.userData.sitAmount) * 0.18;
    const s = person.userData.sitAmount;

    const torsoY = 0.92 * hScale - 0.18 * hScale * s;
    parts.torso.position.y = torsoY;
    parts.torso.rotation.x = -0.14 * s;

    parts.head.position.y = 1.78 * hScale - 0.12 * hScale * s;
    parts.head.rotation.x = -0.06 * s;

    parts.leftArm.rotation.z = Math.PI / 8 + 0.18 * s;
    parts.rightArm.rotation.z = -Math.PI / 8 - 0.18 * s;
    parts.leftArm.rotation.x = -0.3 * s;
    parts.rightArm.rotation.x = -0.3 * s;

    parts.leftLeg.position.y = 0.14 * hScale + 0.22 * hScale * s;
    parts.rightLeg.position.y = 0.14 * hScale + 0.22 * hScale * s;
    parts.leftLeg.position.z = 0.26 * s;
    parts.rightLeg.position.z = 0.26 * s;
    parts.leftLeg.rotation.x = -1.18 * s;
    parts.rightLeg.rotation.x = -1.18 * s;
  });
};

const updatePhysics = () => {
  const torque = computeTorque();
  if (torqueValue) torqueValue.textContent = `${Math.round(torque)} kg·m`;

  if (balanceValue) {
    if (Math.abs(torque) < 30) balanceValue.textContent = "균형";
    else if (torque > 0) balanceValue.textContent = "오른쪽이 내려감";
    else balanceValue.textContent = "왼쪽이 내려감";
  }

  const target = -clamp(torque / 420, -1, 1) * (Math.PI / 10);
  const spring = 0.085;
  const damping = 0.86;
  angularVelocity += (target - currentAngle) * spring;
  angularVelocity *= damping;
  currentAngle += angularVelocity;
  const absoluteMax = Math.PI / 10;
  currentAngle = clamp(currentAngle, -absoluteMax, absoluteMax);
  seesawRoot.rotation.z = currentAngle;
};

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const dragPoint = new THREE.Vector3();
let dragging = null;
let dragOffset = new THREE.Vector3();
let lastPointerEvent = null;

const updatePointer = (event) => {
  const rect = canvas.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
};

const pointerDown = (event) => {
  lastPointerEvent = event;
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);

  const swingRiderCount = characters.filter((person) => person.userData.ride === "swing").length;
  if (swingRiderCount > 0) {
    const swingHits = raycaster.intersectObjects(swingClickable, true);
    if (swingHits.length > 0) {
      // Upper click pushes backward, lower click pushes forward.
      const dir = pointer.y >= 0 ? -1 : 1;
      swingVelocity += dir * 0.06;
      hint.textContent = "그네를 밀었습니다.";
      return;
    }
  }

  const hits = raycaster.intersectObjects(characters, true);
  if (!hits.length) return;

  const root = pickTopCharacter(hits[0].object);
  if (!root) return;
  dragging = root;

  const worldPos = new THREE.Vector3();
  dragging.getWorldPosition(worldPos);
  dragPlane.constant = -worldPos.y;

  raycaster.ray.intersectPlane(dragPlane, dragPoint);
  dragOffset.copy(worldPos).sub(dragPoint);

  dragging.userData.seated = false;
  dragging.userData.ride = "none";
  scene.attach(dragging);
  hint.textContent = "시소 또는 그네 위에 드롭하면 탑승합니다.";
};

const pointerMove = (event) => {
  lastPointerEvent = event;
  if (!dragging) return;
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);
  if (!raycaster.ray.intersectPlane(dragPlane, dragPoint)) return;
  dragging.position.copy(dragPoint).add(dragOffset);
};

const pointerUp = (event) => {
  lastPointerEvent = event || lastPointerEvent;
  if (!dragging) return;

  let dropMode = "ground";
  let hitPoint = null;
  if (lastPointerEvent) {
    updatePointer(lastPointerEvent);
    raycaster.setFromCamera(pointer, camera);
    const seesawHit = raycaster.intersectObject(plank, true);
    if (seesawHit.length > 0) {
      dropMode = "seesaw";
      hitPoint = seesawHit[0].point.clone();
    } else {
      const swingHit = raycaster.intersectObject(swingSeatHitbox, true);
      if (swingHit.length > 0) {
        dropMode = "swing";
        hitPoint = swingHit[0].point.clone();
      }
    }
  }

  if (dropMode === "seesaw" && hitPoint) {
    seesawRoot.attach(dragging);
    dragging.userData.seated = true;
    dragging.userData.ride = "seesaw";

    const localHit = seesawRoot.worldToLocal(hitPoint);
    dragging.position.x = clamp(localHit.x, -5.4, 5.4);
    dragging.position.y = 0.32;
    dragging.position.z = 0;
    hint.textContent = "탑승 완료";
  } else if (dropMode === "swing" && hitPoint) {
    swingRiderAnchor.attach(dragging);
    dragging.userData.seated = true;
    dragging.userData.ride = "swing";
    const swingRiders = characters.filter((person) => person.userData.ride === "swing").length;
    const offsetX = clamp((swingRiders - 1) * 0.24, -0.36, 0.36);
    // Sit at the swing seat height with the same seated pose height as seesaw.
    dragging.position.set(offsetX, 0.32, 0.0);
    swingVelocity += (offsetX >= 0 ? 1 : -1) * 0.045;
    hint.textContent = "그네 탑승 완료";
  } else {
    scene.attach(dragging);
    dragging.userData.seated = false;
    dragging.userData.ride = "none";
    dragging.position.y = -0.42;
    hint.textContent = "바닥으로 이동";
  }

  dragging = null;
};

canvas.addEventListener("pointerdown", pointerDown);
window.addEventListener("pointermove", pointerMove);
window.addEventListener("pointerup", pointerUp);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const height = Number(data.get("height"));
  const weight = Number(data.get("weight"));
  const gender = data.get("gender");

  const person = createCharacter({ height, weight, gender });
  characters.push(person);
  hint.textContent = "캐릭터 생성됨. 시소/그네에 드래그하고, 그네는 클릭해서 밀 수 있습니다.";
});

const animate = () => {
  requestAnimationFrame(animate);
  updatePhysics();
  updateSwingPhysics();
  updateCharacterPose();
  renderer.render(scene, camera);
};
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
