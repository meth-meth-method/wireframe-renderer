import {Object3d} from './Object3d.js';

function offset(vertex, pos) {
    vertex.x -= pos.x;
    vertex.y -= pos.y;
    vertex.z -= pos.z;
}

function perspective(vertex, pos) {
    const fov = vertex.z + (vertex.z - pos.z);
    vertex.x /= fov;
    vertex.y /= fov;
}

function zoom(vertex, factor) {
    vertex.x *= factor;
    vertex.y *= factor;
}

function center(vertex, canvas) {
    vertex.x += canvas.width / 2;
    vertex.y += canvas.height / 2;
}

export class Camera extends Object3d
{
    constructor() {
        super();
        this.zoom = 500;
    }

    project(vertex, canvas) {
        offset(vertex, this.pos);
        perspective(vertex, this.pos);
        zoom(vertex, this.zoom);
        center(vertex, canvas);
    }
}
