import {cube} from './models.js';
import {control} from './ui.js';
import {drawPolygon} from './draw.js';
import {Camera} from './camera.js';
import {Mesh} from './mesh.js';
import {Vec, toPoint} from './math.js';

function toCenter(point, canvas) {
    point.x += canvas.width / 2;
    point.y += canvas.height / 2;
}

async function main() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const mesh = new Mesh(cube.map(square => {
        const polygon = square.map(toPoint);
        return polygon;
    }));


    const camera = new Camera();


    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const polygon of mesh) {
            const projectedPolygon = polygon
                .map(point => point.clone())
                .map(point => {
                    mesh.transform(point);

                    camera.project(point);

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
