import {cube} from './models.js';
import {control} from './ui.js';
import {drawPolygon} from './draw.js';
import {Mesh} from './mesh.js';
import {Vec, toPoint} from './math.js';

function toCenter(point, canvas) {
    point.x += canvas.width / 2;
    point.y += canvas.height / 2;
}

function perspective(point, camera) {
    const fov = point.z + (point.z - camera.pos.z);
    point.x /= fov;
    point.y /= fov;

    const zoom = Math.pow(camera.zoom, 2);
    point.x *= zoom;
    point.y *= zoom;
}

function offset(vertex, pos) {
    vertex.x -= pos.x;
    vertex.y -= pos.y;
    vertex.z -= pos.z;
}

async function main() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const mesh = new Mesh(cube.map(square => {
        const polygon = square.map(toPoint);
        return polygon;
    }));


    const camera = {
        pos: new Vec(0, 0, -500),
        zoom: 25,
    };


    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const polygon of mesh) {
            const projectedPolygon = polygon
                .map(point => point.clone())
                .map(point => {
                    mesh.transform(point);

                    offset(point, camera.pos);
                    perspective(point, camera);
                    toCenter(point, canvas);
                    return point;
                });

            drawPolygon(projectedPolygon, context);
        }
    }

    function animate(time) {
        camera.pos.x = Math.sin(time / 300) * 100;
        draw();
        requestAnimationFrame(animate);
    }

    animate();

    control({camera, mesh});
}

main();
