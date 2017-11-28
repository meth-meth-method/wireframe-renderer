import {UIControl} from './control.js';
import {Camera} from './Camera.js';
import {Face} from './Face.js';
import {Mesh, createMesh} from './Mesh.js';
import {Object3d} from './Object3d.js';
import {Vector} from './Vector.js';

import {transform} from './transform.js';
import {project} from './project.js';

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(mesh, camera) {
        transform(mesh);

        for (const face of mesh.faces) {
            for (const vertex of face.projected) {
                project(vertex, camera, this.canvas);
            }
        }

        drawMesh(mesh, this.context);
    }
}

function drawMesh(mesh, context) {
    context.strokeStyle = '#fff';
    mesh.faces.forEach(face => {
        drawTriangle(face.projected, context);
    });
}

function drawTriangle(vertices, context) {
    const first = vertices[0];

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

    const renderer = new Renderer(canvas);

    const mesh = await fetch('./model/triangle.json').then(r => r.json()).then(createMesh);
    const camera = new Camera();

    UIControl({mesh, camera});


    function loop(time) {
        //mesh.rotation.y = time / 600;
        //mesh.rotation.x = Math.sin(time / 3000) / 2;
        render();
        requestAnimationFrame(loop);
    }

    function render(time) {
        renderer.clear();
        renderer.render(mesh, camera);
    }

    loop();
}

main();
