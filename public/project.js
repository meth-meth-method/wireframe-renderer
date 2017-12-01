function offset(vertex, offset) {
    vertex.x -= offset.x;
    vertex.y -= offset.y;
    vertex.z -= offset.z;
}

function _perspective(vertex, fov) {
    vertex.x /= (vertex.z + fov) * (1 / fov);
    vertex.y /= (vertex.z + fov) * (1 / fov);
}

const perspective = (v, camera) => {
    const fov = v.z + (v.z - camera.pos.z);
    v.x /= fov;
    v.y /= fov;

};

function zoom(vertex, factor) {
    vertex.x *= factor;
    vertex.y *= factor;
}

function center(vertex, canvas) {
    vertex.x += canvas.width / 2;
    vertex.y += canvas.height / 2;
}

export function project(vertex, camera, canvas) {
    offset(vertex, camera.pos);

    perspective(vertex, camera);

    zoom(vertex, camera.zoom);

    center(vertex, canvas);
}