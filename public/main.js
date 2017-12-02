import {square} from './models.js';

function toPoint([x, y, z]) {
    return {x, y, z};
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

console.log(square);

const mesh = square.map(shape => shape.map(toPoint));
console.log(mesh);
