import {Vec} from './math.js';

export class Camera {
    constructor() {
        this.pos = new Vec(0, 0, -500);
        this.zoom = 25;
    }

    project(point) {
        offset(point, this.pos);
        perspective(point, this);
    }
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
