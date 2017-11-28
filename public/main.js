import {UIControl} from './control.js';
import {Camera} from './Camera.js';
import {Face} from './Face.js';
import {Mesh, createMesh} from './Mesh.js';
import {Object3d} from './Object3d.js';
import {Vector} from './Vector.js';

import {transform} from './transform.js';
import {project} from './project.js';


function drawTriangle(vertices, context) {
    const first = vertices[0];

    context.strokeStyle = '#fff';
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

    const mesh = await fetch('./model/triangle.json').then(r => r.json()).then(createMesh);
    const camera = new Camera();

    UIControl({mesh, camera});


    function loop(time) {
        mesh.rotation.y = time / 600;
        //mesh.rotation.x = Math.sin(time / 3000) / 2;

        draw();
        requestAnimationFrame(loop);
    }

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const face of mesh.faces) {
            face.projected.forEach((projected, index) => {
                projected.copy(face.vertices[index]);
                transform(projected, mesh);
                project(projected, camera, canvas);
            });

            drawTriangle(face.projected, context);
        }

    }

    loop();
}

main();
