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

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const mesh = createMesh(cube);

const camera = new Camera();

mesh.forEach(polygon => {
    polygon.forEach(point => {
        camera.project(point);
    });

    drawPolygon(polygon, context);
});
