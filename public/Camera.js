import {Object3d} from './Object3d.js';

export class Camera extends Object3d
{
    constructor() {
        super();
        this.fov = 80;
        this.zoom = 50;
    }
}
