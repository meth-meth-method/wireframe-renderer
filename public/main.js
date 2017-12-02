import {square} from './models.js';
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


const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

console.log(square);

const mesh = createMesh(square);
console.log(mesh);

mesh.forEach(polygon => {
    drawPolygon(polygon, context);
});
