class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Vertex {
    constructor(def) {
        const data = Object.assign({
            x: 0, y: 0, z: 0,
            r: 0, g: 0, b: 0, a: 1,
            nx: 0, ny: 0, nz: 0,
        }, def);

        Object.keys(data).forEach(key => {
            this[key] = data[key];
        });
    }

    clone() {
        return new Vertex(this);
    }
}

class Span {
    constructor(vert1, vert2) {
    }
}

class Edge extends Vertex {
}

class Triangle {
    constructor(...vertices) {
        this.vertices = vertices.slice(0, 3);
    }
}

class Object3d
{
    constructor() {
        this.pos = new Vector();
        this.origin = new Vector();
        this.rotate = new Vector();
    }
}

class Model extends Object3d
{
    constructor(faces) {
        super();
        this.faces = faces;
        this.scale = new Vector(1, 1, 1);
    }
}

function createCube() {
    const triangles = [];
    const triangle = new Triangle(
        new Vertex({x: -10, y: -10, z: 0,
                    r: 0, g: 0, b: 1, a: 1,
                    nx: 0, ny: 0, nz: 1}),
        new Vertex({x: -10, y: 10, z: 0,
                    r: 0, g: 0, b: 1, a: 1,
                    nx: 0, ny: 0, nz: 1}),
        new Vertex({x: 10, y: -10, z: 0,
                    r: 0, g: 0, b: 1, a: 1,
                    nx: 0, ny: 0, nz: 1})
    );
    triangles.push(triangle);
    return new Model(triangles);
}

function clear() {
    image = context.createImageData(800, 600);
}

function drawTriangle(triangle) {
    triangle.vertices.forEach(drawVertex);
}

function drawVertex(v) {
    //console.log('Draw vertex', v);
    setPixel(v.x, v.y,
        v.r * 255, v.g * 255, v.b * 255, v.a * 255);
}

function setPixel(x, y, r, g, b, a) {
    const i = Math.round(y) * 4 * image.width + Math.round(x) * 4;
    const d = image.data;
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = a;
}

function transformAndProject(model) {
    return model.faces.map(tri => {
        return new Triangle(...tri.vertices.map(vert => {
            const v = vert.clone();

            v.x -= model.origin.x;
            v.y -= model.origin.y;
            v.z -= model.origin.z;

            v.x *= model.scale.x;
            v.y *= model.scale.y;
            v.z *= model.scale.z;

            [
                v.y,
                v.z,
            ] = [
                Math.cos(model.rotate.x) * v.y + Math.sin(model.rotate.x) * v.z,
                -Math.sin(model.rotate.x) * v.y + Math.cos(model.rotate.x) * v.z,
            ];

            [
                v.x,
                v.z,
            ] = [
                Math.cos(model.rotate.y) * v.x + Math.sin(model.rotate.y) * v.z,
                -Math.sin(model.rotate.y) * v.x + Math.cos(model.rotate.y) * v.z,
            ];

            [
                v.x,
                v.z,
            ] = [
                Math.cos(model.rotate.z) * v.x + Math.sin(model.rotate.z) * v.y,
                -Math.sin(model.rotate.z) * v.x + Math.cos(model.rotate.z) * v.y,
            ];

            [
                v.nx,
                v.nz,
            ] = [
                Math.cos(model.rotate.y) * v.nx + Math.sin(model.rotate.y) * v.nz,
                -Math.sin(model.rotate.y) * v.nx + Math.cos(model.rotate.y) * v.nz,
            ];

            v.x += model.pos.x;
            v.y += model.pos.y;
            v.z += model.pos.z;

            v.x -= camera.pos.x;
            v.y -= camera.pos.y;
            v.z -= camera.pos.z;

            v.x /= (v.z + 100) * 0.01;
            v.y /= (v.z + 100) * 0.01;

            v.x *= 600 / 80;
            v.y *= 600 / 80;

            v.x += 800 / 2;
            v.y += 800 / 2;

            return v;
        }))
    });
}

function render() {
    const projected = transformAndProject(model);
    projected.forEach(drawTriangle);
    updateScreen();
}

function updateScreen() {
    context.putImageData(image, 0, 0);
}

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
let image;

const model = createCube();
const camera = new Object3d();

function loop() {
    render();

    model.rotate.x += 0.1;
    //model.rotate.y += 0.1;
    model.rotate.z += 0.1;

    requestAnimationFrame(loop);
}
clear();

loop();