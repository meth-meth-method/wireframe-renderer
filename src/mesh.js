import {Vec} from './math.js';

function toPoint([x, y, z]) {
    return new Vec(x, y, z);
}

function toPolygon(shape) {
    return shape.map(toPoint);
}

function offset(point, position) {
    point.x += position.x;
    point.y += position.y;
    point.z += position.z;
}

function rotate(point, rotation) {
    const sin = new Vec(
        Math.sin(rotation.x),
        Math.sin(rotation.y),
        Math.sin(rotation.z));

    const cos = new Vec(
        Math.cos(rotation.x),
        Math.cos(rotation.y),
        Math.cos(rotation.z));

    let temp1, temp2;

    temp1 = cos.x * point.y + sin.x * point.z;
    temp2 = -sin.x * point.y + cos.x * point.z;
    point.y = temp1;
    point.z = temp2;

    temp1 = cos.y * point.x + sin.y * point.z;
    temp2 = -sin.y * point.x + cos.y * point.z;
    point.x = temp1;
    point.z = temp2;

    temp1 = cos.z * point.x + sin.z * point.y;
    temp2 = -sin.z * point.x + cos.z * point.y;
    point.x = temp1;
    point.y = temp2;
}

export function createMesh(model) {
    return new Mesh(model.map(toPolygon));
}

export class Mesh {
    constructor(polygons) {
        this.polygons = polygons;
        this.position = new Vec();
        this.rotation = new Vec();
    }

    transform() {
        let polys = [];
        for (const polygon of this.polygons) {
            polys.push(polygon.map(point => {
                const out = Object.assign({}, point);
                this.transform_(out);
                return out;
            }));
        }
        return new Mesh(polys);
    }

    transform_(point) {
        rotate(point, this.rotation);
        offset(point, this.position);
    }
}
