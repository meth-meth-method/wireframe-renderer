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

function createModel() {
    const triangles = [
        new Triangle(
            new Vertex({x: -10, y: -10, z: 0,
                        r: 1, g: 0, b: 0, a: 1,
                        nx: 0, ny: 0, nz: 1}),
            new Vertex({x: -10, y: 10, z: 0,
                        r: 0, g: 1, b: 0, a: 1,
                        nx: 0, ny: 0, nz: 1}),
            new Vertex({x: 10, y: -10, z: 0,
                        r: 0, g: 0, b: 1, a: 1,
                        nx: 0, ny: 0, nz: 1})),
        new Triangle(
            new Vertex({x: 10, y: 10, z: 0,
                        r: 1, g: 0, b: 0, a: 1,
                        nx: 0, ny: 0, nz: 1}),
            new Vertex({x: 10, y: -10, z: 0,
                        r: 0, g: 1, b: 0, a: 1,
                        nx: 0, ny: 0, nz: 1}),
            new Vertex({x: -10, y: 10, z: 0,
                        r: 0, g: 0, b: 1, a: 1,
                        nx: 0, ny: 0, nz: 1})),
    ];

    return new Model(triangles);

    let x = size, y = size, z = size;

    for (let t = 0; t < 12; ++t) {
        const verts = [];
        for (let v = 0; v < 3; ++v) {
            const i = t * 3 + v;
            x = -x;
            if (i % 2 == 0) {
                y = -y;
            }
            if (i % 4 == 0) {
                z = -z;
            }
            const vert = new Vertex({
                x, y, z,
                r: 0, g: 0, b: 1, a: 1,
                nx: 0, ny: 0, nz: 1
            });

            verts.push(vert);
        }
        triangles.push(new Triangle(...verts));
    }

    return new Model(triangles.slice(0, 3));
}

function clear() {
    image = context.createImageData(800, 600);
}


function drawTriangle(triangle) {
    const spans = new Array(canvas.height).fill(0);
    let firstSpanLine = Infinity;
    let lastSpanLine = -1;

    function addEdge(spans, from, to) {
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

        const zStep = (end.z - start.z) / len
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
                if (yPos < firstSpanLine) {
                    firstSpanLine = yPos;
                }
                if (yPos > lastSpanLine) {
                    lastSpanLine = yPos;
                }

                if (!spans[yPos]) {
                    spans[yPos] = new Span();
                }

                spans[yPos].edges.push(new Edge({
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
            rPos += rStep;
            gPos += gStep;
            bPos += bStep;
            aPos += aStep;
            nxPos += nxStep;
            nyPos += nyStep;
            nzPos += nzStep;
        }
    }

    function drawSpans() {
        const depthBuffer = new Array(canvas.width * canvas.height).fill(Infinity);

        for (let y = firstSpanLine; y <= lastSpanLine; ++y) {
            if (spans[y].edges.length === 2) {
                let edge1 = spans[y].leftEdge;
                let edge2 = spans[y].rightEdge;

                // How much to interpolate on each step.
                let step = 1 / edge2.x - edge1.x;
                let pos = 0;

                for (let x = edge1.x; x < edge2.x; ++x) {
                    let r = edge1.r + (edge2.r - edge1.r) * pos;
                    let g = edge1.g + (edge2.g - edge1.g) * pos;
                    let b = edge1.b + (edge2.b - edge1.b) * pos;
                    const a = edge1.a + (edge2.a - edge1.a) * pos;

                    let nx = edge1.nx + (edge2.nx - edge1.nx) * pos;
                    let ny = edge1.ny + (edge2.ny - edge1.ny) * pos;
                    let nz = edge1.nz + (edge2.nz - edge1.nz) * pos;

                  /* The depth buffer makes sure that a triangle that is further away
                     does not obscure a triangle that is closer to the camera. This is
                     done by storing the z-value of each triangle pixel into the depth
                     buffer. To use the depth buffer we also interpolate between these
                     z-positions to calculate the z-position each pixel corresponds with.
                     We only draw the pixel if no "nearer" pixel has yet been drawn.
                     (This is also a feature that Metal provides for you already.) */
                  /*var shouldDrawPixel = true

                  */

                  let shouldDrawPixel = true;
                  if (useDepthBuffer) {
                    let z = edge1.z + (edge2.z - edge1.z) * pos
                    let offset = x + y * canvas.width;
                    if (depthBuffer[offset] > z) {
                      depthBuffer[offset] = z
                    } else {
                      shouldDrawPixel = false
                    }
                  }

                  if (shouldDrawPixel) {

                    const factor = Math.min(Math.max(0, -1 * (nx * diffuseLight.x + ny * diffuseLight.y + nz * diffuseLight.z)), 1);

                    r *= (ambientLight.r * ambientLight.a + factor * diffuseLight.r * diffuseLight.a);
                    g *= (ambientLight.g * ambientLight.a + factor * diffuseLight.g * diffuseLight.a)
                    b *= (ambientLight.b * ambientLight.a + factor * diffuseLight.b * diffuseLight.a)

                    r = Math.max(Math.min(r, 1), 0);
                    g = Math.max(Math.min(g, 1), 0);
                    b = Math.max(Math.min(b, 1), 0);
                    setPixel(x, y, r * 255, g * 255, b * 255, a * 255);
                  }

                  pos = pos + step
                }
            }
        }
    }

    const t = triangle.vertices;
    addEdge(spans, t[0], t[1]);
    addEdge(spans, t[1], t[2]);
    addEdge(spans, t[2], t[0]);

    drawSpans(spans);
}

function drawVertex(v) {
    //console.log('Draw vertex', v);
    setPixel(v.x, v.y,
        v.r * 255, v.g * 255, v.b * 255, v.a * 255);
}

function setPixel(x, y, r, g, b, a) {
    //console.log(x,y,r,g,b,a);
    const i = Math.round(y) * 4 * image.width + Math.round(x) * 4;
    const d = image.data;
    d[i] = r | 0;
    d[i + 1] = g | 0;
    d[i + 2] = b | 0;
    d[i + 3] = a | 0;
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

            v.x /= (v.z + camera.fov) * (1 / camera.fov);
            v.y /= (v.z + camera.fov) * (1 / camera.fov);

            v.x *= canvas.height / 80;
            v.y *= canvas.height / 80;

            v.x += canvas.width / 2;
            v.y += canvas.height / 2;

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

let useDepthBuffer = true;
const model = createModel();
const camera = new Camera();
const ambientLight = new Light({r: 1, g: 1, b: 1, a: .2});
const diffuseLight = new Light({r: 1, g: 1, b: 1, a: .8, z: 1});

function loop() {
    clear();
    render();
    requestAnimationFrame(loop);
}

model.rotate.x = .25;
model.rotate.y = .25;

clear();
loop();
