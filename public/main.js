import {square} from './models.js';

function toPoint([x, y, z]) {
    return {x, y, z};
}

function toPolygon(shape) {
    return shape.map(toPoint);
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

console.log(square);

const mesh = square.map(toPolygon);
console.log(mesh);
