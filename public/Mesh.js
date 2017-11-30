import {Polygon} from './Polygon.js';
import {Object3d} from './Object3d.js';
import {Vector} from './Vector.js';

export class Mesh extends Object3d
{
    constructor(polygons) {
        super();
        this.polygons = polygons;
        this.scale = new Vector(1, 1, 1);
    }
}

export function createMesh(meshSpec) {
    const polygons = meshSpec.map(faceSpec => {
        const vertices = faceSpec.verts.map(([x, y, z]) => new Vector(x, y, z));
        const face = new Polygon(vertices);
        face.color = faceSpec.color;
        return face;
    });

    return new Mesh(polygons);
}
