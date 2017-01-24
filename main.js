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
                    r: rPos,
                    g: gPos,
                    z: zPos,
                }));
            }

            yPos += 1;
            xPos += xStep;
            rPos += rStep;
            gPos += gStep;
            bPos += bStep;
        }
    }

    function drawSpans() {
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

                  /* The depth buffer makes sure that a triangle that is further away
                     does not obscure a triangle that is closer to the camera. This is
                     done by storing the z-value of each triangle pixel into the depth
                     buffer. To use the depth buffer we also interpolate between these
                     z-positions to calculate the z-position each pixel corresponds with.
                     We only draw the pixel if no "nearer" pixel has yet been drawn.
                     (This is also a feature that Metal provides for you already.) */
                  /*var shouldDrawPixel = true
                  if useDepthBuffer {
                    let z = edge1.z + (edge2.z - edge1.z) * pos
                    let offset = x + y * Int(context!.width)
                    if depthBuffer[offset] > z {
                      depthBuffer[offset] = z
                    } else {
                      shouldDrawPixel = false
                    }
                  }
                  */

                  /* Also interpolate the normal vector. Note that for many triangles
                     in the cube, all three vertices have the same normal vector. So
                     all pixels in such a triangle get identical normal vectors. But
                     this is not a requirement: I've also included a triangle whose
                     vertices have different normal vectors, giving it a more "rounded"
                     look. */
                  /*let nx = edge1.nx + (edge2.nx - edge1.nx) * pos
                  let ny = edge1.ny + (edge2.ny - edge1.ny) * pos
                  let nz = edge1.nz + (edge2.nz - edge1.nz) * pos
                  */
                  const shouldDrawPixel = true;
                  if (shouldDrawPixel) {
                    /*
                    const factor = Math.min(Math.max(0, -1*(nx*diffuseX + ny*diffuseY + nz*diffuseZ)), 1);

                    r *= (ambientR*ambientIntensity + factor*diffuseR*diffuseIntensity)
                    g *= (ambientG*ambientIntensity + factor*diffuseG*diffuseIntensity)
                    b *= (ambientB*ambientIntensity + factor*diffuseB*diffuseIntensity)

                    r = max(min(r, 1), 0)   // clamp the colors
                    g = max(min(g, 1), 0)   // so they don't
                    b = max(min(b, 1), 0)   // become too bright*/
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

const model = createModel();
const camera = new Object3d();
camera.fov = 100;

function loop() {
    clear();
    render();
    requestAnimationFrame(loop);
}

model.rotate.x = .25;
model.rotate.y = .25;

clear();
loop();
