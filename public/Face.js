import {Vector} from './Vector.js';

export class Face extends Array {
    constructor(vertices) {
        super();
        this.color = undefined;
        this.push(...vertices);
    }
}
