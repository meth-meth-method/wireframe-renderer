import {square, doubleSquare, cube, pyramid} from './models.js';
import {drawPolygon} from './draw.js';
import {Camera} from './camera.js';
import {createMesh} from './mesh.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const mesh1 = createMesh(pyramid);
const mesh2 = createMesh(cube);
const scene = [mesh1, mesh2];

const camera = new Camera();
camera.pos.z = 200;
camera.zoom = 12;

function drawMesh(mesh, camera) {
    for (const polygon of mesh) {
        polygon.forEach(point => {
            mesh.transform(point);
            camera.project(point);
        });

        drawPolygon(polygon, context);
    }
}

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
        mesh.position.z = Math.sin(time / 2000) * 150;
        mesh.rotation.x -= 0.01;
        mesh.rotation.y -= 0.01;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    scene.forEach(mesh => drawMesh(mesh, camera));

    requestAnimationFrame(animate);
}

animate();
