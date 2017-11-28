import {Vector} from './Vector.js';

export class Object3d
{
    constructor() {
        this.pos = new Vector();
        this.origin = new Vector();
        this.rotation = new Vector();
    }
}
