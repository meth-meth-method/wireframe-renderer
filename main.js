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

        this.copy(data);
    }

    clone() {
        return new Vertex(this);
    }

    copy(vertex) {
        Object.keys(vertex).forEach(key => {
            this[key] = vertex[key];
        });
    }
}

class Face {
    constructor(vertices) {
        this.vertices = vertices;
        this.projected = vertices.map(_ => new Vertex());
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

        this.projectVertices = createProjector();
        this.transformVertices = createTransformer();
        this.drawModel = createWireframeDrawer(this.canvas);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(model, camera) {
        var face, verts, i, j;
        for (i = 0; i !== model.faces.length; ++i) {
            face = model.faces[i];
            verts = face.projected;
            for (j = 0; j < 3; ++j) {
                verts[j].copy(face.vertices[j]);
            }

            this.transformVertices(verts, model);
            this.projectVertices(verts, camera);
        }

        this.drawModel(model);
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

function createWireframeDrawer(canvas) {
    const context = canvas.getContext('2d');

    return function drawModel(model) {
        context.strokeStyle = '#fff';
        model.faces.forEach(faces => {
            const verts = faces.projected;
            context.beginPath();
            context.moveTo(verts[0].x, verts[0].y);
            verts.forEach((vert, index) => {
                context.lineTo(vert.x, vert.y);
            });
            context.lineTo(verts[0].x, verts[0].y);
            context.stroke();
        });
    };
}

function createTransformer() {
    let cx, sx,  cy, sy,  cz, sz;
    let t1, t2;

    let r, s, o, p;

    function transformVertex(v) {
        v.x = v.x - o.x;
        v.y = v.y - o.y;
        v.z = v.z - o.z;

        v.x = v.x * s.x;
        v.y = v.y * s.y;
        v.z = v.z * s.z;

        t1 = cx * v.y + sx * v.z;
        t2 = -sx * v.y + cx * v.z;
        v.y = t1;
        v.z = t2;

        t1 = cy * v.x + sy * v.z;
        t2 = -sy * v.x + cy * v.z;
        v.x = t1;
        v.z = t2;

        t1 = cz * v.x + sz * v.y;
        t2 = -sz * v.x + cz * v.y;
        v.x = t1;
        v.y = t2;

        v.x = v.x + p.x;
        v.y = v.y + p.y;
        v.z = v.z + p.z;

        t1 = cx * v.ny + sx * v.nz;
        t2 = -sx * v.ny + cx * v.nz;
        v.ny = t1;
        v.nz = t2;

        t1 = cy * v.nx + sy * v.nz;
        t2 = -sy * v.nx + cy * v.nz;
        v.nx = t1;
        v.nz = t2;

        t1 = cz * v.nx + sz * v.ny;
        t2 = -sz * v.nx + cz * v.ny;
        v.nx = t1;
        v.ny = t2;
    }

    return function transformVertices(vertices, model) {
        o = model.origin;
        p = model.pos;
        r = model.rotate;
        s = model.scale;

        cx = Math.cos(r.x);
        sx = Math.sin(r.x);

        cy = Math.cos(r.y);
        sy = Math.sin(r.y);

        cz = Math.cos(r.z);
        sz = Math.sin(r.z);

        vertices.map(transformVertex);
    }
}

function createProjector() {
    const scale = canvas.height / 80;
    const w = canvas.width / 2;
    const h = canvas.height / 2;
    let p, f;

    function projectVertex(vertex) {
        vertex.x = vertex.x - p.x;
        vertex.y = vertex.y - p.y;
        vertex.z = vertex.z - p.z;

        vertex.x /= (vertex.z + f) * (1 / f);
        vertex.y /= (vertex.z + f) * (1 / f);

        vertex.x *= scale;
        vertex.y *= scale;

        vertex.x += w;
        vertex.y += h;
    }

    return function projectVertices(vertices, camera) {
        p = camera.pos;
        f = camera.fov;
        vertices.map(projectVertex);
    }
}



const canvas = document.querySelector('canvas');
const renderer = new Renderer(canvas);

const model = createModel(modelData);
const camera = new Camera({y: 20, z: -20});

function loop() {
    render();
    requestAnimationFrame(loop);
}

function render() {
    renderer.clear();
    renderer.render(model, camera);
}

loop();
