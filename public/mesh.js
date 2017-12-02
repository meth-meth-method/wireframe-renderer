
function createMesh(model) {
    return new Mesh(model.map(toPolygon));
}

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

class Mesh {
    constructor(polygons) {
        this.polygons = polygons;
        this.position = new Vec();
    }

    transform(point) {
        offset(point, this.position);
    }
}
