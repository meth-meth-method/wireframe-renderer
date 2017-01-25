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

function createModel(spec) {
    const triangles = spec.map(triangle => {
        return new Triangle(...triangle.map(vertex => {
            return new Vertex(vertex);
        }));
    });

    return new Model(triangles);
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
                let step = 1 / (edge2.x - edge1.x);
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
                    const factor = (nx * diffuseLight.x + ny * diffuseLight.y + nz * diffuseLight.z);
                    r *= (ambientLight.r * ambientLight.a + factor * diffuseLight.r * diffuseLight.a);
                    g *= (ambientLight.g * ambientLight.a + factor * diffuseLight.g * diffuseLight.a);
                    b *= (ambientLight.b * ambientLight.a + factor * diffuseLight.b * diffuseLight.a);

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

function setPixel(x, y, r, g, b, a) {
    if (x < 0 || x > image.width || y < 0 || y > image.height) {
        return;
    }

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

            let tempA, tempB;
            tempA = Math.cos(model.rotate.x) * v.y + Math.sin(model.rotate.x) * v.z;
            tempB = -Math.sin(model.rotate.x) * v.y + Math.cos(model.rotate.x) * v.z;
            v.y = tempA;
            v.z = tempB;

            tempA = Math.cos(model.rotate.y) * v.x + Math.sin(model.rotate.y) * v.z;
            tempB = -Math.sin(model.rotate.y) * v.x + Math.cos(model.rotate.y) * v.z;
            v.x = tempA;
            v.z = tempB;

            tempA = Math.cos(model.rotate.z) * v.x + Math.sin(model.rotate.z) * v.y;
            tempB = -Math.sin(model.rotate.z) * v.x + Math.cos(model.rotate.z) * v.y;
            v.x = tempA;
            v.y = tempB;

            v.x += model.pos.x;
            v.y += model.pos.y;
            v.z += model.pos.z;

            tempA = Math.cos(model.rotate.x) * v.ny + Math.sin(model.rotate.x) * v.nz;
            tempB = -Math.sin(model.rotate.x) * v.ny + Math.cos(model.rotate.x) * v.nz;
            v.ny = tempA;
            v.nz = tempB;

            tempA = Math.cos(model.rotate.y) * v.nx + Math.sin(model.rotate.y) * v.nz;
            tempB = -Math.sin(model.rotate.y) * v.nx + Math.cos(model.rotate.y) * v.nz;
            v.nx = tempA;
            v.nz = tempB;

            tempA = Math.cos(model.rotate.z) * v.nx + Math.sin(model.rotate.z) * v.ny;
            tempB = -Math.sin(model.rotate.z) * v.nx + Math.cos(model.rotate.z) * v.ny;
            v.nx = tempA;
            v.ny = tempB;

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
const model = createModel(modelData);
const camera = new Camera({y: 20, z: -20});
const ambientLight = new Light({r: 1, g: 1, b: 1, a: .2});
const diffuseLight = new Light({r: 1, g: 1, b: 1, a: .8, z: 1});

function loop() {
    clear();
    render();
    requestAnimationFrame(loop);
}

clear();
loop();
