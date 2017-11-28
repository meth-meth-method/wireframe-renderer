import {Vector} from './Vector.js';

export function createTransformer() {
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
