// new three-bg.js: partículas conectadas y réacción al mouse

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 4000);
camera.position.z = 1000;

let renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-bg'), alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

let particleCount = 800;
let separation = 20;
let particles = [];
let particleGeo = new THREE.BufferGeometry();
let positions = new Float32Array(particleCount * 3);
let velocities = [];

for (let i = 0; i < particleCount; i++) {
  positions[3*i]   = (Math.random() - 0.5) * window.innerWidth;
  positions[3*i+1] = (Math.random() - 0.5) * window.innerHeight;
  positions[3*i+2] = (Math.random() - 0.5) * window.innerWidth / 2;
  velocities.push({
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    vz: (Math.random() - 0.5) * 0.5
  });
}

particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

let material = new THREE.PointsMaterial({ color: 0x00aaff, size: 3 });
let pointCloud = new THREE.Points(particleGeo, material);
scene.add(pointCloud);

let mouseX = 0, mouseY = 0;
document.addEventListener('mousemove', e => {
  mouseX = (e.clientX - window.innerWidth/2);
  mouseY = (e.clientY - window.innerHeight/2);
});

function animate() {
  requestAnimationFrame(animate);

  let pos = particleGeo.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    let vx = velocities[i].vx;
    let vy = velocities[i].vy;
    let vz = velocities[i].vz;
    pos[3*i]   += vx + mouseX * 0.00005;
    pos[3*i+1] += vy + mouseY * 0.00005;
    pos[3*i+2] += vz;
    // rebote
    if (pos[3*i] > window.innerWidth/2 || pos[3*i] < -window.innerWidth/2) velocities[i].vx *= -1;
    if (pos[3*i+1] > window.innerHeight/2 || pos[3*i+1] < -window.innerHeight/2) velocities[i].vy *= -1;
    if (pos[3*i+2] > window.innerWidth/2 || pos[3*i+2] < -window.innerWidth/2) velocities[i].vz *= -1;
  }
  particleGeo.attributes.position.needsUpdate = true;

  pointCloud.rotation.y += 0.0002;
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});