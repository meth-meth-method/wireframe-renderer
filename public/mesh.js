import {Vec, toPoint} from './math.js';

export class Mesh {
    static create(model) {
        return new Mesh(model.map(shape => {
            const polygon = shape.map(toPoint);
            return polygon;
        }));
    }

    constructor(polygons) {
        this.polygons = polygons;

        this.scale = new Vec(1, 1, 1);
        this.rotation = new Vec(0, 0, 0);
    }

    *[Symbol.iterator]() {
        for (const polygon of this.polygons) {
            yield polygon;
        }
    }

    transform(point) {
        rotate(point, this.rotation);
        rescale(point, this.scale);
    }
}

function rotate(point, rotation) {
    const sin = new Vec();
    const cos = new Vec();

    cos.x = Math.cos(rotation.x);
    sin.x = Math.sin(rotation.x);

    cos.y = Math.cos(rotation.y);
    sin.y = Math.sin(rotation.y);

    cos.z = Math.cos(rotation.z);
    sin.z = Math.sin(rotation.z);

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

function rescale(point, scale) {
    point.x *= scale.x;
    point.y *= scale.y;
    point.z *= scale.z;
}
