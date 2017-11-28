import {Face} from './Face.js';
import {Object3d} from './Object3d.js';
import {Vector} from './Vector.js';

export class Mesh extends Object3d
{
    constructor(faces) {
        super();
        this.faces = faces;
        this.scale = new Vector(1, 1, 1);
    }
}

export function createMesh(spec) {
    const triangles = spec.map(triangle => {
        return new Face(triangle.map(([x, y, z]) => {
            return new Vector(x, y, z);
        }));
    });

    return new Mesh(triangles);
}
