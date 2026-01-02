import * as THREE from 'three';
import { gsap } from 'gsap';

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, cube: THREE.Mesh;

export function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const canvas = document.querySelector('#bg') as HTMLCanvasElement;
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Cube
    const geometry = new THREE.BoxGeometry();
    const materials = [
        new THREE.MeshBasicMaterial({ color: 0xff0000 }), // right
        new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // left
        new THREE.MeshBasicMaterial({ color: 0x0000ff }), // top
        new THREE.MeshBasicMaterial({ color: 0xffff00 }), // bottom
        new THREE.MeshBasicMaterial({ color: 0x00ffff }), // front
        new THREE.MeshBasicMaterial({ color: 0xff00ff })  // back
    ];
    cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();
}

export function rollDice() {
    const rotations = [
        { x: 0, y: 0 }, // Face 1 (front)
        { x: 0, y: Math.PI }, // Face 2 (back)
        { x: -Math.PI / 2, y: 0 }, // Face 3 (top)
        { x: Math.PI / 2, y: 0 }, // Face 4 (bottom)
        { x: 0, y: -Math.PI / 2 }, // Face 5 (right)
        { x: 0, y: Math.PI / 2 } // Face 6 (left)
    ];

    const randomFace = rotations[Math.floor(Math.random() * rotations.length)];

    // Add some extra spin for the rolling effect
    const finalRotationX = randomFace.x + 2 * Math.PI * (Math.floor(Math.random() * 2) + 1);
    const finalRotationY = randomFace.y + 2 * Math.PI * (Math.floor(Math.random() * 2) + 1);


    gsap.to(cube.rotation, {
        x: finalRotationX,
        y: finalRotationY,
        duration: 2,
        ease: 'power2.out',
    });
}
