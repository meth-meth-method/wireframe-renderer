import {square} from './models.js';
import {drawPolygon} from './draw.js';

function toPoint([x, y]) {
    return {x, y};
}

function toCenter(point, canvas) {
    point.x += canvas.width / 2;
    point.y += canvas.height / 2;
}

async function main() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    console.log(square);
    const polygon = square.map(toPoint);
    console.log(polygon);

    for (const point of polygon) {
        toCenter(point, canvas);
    }

    drawPolygon(polygon, context);
}

main();
