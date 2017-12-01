import {Object3d} from './Object3d.js';
import {Polygon} from './Polygon.js';
import {Vector} from './Vector.js';

export function createMesh(meshSpec) {
    const polygons = meshSpec.map(faceSpec => {
        const vertices = faceSpec.verts.map(([x, y, z]) => new Vector(x, y, z));
        const face = new Polygon(vertices);
        face.color = faceSpec.color;
        return face;
    });

    return new Mesh(polygons);
}

function offset(vertex, origin) {
    vertex.x -= origin.x;
    vertex.y -= origin.y;
    vertex.z -= origin.z;
}

function scale(vertex, scale) {
    vertex.x *= scale.x;
    vertex.y *= scale.y;
    vertex.z *= scale.z;
}

function move(vertex, position) {
    vertex.x += position.x;
    vertex.y += position.y;
    vertex.z += position.z;
}

function rotate(vertex, rotation) {
    const sin = new Vector();
    const cos = new Vector();

    cos.x = Math.cos(rotation.x);
    sin.x = Math.sin(rotation.x);

    cos.y = Math.cos(rotation.y);
    sin.y = Math.sin(rotation.y);

    cos.z = Math.cos(rotation.z);
    sin.z = Math.sin(rotation.z);

    let temp1, temp2;

    temp1 = cos.x * vertex.y + sin.x * vertex.z;
    temp2 = -sin.x * vertex.y + cos.x * vertex.z;
    vertex.y = temp1;
    vertex.z = temp2;

    temp1 = cos.y * vertex.x + sin.y * vertex.z;
    temp2 = -sin.y * vertex.x + cos.y * vertex.z;
    vertex.x = temp1;
    vertex.z = temp2;

    temp1 = cos.z * vertex.x + sin.z * vertex.y;
    temp2 = -sin.z * vertex.x + cos.z * vertex.y;
    vertex.x = temp1;
    vertex.y = temp2;
}

export class Mesh extends Object3d
{
    constructor(polygons) {
        super();
        this.polygons = polygons;
        this.scale = new Vector(1, 1, 1);
    }

    transform(vertex) {
        offset(vertex, this.origin);
        scale(vertex, this.scale);
        rotate(vertex, this.rotation);
        move(vertex, this.pos);
    }
}
