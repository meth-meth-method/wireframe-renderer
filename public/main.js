import {cube} from './models.js';
import {drawPolygon} from './draw.js';

class Vec {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

function toPoint([x, y, z]) {
    return new Vec(x, y, z);
}

function toCenter(point, canvas) {
    point.x += canvas.width / 2;
    point.y += canvas.height / 2;
}

function perspective(point, camera) {
    const fov = point.z + (point.z - camera.pos.z);
    point.x /= fov;
    point.y /= fov;
}

async function main() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    console.log(cube);
    const mesh = cube.map(square => {
        const polygon = square.map(toPoint);
        return polygon;
    });
    console.log(mesh);

    const camera = {
        pos: new Vec(0, 0, -500),
    };

    for (const polygon of mesh) {
        for (const point of polygon) {
            perspective(point, camera)
            toCenter(point, canvas);
        }
        drawPolygon(polygon, context);
    }
}

main();
