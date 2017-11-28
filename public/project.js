function offset(vertex, offset) {
    vertex.x -= offset.x;
    vertex.y -= offset.y;
    vertex.z -= offset.z;
}

function perspective(vertex, fov) {
    vertex.x /= (vertex.z + fov) * (1 / fov);
    vertex.y /= (vertex.z + fov) * (1 / fov);
}

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

    perspective(vertex, camera.fov);

    zoom(vertex, ((canvas.width + canvas.height) / 2) / camera.zoom);

    center(vertex, canvas);
}
