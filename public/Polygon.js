import {Vector} from './Vector.js';

export class Polygon extends Array {
    constructor(vertices) {
        super();
        this.color = undefined;
        this.push(...vertices);
    }
}
