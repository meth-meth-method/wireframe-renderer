import {UIControl} from './control.js';
import {Camera} from './Camera.js';
import {Mesh, createMesh} from './Mesh.js';
import {Object3d} from './Object3d.js';
import {Vector} from './Vector.js';

import {transform} from './transform.js';
import {project} from './project.js';


function drawPolygon(vertices, context, color = '#fff') {
    const first = vertices[0];

    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(first.x, first.y);
    vertices.forEach((vert, index) => {
        context.lineTo(vert.x, vert.y);
    });
    context.lineTo(first.x, first.y);
    context.stroke();
}

async function main() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const mesh = await fetch('./model/cube.json').then(r => r.json()).then(createMesh);
    const camera = new Camera();
    camera.pos.z = 30;

    UIControl({mesh, camera});

    function loop(time) {
        mesh.rotation.y = time / 1000;
        //mesh.rotation.x = Math.sin(time / 3000) / 2;

        draw();
        requestAnimationFrame(loop);
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const polygon of mesh.polygons) {
            const triangle = [];
            for (const vertex of polygon) {
                const projected = vertex.clone();
                transform(projected, mesh);
                project(projected, camera, canvas);
                triangle.push(projected);
            }

            drawPolygon(triangle, context, polygon.color);
        }

    }

    loop();
}

main();
