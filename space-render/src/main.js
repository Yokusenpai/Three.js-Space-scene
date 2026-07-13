import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';


// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);


// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);

camera.position.set(0, 4, 12);


// Renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

document.body.appendChild(renderer.domElement);


// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.25);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffffff, 2.5);
sun.position.set(8, 6, 5);
sun.castShadow = true;

scene.add(sun);


// Stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 2500;
const positions = [];

for (let i = 0; i < starCount; i++) {
  positions.push(
    (Math.random() - 0.5) * 500,
    (Math.random() - 0.5) * 500,
    (Math.random() - 0.5) * 500,
  );
}
starGeometry.setAttribute(
  'position',
  new THREE.Float32BufferAttribute(positions, 3),
);
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.6,
});
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

let planet;
let moon;
let asteroid;
let spacecraft;


//loader
const loader = new GLTFLoader();
loader.load('/spacescene.glb', (gltf) => {
  scene.add(gltf.scene);

  planet = gltf.scene.getObjectByName('Planet');
  moon = gltf.scene.getObjectByName('Moon');
  asteroid = gltf.scene.getObjectByName('Asteroid');
  spacecraft = gltf.scene.getObjectByName('Spacecraft');

  // Flat shading
  asteroid.material = new THREE.MeshPhongMaterial({
    color: 0x6b5d4d,
    flatShading: true,
  });

  asteroid.material.needsUpdate = true;

  // Phong spacecraft
  spacecraft.material = new THREE.MeshPhongMaterial({
    color: 0xbfbfbf,
    shininess: 120,
    specular: 0xffffff,
  });

  planet.material = new THREE.MeshPhongMaterial({
    color: 0xfceead,
  });
  moon.material = new THREE.MeshPhongMaterial({
    color: 0xaaaaaa,
  });

  planet.castShadow = true;
  planet.receiveShadow = true;
  moon.castShadow = true;
  moon.receiveShadow = true;
  asteroid.castShadow = true;
  asteroid.receiveShadow = true;
  spacecraft.castShadow = true;
  spacecraft.receiveShadow = true;
});

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation&Render
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  if (planet) planet.rotation.y += 0.002;
  if (moon) moon.rotation.y += 0.003;
  if (asteroid) asteroid.rotation.y += 0.004;
  renderer.render(scene, camera);
}

animate();
