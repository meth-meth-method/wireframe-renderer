import {Vector} from './Vector.js';

export class Face {
    constructor(vertices) {
        this.vertices = vertices;
        this.projected = vertices.map(_ => new Vector());
    }
}
