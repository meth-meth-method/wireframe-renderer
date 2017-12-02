import {square, doubleSquare, cube} from './models.js';
import {drawPolygon} from './draw.js';
import {Camera} from './camera.js';
import {Vec} from './math.js';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const mesh = createMesh(cube);

const camera = new Camera();
camera.pos.z = 200;
camera.zoom = 12;

function drawMesh(mesh) {
    mesh.polygons.forEach(polygon => {
        const projectedPolygon = polygon
        .map(point => ({...point}))
        .map(point => {
            mesh.transform(point);

            camera.project(point);
            return point;
        });

        drawPolygon(projectedPolygon, context);
    });
}

function animate(time) {
    mesh.position.x = Math.sin(time / 1000) * 100;
    mesh.position.z = Math.sin(time / 1200) * 100;

    context.clearRect(0, 0, canvas.width, canvas.height);
    drawMesh(mesh);
    requestAnimationFrame(animate);
}

animate();
