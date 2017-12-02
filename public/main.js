import {square, doubleSquare, cube} from './models.js';
import {drawPolygon} from './draw.js';
import {Camera} from './camera.js';

function toPoint([x, y, z]) {
    return {x, y, z};
}

function toPolygon(shape) {
    return shape.map(toPoint);
}

function createMesh(model) {
    return model.map(toPolygon);
}

function offset(point, position) {
    point.x += position.x;
    point.y += position.y;
    point.z += position.z;
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const mesh = createMesh(cube);
mesh.position = {x: 20, y: 30, z: -20};

const camera = new Camera();
camera.pos.z = 200;
camera.zoom = 12;

function drawMesh(mesh) {
    mesh.forEach(polygon => {
        const projectedPolygon = polygon
        .map(point => ({...point}))
        .map(point => {
            offset(point, mesh.position);

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
