import {square, doubleSquare, cube, pyramid} from './models.js';
import {Camera} from './camera.js';
import {createMesh} from './mesh.js';
import {createWireframeRenderer} from './render.js';

const canvas = document.querySelector('canvas');

const mesh1 = createMesh(pyramid);
const mesh2 = createMesh(cube);
const scene = [mesh1, mesh2];

const camera = new Camera();
camera.pos.z = 200;
camera.zoom = 12;

const render = createWireframeRenderer(canvas);


function animate(time) {
    {
        const mesh = scene[0];
        mesh.position.x = Math.sin(time / 1000) * 100;
        mesh.position.z = Math.sin(time / 1200) * 100;
        mesh.rotation.x += 0.01;
        mesh.rotation.y += 0.01;
    }

    {
        const mesh = scene[1];
        mesh.position.x = Math.sin(time / 500) * 75;
        mesh.position.z = Math.sin(time / 2000) * 120;
        mesh.rotation.x -= 0.01;
        mesh.rotation.y -= 0.01;
    }

    render(scene, camera);

    requestAnimationFrame(animate);
}

animate();
