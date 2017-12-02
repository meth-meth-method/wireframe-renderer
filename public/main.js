import {square} from './models.js';

function toPoint([x, y, z]) {
    return {x, y, z};
}

function toPolygon(shape) {
    return shape.map(toPoint);
}

function createMesh(model) {
    return model.map(toPolygon);
}

function drawPolygon(polygon, context) {
    context.beginPath();

    const first = polygon[0];
    context.moveTo(first.x, first.y);
    for (const point of polygon) {
        context.lineTo(point.x, point.y);
    }
    context.lineTo(first.x, first.y);

    context.strokeStyle = '#fff';
    context.stroke();
}


const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

console.log(square);

const mesh = createMesh(square);
console.log(mesh);

mesh.forEach(polygon => {
    drawPolygon(polygon, context);
});
