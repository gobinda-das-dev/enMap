import './style.css';
import * as THREE from 'three';
import * as dat from 'dat.gui';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader.js';

/* ----Gui---- */
const gui = new dat.GUI();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000); // Use PerspectiveCamera instead of Camera
camera.position.set(5, 5, 10);
scene.add(camera);

// Environment map
const envLoader = new EXRLoader();

const environmentOptions = {
  texturePath: '/hd.exr'
};

const updateEnvironmentMap = (path) => {
  envLoader.load(path, (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });
};

// Load the initial environment map
updateEnvironmentMap(environmentOptions.texturePath);

// Sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(3, 100, 100),
  new THREE.MeshStandardMaterial({ roughness: 0.1, metalness: 1 })
);
sphere.position.x = -7;
scene.add(sphere);
gui.add(sphere.material, 'roughness', 0, 1);
gui.add(sphere.material, 'metalness', 0, 1);

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(2, 0.6, 100, 100),
  new THREE.MeshStandardMaterial({ roughness: 0.1, metalness: 1 })
);
scene.add(torusKnot);
gui.add(torusKnot.material, 'roughness', 0, 1);
gui.add(torusKnot.material, 'metalness', 0, 1);

const ortho = new THREE.Mesh(
  new THREE.OctahedronGeometry(3.5),
  new THREE.MeshStandardMaterial({ roughness: 0.1, metalness: 1 })
);
ortho.position.x = 7;
scene.add(ortho);
gui.add(ortho.material, 'roughness', 0, 1);
gui.add(ortho.material, 'metalness', 0, 1);

// GUI for selecting environment map
gui.add(environmentOptions, 'texturePath', ['/hd.exr', '/fhd.exr', '/uhd.exr', '/the_sky_is_on_fire.exr', '/autumn_field_puresky.exr', 'snowy_forest.exr']).name('Environment Map').onChange(updateEnvironmentMap);

// Lights
const amLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(amLight);

const pLight1 = new THREE.PointLight(0xffffff, 10);
pLight1.position.set(5, 5, 5);
scene.add(pLight1);

const pLight2 = new THREE.PointLight(0xffffff, 10);
pLight2.position.set(-3, -3, 2);
scene.add(pLight2);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(sizes.width, sizes.height);
renderer.pixelRatio = window.devicePixelRatio;
document.body.appendChild(renderer.domElement);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Calling F(x)
animate();
window.addEventListener('resize', handleResize);

// Imp F(x)
function animate() {
  controls.update();

  torusKnot.rotation.x += 0.003;
  torusKnot.rotation.y += 0.003;
  ortho.rotation.x += 0.003;
  ortho.rotation.y += 0.003;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function handleResize() {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.render(scene, camera);
}
