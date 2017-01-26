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

class Edge extends Vertex {
}

class Span {
    constructor() {
        this.edges = [];
    }

    get leftEdge() {
        return this.edges[0].x < this.edges[1].x
            ? this.edges[0]
            : this.edges[1];
    }

    get rightEdge() {
        return this.edges[0].x > this.edges[1].x
            ? this.edges[0]
            : this.edges[1];
    }
}

class Face {
    constructor(vertices) {
        this.vertices = vertices;
        this.projected = new Array(3);
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

class Light extends Vertex {
}

class Camera extends Object3d
{
    constructor() {
        super();
        this.fov = 90;
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

class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.buffer = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.depthBuffer = new Array(this.canvas.width * this.canvas.height);
        this.lines = new Array(this.canvas.height);
    }

    addEdge(lines, from, to) {
        let yDiff = Math.ceil(to.y - 0.5) - Math.ceil(from.y - 0.5);
        if (yDiff == 0) {
            return;
        }

        const [start, end] = yDiff > 0 ? [from, to] : [to, from];
        const len = Math.abs(yDiff);

        let yPos = Math.ceil(start.y - 0.5);
        const yEnd = Math.ceil(end.y - 0.5);

        const xStep = (end.x - start.x) / len;
        let xPos = start.x + xStep / 2;

        const zStep = (end.z - start.z) / len;
        let zPos = start.z + zStep / 2;

        const rStep = (end.r - start.r) / len;
        let rPos = start.r;

        const gStep = (end.g - start.g) / len;
        let gPos = start.g;

        const bStep = (end.b - start.b) / len;
        let bPos = start.b;

        const aStep = (end.a - start.a) / len;
        let aPos = start.a;

        const nxStep = (end.nx - start.nx) / len;
        let nxPos = start.nx;

        const nyStep = (end.ny - start.ny) / len;
        let nyPos = start.ny;

        const nzStep = (end.nz - start.nz) / len;
        let nzPos = start.nz;

        while (yPos < yEnd) {
            const x = Math.ceil(xPos - 0.5);

            if (yPos >= 0 && yPos < canvas.height) {
                if (yPos < this.firstLine) {
                    this.firstLine = yPos;
                }
                if (yPos > this.lastLine) {
                    this.lastLine = yPos;
                }

                if (!lines[yPos]) {
                    lines[yPos] = new Span();
                }

                lines[yPos].edges.push(new Edge({
                    x: x,
                    z: zPos,
                    nx: nxPos,
                    ny: nyPos,
                    nz: nzPos,
                    r: rPos,
                    g: gPos,
                    b: bPos,
                    a: aPos,
                }));
            }

            yPos += 1;
            xPos += xStep;
            zPos += zStep;
            rPos += rStep;
            gPos += gStep;
            bPos += bStep;
            aPos += aStep;
            nxPos += nxStep;
            nyPos += nyStep;
            nzPos += nzStep;
        }
    }

    drawLines(lines) {
        for (let y = this.firstLine; y <= this.lastLine; ++y) {
            if (lines[y]) {
                const edge1 = lines[y].leftEdge;
                const edge2 = lines[y].rightEdge;
                lines[y] = undefined;

                // How much to interpolate on each step.
                const step = 1 / (edge2.x - edge1.x);
                let pos = 0;

                for (let x = edge1.x; x < edge2.x; ++x) {
                    const z = edge1.z + (edge2.z - edge1.z) * pos;
                    const offset = x + y * canvas.width;
                    if (this.depthBuffer[offset] > z) {
                        this.depthBuffer[offset] = z
                        let r = edge1.r + (edge2.r - edge1.r) * pos;
                        let g = edge1.g + (edge2.g - edge1.g) * pos;
                        let b = edge1.b + (edge2.b - edge1.b) * pos;
                        const a = edge1.a + (edge2.a - edge1.a) * pos;

                        let nx = edge1.nx + (edge2.nx - edge1.nx) * pos;
                        let ny = edge1.ny + (edge2.ny - edge1.ny) * pos;
                        let nz = edge1.nz + (edge2.nz - edge1.nz) * pos;

                        const factor = (nx * diffuseLight.x + ny * diffuseLight.y + nz * diffuseLight.z);
                        r = r * (ambientLight.r * ambientLight.a + factor * diffuseLight.r * diffuseLight.a);
                        g = g * (ambientLight.g * ambientLight.a + factor * diffuseLight.g * diffuseLight.a);
                        b = b * (ambientLight.b * ambientLight.a + factor * diffuseLight.b * diffuseLight.a);

                        r = Math.max(Math.min(r, 1), 0);
                        g = Math.max(Math.min(g, 1), 0);
                        b = Math.max(Math.min(b, 1), 0);

                        this.setPixel(x, y,
                            r * 255 | 0,
                            g * 255 | 0,
                            b * 255 | 0,
                            a * 255 | 0);
                    }

                    pos = pos + step
                }
            }
        }
    }

    render(model, camera) {
        for (let i = 3; i < this.buffer.data.length; i = i + 4) {
            this.buffer.data[i] = 0;
        }

        this.depthBuffer.fill(Infinity);

        const verts = new Array(3);
        for (let i = 0; i !== model.faces.length; ++i) {
            const face = model.faces[i];
            for (let j = 0; j < 3; ++j) {
                verts[j] = face.vertices[j].clone();
                transformVertex(verts[j], model);
                projectVertex(verts[j], camera);
            }

            this.firstLine = Infinity;
            this.lastLine = -1;

            this.addEdge(this.lines, verts[0], verts[1]);
            this.addEdge(this.lines, verts[1], verts[2]);
            this.addEdge(this.lines, verts[2], verts[0]);
            this.drawLines(this.lines);
        }

        this.context.putImageData(this.buffer, 0, 0);
    }

    setPixel(x, y, r, g, b, a) {
        if (x < 0 || x > this.buffer.width || y < 0 || y > this.buffer.height) {
            return;
        }

        const i = Math.round(y) * 4 * this.buffer.width + Math.round(x) * 4;
        const d = this.buffer.data;
        d[i] = r;
        d[i + 1] = g;
        d[i + 2] = b;
        d[i + 3] = a;
    }
}

function createModel(spec) {
    const triangles = spec.map(triangle => {
        return new Face(triangle.map(vertex => {
            return new Vertex(vertex);
        }));
    });

    return new Model(triangles);
}

function transformVertex(vertex, model) {
    vertex.x = vertex.x - model.origin.x;
    vertex.y = vertex.y - model.origin.y;
    vertex.z = vertex.z - model.origin.z;

    vertex.x = vertex.x * model.scale.x;
    vertex.y = vertex.y * model.scale.y;
    vertex.z = vertex.z * model.scale.z;

    let tempA, tempB;
    tempA = Math.cos(model.rotate.x) * vertex.y + Math.sin(model.rotate.x) * vertex.z;
    tempB = -Math.sin(model.rotate.x) * vertex.y + Math.cos(model.rotate.x) * vertex.z;
    vertex.y = tempA;
    vertex.z = tempB;

    tempA = Math.cos(model.rotate.y) * vertex.x + Math.sin(model.rotate.y) * vertex.z;
    tempB = -Math.sin(model.rotate.y) * vertex.x + Math.cos(model.rotate.y) * vertex.z;
    vertex.x = tempA;
    vertex.z = tempB;

    tempA = Math.cos(model.rotate.z) * vertex.x + Math.sin(model.rotate.z) * vertex.y;
    tempB = -Math.sin(model.rotate.z) * vertex.x + Math.cos(model.rotate.z) * vertex.y;
    vertex.x = tempA;
    vertex.y = tempB;

    vertex.x = vertex.x + model.pos.x;
    vertex.y = vertex.y + model.pos.y;
    vertex.z = vertex.z + model.pos.z;

    tempA = Math.cos(model.rotate.x) * vertex.ny + Math.sin(model.rotate.x) * vertex.nz;
    tempB = -Math.sin(model.rotate.x) * vertex.ny + Math.cos(model.rotate.x) * vertex.nz;
    vertex.ny = tempA;
    vertex.nz = tempB;

    tempA = Math.cos(model.rotate.y) * vertex.nx + Math.sin(model.rotate.y) * vertex.nz;
    tempB = -Math.sin(model.rotate.y) * vertex.nx + Math.cos(model.rotate.y) * vertex.nz;
    vertex.nx = tempA;
    vertex.nz = tempB;

    tempA = Math.cos(model.rotate.z) * vertex.nx + Math.sin(model.rotate.z) * vertex.ny;
    tempB = -Math.sin(model.rotate.z) * vertex.nx + Math.cos(model.rotate.z) * vertex.ny;
    vertex.nx = tempA;
    vertex.ny = tempB;
}

function projectVertex(vertex, camera) {
    vertex.x = vertex.x - camera.pos.x;
    vertex.y = vertex.y - camera.pos.y;
    vertex.z = vertex.z - camera.pos.z;

    vertex.x /= (vertex.z + camera.fov) * (1 / camera.fov);
    vertex.y /= (vertex.z + camera.fov) * (1 / camera.fov);

    vertex.x *= canvas.height / 80;
    vertex.y *= canvas.height / 80;

    vertex.x += canvas.width / 2;
    vertex.y += canvas.height / 2;
}


const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);

const model = createModel(modelData);
const camera = new Camera({y: 20, z: -20});
const ambientLight = new Light({r: 1, g: 1, b: 1, a: .2});
const diffuseLight = new Light({r: 1, g: 1, b: 1, a: .8, z: 1});

function loop() {
    render();
    requestAnimationFrame(loop);
}

function render() {
    renderer.render(model, camera);
}

loop();
