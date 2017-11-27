import {meshControl} from './control.js';

class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Vertex extends Vector {
    clone() {
        return new Vertex(this.x, this.y, this.z);
    }

    copy(vertex) {
        this.x = vertex.x;
        this.y = vertex.y;
        this.z = vertex.z;
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

class Mesh extends Object3d
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

        this.projectVertices = createProjector(canvas);
        this.transformVertices = createTransformer();
        this.drawMesh = createWireframeDrawer(this.canvas);
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    render(mesh, camera) {
        var face, verts, i, j;
        for (i = 0; i !== mesh.faces.length; ++i) {
            face = mesh.faces[i];
            verts = face.projected;
            for (j = 0; j < 3; ++j) {
                verts[j].copy(face.vertices[j]);
            }

            this.transformVertices(verts, mesh);
            this.projectVertices(verts, camera);
        }

        this.drawMesh(mesh);
    }
}

function createMesh(spec) {
    const triangles = spec.map(triangle => {
        return new Face(triangle.map(([x, y, z]) => {
            return new Vertex(x, y, z);
        }));
    });

    return new Mesh(triangles);
}

function createWireframeDrawer(canvas) {
    const context = canvas.getContext('2d');

    return function drawMesh(mesh) {
        context.strokeStyle = '#fff';
        mesh.faces.forEach(faces => {
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
    let cosX, sinX,
        cosY, sinY,
        cosZ, sinZ;

    let t1, t2;

    let r, s, o, p;

    function transformVertex(v) {
        v.x = v.x - o.x;
        v.y = v.y - o.y;
        v.z = v.z - o.z;

        v.x = v.x * s.x;
        v.y = v.y * s.y;
        v.z = v.z * s.z;

        t1 = cosX * v.y + sinX * v.z;
        t2 = -sinX * v.y + cosX * v.z;
        v.y = t1;
        v.z = t2;

        t1 = cosY * v.x + sinY * v.z;
        t2 = -sinY * v.x + cosY * v.z;
        v.x = t1;
        v.z = t2;

        t1 = cosZ * v.x + sinZ * v.y;
        t2 = -sinZ * v.x + cosZ * v.y;
        v.x = t1;
        v.y = t2;

        v.x = v.x + p.x;
        v.y = v.y + p.y;
        v.z = v.z + p.z;
    }

    return function transformVertices(vertices, mesh) {
        o = mesh.origin;
        p = mesh.pos;
        r = mesh.rotate;
        s = mesh.scale;

        cosX = Math.cos(r.x);
        sinX = Math.sin(r.x);

        cosY = Math.cos(r.y);
        sinY = Math.sin(r.y);

        cosZ = Math.cos(r.z);
        sinZ = Math.sin(r.z);

        for (let v of vertices) {
            transformVertex(v);
        }
    }
}

function createProjector(canvas) {
    const scale = canvas.height / 80;
    const w = canvas.width / 2;
    const h = canvas.height / 2;
    let pos, fov;

    function projectVertex(vertex) {
        vertex.x = vertex.x - pos.x;
        vertex.y = vertex.y - pos.y;
        vertex.z = vertex.z - pos.z;

        vertex.x /= (vertex.z + fov) * (1 / fov);
        vertex.y /= (vertex.z + fov) * (1 / fov);

        vertex.x *= scale;
        vertex.y *= scale;

        vertex.x += w;
        vertex.y += h;
    }

    return function projectVertices(vertices, camera) {
        pos = camera.pos;
        fov = camera.fov;
        vertices.forEach(projectVertex);
    }
}

async function main() {
    const triangles = await fetch('./mesh.json').then(r => r.json());

    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const renderer = new Renderer(canvas);

    const mesh = createMesh(triangles);
    meshControl(mesh);

    const camera = new Camera();

    function loop(time) {
        mesh.rotate.y = time / 300;
        render();
        requestAnimationFrame(loop);
    }

    function render(time) {
        renderer.clear();
        renderer.render(mesh, camera);
    }

    loop();
}

main();
