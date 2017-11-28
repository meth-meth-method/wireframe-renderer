import {UIControl} from './control.js';
import {Camera} from './Camera.js';
import {Face} from './Face.js';
import {Mesh, createMesh} from './Mesh.js';
import {Object3d} from './Object3d.js';
import {Vector} from './Vector.js';

import {createTransformer} from './transform.js';
import {createProjector} from './project.js';

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.projectVertices = createProjector(canvas);
        this.transformVertices = createTransformer();
        this.drawMesh = createWireframeDrawer(this.canvas);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(mesh, camera) {
        this.transformVertices(mesh);
        this.projectVertices(mesh, camera);

        this.drawMesh(mesh);
    }
}

function createWireframeDrawer(canvas) {
    const context = canvas.getContext('2d');

    return function drawMesh(mesh) {
        context.strokeStyle = '#fff';
        mesh.faces.forEach(faces => {
            const verts = faces.projected;
            context.beginPath();
            context.moveTo(verts[0].x, verts[0].y);
            verts.forEach((vert, index) => {
                context.lineTo(vert.x, vert.y);
            });
            context.lineTo(verts[0].x, verts[0].y);
            context.stroke();
        });
    };
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
