import {square, doubleSquare} from './models.js';
import {drawPolygon} from './draw.js';

function toPoint([x, y, z]) {
    return {x, y, z};
}

function toPolygon(shape) {
    return shape.map(toPoint);
}

function createMesh(model) {
    return model.map(toPolygon);
}

class Camera {
    constructor() {
        this.pos = {z: 100};
        this.zoom = 8;
    }

    project(point) {
        perspective(point, this.pos.z);
        zoom(point, this.zoom);
    }
}

function perspective(point, distance) {
    const fov = point.z + distance;
    point.x /= fov;
    point.y /= fov;
}

function zoom(point, factor) {
    const scale = Math.pow(factor, 2);
    point.x *= scale;
    point.y *= scale;
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

console.log(square);

const mesh = createMesh(doubleSquare);
console.log(mesh);

const camera = new Camera();

mesh.forEach(polygon => {
    polygon.forEach(point => {
        camera.project(point);
    });

    drawPolygon(polygon, context);
});
