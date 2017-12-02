import {square} from './models.js';

function toPoint(values) {
    return {
        x: values[0],
        y: values[1],
        z: values[2],
    };
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

console.log(square);

const mesh = square.map(shape => shape.map(toPoint));
console.log(mesh);
