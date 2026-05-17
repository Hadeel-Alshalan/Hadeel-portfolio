import * as THREE from 'three';

// --- Three.js Setup ---
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

// --- Create Floating Geometric Mesh ---
const geometry = new THREE.IcosahedronGeometry(2, 1);

// Material for Wireframe (Mesh)
const wireframeMaterial = new THREE.LineBasicMaterial({
  color: 0x8A2BE2, // Electric Violet
  transparent: true,
  opacity: 0.5,
  blending: THREE.AdditiveBlending
});

const wireframe = new THREE.LineSegments(
  new THREE.WireframeGeometry(geometry),
  wireframeMaterial
);
scene.add(wireframe);

// Material for Nodes (Particles at vertices)
const pointsMaterial = new THREE.PointsMaterial({
  color: 0x00FFFF, // Cyber Cyan
  size: 0.15,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(geometry, pointsMaterial);
scene.add(particles);

// Group to hold both and apply parallax easily
const group = new THREE.Group();
group.add(wireframe);
group.add(particles);
scene.add(group);

// --- Mouse Interaction & Parallax ---
let targetRotationX = 0;
let targetRotationY = 0;
let mouseX = 0;
let mouseY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  // Normalize mouse coordinates for rotation (Parallax Effect)
  mouseX = (event.clientX - windowHalfX) * 0.001;
  mouseY = (event.clientY - windowHalfY) * 0.001;
});

// --- Animation Loop ---
function animate() {
  requestAnimationFrame(animate);

  // Smoothly rotate the group based on mouse position (Parallax)
  targetRotationX += (mouseY - targetRotationX) * 0.05;
  targetRotationY += (mouseX - targetRotationY) * 0.05;

  group.rotation.x += (targetRotationX - group.rotation.x) * 0.1;
  group.rotation.y += (targetRotationY - group.rotation.y) * 0.1;

  // Slowly auto-rotate base and pulsate scale (breathing effect)
  group.rotation.y += 0.002;
  group.rotation.x += 0.001;
  
  const time = Date.now() * 0.001;

  const scale =
    1 + Math.sin(time * 1.2) * 0.02;

  group.scale.set(scale, scale, scale);
  renderer.render(scene, camera);
}

animate();

// --- Window Resize Handling ---
window.addEventListener('resize', () => {
  if(container) {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
});
