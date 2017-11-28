import {meshControl} from './control.js';

class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone() {
        return new Vector(this.x, this.y, this.z);
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
        this.projected = vertices.map(_ => new Vector());
    }
}

class Object3d
{
    constructor() {
        this.pos = new Vector();
        this.origin = new Vector();
        this.rotation = new Vector();
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
        this.transformVertices(mesh);
        this.projectVertices(mesh, camera);

        this.drawMesh(mesh);
    }
}

function createMesh(spec) {
    const triangles = spec.map(triangle => {
        return new Face(triangle.map(([x, y, z]) => {
            return new Vector(x, y, z);
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
    function offset(vertex, origin) {
        vertex.x -= origin.x;
        vertex.y -= origin.y;
        vertex.z -= origin.z;
    }

    function scale(vertex, scale) {
        vertex.x *= scale.x;
        vertex.y *= scale.y;
        vertex.z *= scale.z;
    }

    function move(vertex, position) {
        vertex.x += position.x;
        vertex.y += position.y;
        vertex.z += position.z;
    }

    function rotate(vertex, rotation) {
        const sin = new Vector();
        const cos = new Vector();

        cos.x = Math.cos(rotation.x);
        sin.x = Math.sin(rotation.x);

        cos.y = Math.cos(rotation.y);
        sin.y = Math.sin(rotation.y);

        cos.z = Math.cos(rotation.z);
        sin.z = Math.sin(rotation.z);

        let t1, t2;

        t1 = cos.x * vertex.y + sin.x * vertex.z;
        t2 = -sin.x * vertex.y + cos.x * vertex.z;
        vertex.y = t1;
        vertex.z = t2;

        t1 = cos.y * vertex.x + sin.y * vertex.z;
        t2 = -sin.y * vertex.x + cos.y * vertex.z;
        vertex.x = t1;
        vertex.z = t2;

        t1 = cos.z * vertex.x + sin.z * vertex.y;
        t2 = -sin.z * vertex.x + cos.z * vertex.y;
        vertex.x = t1;
        vertex.y = t2;
    }

    return function transformVertices(mesh) {
        for (const face of mesh.faces) {
            let index = 0;
            for (const vertex of face.projected) {
                vertex.copy(face.vertices[index++]);

                offset(vertex, mesh.origin);
                scale(vertex, mesh.scale);
                rotate(vertex, mesh.rotation);
                move(vertex, mesh.pos);
            }
        }
    }
}

function createProjector(canvas) {
    const scale = canvas.height / 80;

    function offset(vertex, offset) {
        vertex.x -= offset.x;
        vertex.y -= offset.y;
        vertex.z -= offset.z;
    }

    function perspective(vertex, fov) {
        vertex.x /= (vertex.z + fov) * (1 / fov);
        vertex.y /= (vertex.z + fov) * (1 / fov);
    }

    function center(vertex, canvas) {
        vertex.x += canvas.width / 2;
        vertex.y += canvas.height / 2;
    }

    function projectVertex(vertex, camera) {
        offset(vertex, camera.pos);

        perspective(vertex, camera.fov);

        vertex.x *= scale;
        vertex.y *= scale;

        center(vertex, canvas);
    }

    return function projectVertices(mesh, camera) {
        mesh.faces.forEach(face => {
            face.projected.forEach((vertex) => {
                projectVertex(vertex, camera);
            });
        });
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
        mesh.rotation.y = time / 600;
        mesh.rotation.x = Math.sin(time / 3000) / 2;
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
