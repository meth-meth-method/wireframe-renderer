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


function perspective(point, distance) {
    const fov = point.z + distance;
    point.x /= fov;
    point.y /= fov;
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

console.log(square);

const mesh = createMesh(doubleSquare);
console.log(mesh);

mesh.forEach(polygon => {
    polygon.forEach(point => {
        perspective(point, 2);
    });

    drawPolygon(polygon, context);
});
