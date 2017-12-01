function offset(vertex, offset) {
    vertex.x -= offset.x;
    vertex.y -= offset.y;
    vertex.z -= offset.z;
}

function _perspective(vertex, fov) {
    vertex.x /= (vertex.z + fov) * (1 / fov);
    vertex.y /= (vertex.z + fov) * (1 / fov);
}

const perspective = (v, c) => {
    const distance = Math.max(0, c.z - v.z);
    //const magnitude = (v.z + fov) * (2 / fov);
    //v.x = v.x * (focalLength / v.z);
    //v.y = v.y * (focalLength / v.z);
    v.x = distance * (v.x - c.x) / (v.z + distance) + c.x;
    v.y = distance * (v.y - c.y) / (v.z + distance) + c.y;
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

    perspective(vertex, camera.pos);

    zoom(vertex, 1);

    center(vertex, canvas);
}
