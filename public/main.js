import {cube} from './models.js';
import {control} from './ui.js';
import {drawPolygon} from './draw.js';

class Vec {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone() {
        return new Vec(this.x, this.y, this.z);
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

    point.x *= camera.zoom;
    point.y *= camera.zoom;
}

function offset(vertex, pos) {
    vertex.x -= pos.x;
    vertex.y -= pos.y;
    vertex.z -= pos.z;
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
        zoom: 500,
    };

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const polygon of mesh) {
            const projectedPolygon = polygon
                .map(point => point.clone())
                .map(point => {
                    offset(point, camera.pos);
                    perspective(point, camera);
                    toCenter(point, canvas);
                    return point;
                });

            drawPolygon(projectedPolygon, context);
        }
    }

    control({camera}, draw);

    draw();
}

main();
