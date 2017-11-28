import {UIControl} from './control.js';
import {Camera} from './Camera.js';
import {Face} from './Face.js';
import {Mesh, createMesh} from './Mesh.js';
import {Object3d} from './Object3d.js';
import {Vector} from './Vector.js';

import {createTransformer} from './transform.js';

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

function createProjector(canvas) {
    function offset(vertex, offset) {
        vertex.x -= offset.x;
        vertex.y -= offset.y;
        vertex.z -= offset.z;
    }

    function perspective(vertex, fov) {
        vertex.x /= (vertex.z + fov) * (1 / fov);
        vertex.y /= (vertex.z + fov) * (1 / fov);
    }

    function zoom(vertex, factor) {
        vertex.x *= factor;
        vertex.y *= factor;
    }

    function center(vertex, canvas) {
        vertex.x += canvas.width / 2;
        vertex.y += canvas.height / 2;
    }

    function projectVertex(vertex, camera) {
        offset(vertex, camera.pos);

        perspective(vertex, camera.fov);

        zoom(vertex, ((canvas.width + canvas.height) / 2) / 80);

        center(vertex, canvas);
    }

    return function projectVertices(mesh, camera) {
        mesh.faces.forEach(face => {
            face.projected.forEach((vertex) => {
                projectVertex(vertex, camera);
            });
        });
    }
}

async function main() {
    const triangles = await fetch('./mesh.json').then(r => r.json());

    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const renderer = new Renderer(canvas);

    const mesh = createMesh(triangles);
    const camera = new Camera();

    UIControl({mesh, camera});


    function loop(time) {
        mesh.rotation.y = time / 600;
        mesh.rotation.x = Math.sin(time / 3000) / 2;
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
