function drawPolygon(polygon, context, color = '#fff') {
    const first = polygon[0];

    context.strokeStyle = color;
    context.beginPath();
    context.moveTo(first.x, first.y);
    polygon.forEach((vert, index) => {
        context.lineTo(vert.x, vert.y);
    });
    context.lineTo(first.x, first.y);
    context.stroke();
}

const perspective = (v, c) => {
    const distance = Math.abs(v.z - c.z);
    //const magnitude = (v.z + fov) * (2 / fov);
    //v.x = v.x * (focalLength / v.z);
    //v.y = v.y * (focalLength / v.z);
    v.x = distance * (v.x - c.x) / (v.z + distance) + c.x;
    v.y = distance * (v.y - c.y) / (v.z + distance) + c.y;
};

const center = (v, canvas) => {
    v.x += canvas.width / 2;
    v.y += canvas.height / 2;
};

const zoom = (v, factor) => {
    v.x *= factor;
    v.y *= factor;
}


async function main() {
    const camera = {
        fov: 30,
        pos: {x: 0, y: 0, z: 200},
    };

    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const mesh = await fetch('./model/cube.json')
        .then(respons => respons.json())
        .then(mesh => {
            return mesh.map(poly => {
                return poly.map(([x, y, z]) => ({x, y, z}));
            });
        });

    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const polygon of mesh) {
            const transformedPolygon = polygon.map(vertIn => {
                const vertex = {...vertIn};
                perspective(vertex, camera.pos);
                //zoom(vertex, 1);
                center(vertex, canvas);
                return vertex;
            });
            console.log(transformedPolygon);
            drawPolygon(transformedPolygon, context, '#fff');
        }

    }

    draw();
}

main();
