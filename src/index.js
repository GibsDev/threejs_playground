import './style.css';
import * as THREE from 'three';

const mouse = new THREE.Vector2(-1, -1);
let frametime = 0, fps = 1, lastFrame = Date.now().valueOf();

// Canvas setup
const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

function updateRenderSize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.raycast
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

window.addEventListener('resize', updateRenderSize);
window.addEventListener('load', updateRenderSize);
const debug = document.getElementById('debug');

// 3D stuff 
const cubeGeometry = new THREE.BoxGeometry();
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const m_solidGray = new THREE.MeshBasicMaterial({ color: 0xcccccc });
const m_solidDarkGray = new THREE.MeshBasicMaterial({ color: 0x333333 });
const m_wireframe = new THREE.MeshBasicMaterial({ wireframe: true });

const cube = new THREE.Mesh(cubeGeometry, m_wireframe);
const floor = new THREE.Mesh(floorGeometry, m_solidDarkGray);
floor.translateZ(-2);
scene.add(cube);
scene.add(floor);

camera.position.z = 0;
camera.position.y = -10;
camera.rotation.x = Math.PI / 2; // 90 degrees

let intersectInfo = '';
const raycaster = new THREE.Raycaster();

// Render loop
function animate() {
    requestAnimationFrame(animate);
    debug.innerText = debugText();

    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObject(cube, false);
    intersectInfo = JSON.stringify(intersect, null, 4);

    if (intersect.length > 0) {
        cube.material = m_solidGray;
    } else {
        cube.material = m_wireframe;
    }

    renderer.render(scene, camera);
    frametime = (Date.now().valueOf() - lastFrame);
    lastFrame = Date.now().valueOf();
};

animate();

renderer.setAnimationLoop(() => {
    renderer.render(scene, camera);
});

// Text to display in the debug panel
function debugText() {
    return [
        `frametime: ${frametime}`,
        `canvas mouse: (${mouse.x}, ${mouse.y})`,
        `intersect info: ${intersectInfo}`
    ].join('\n');
}

// Get mouse movements
window.addEventListener('mousemove', e => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
});
