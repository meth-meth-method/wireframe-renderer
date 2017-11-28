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

export function createMesh(meshSpec) {
    const faces = meshSpec.map(faceSpec => {
        const vertices = faceSpec.verts.map(([x, y, z]) => new Vector(x, y, z));
        const face = new Face(vertices);
        face.color = faceSpec.color;
        return face;
    });

    return new Mesh(faces);
}
