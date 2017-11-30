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

function rotate(vertex, rotation) {
    const sin = {x: 0, y: 0, z: 0};
    const cos = {x: 0, y: 0, z: 0};

    cos.x = Math.cos(rotation.x);
    sin.x = Math.sin(rotation.x);

    cos.y = Math.cos(rotation.y);
    sin.y = Math.sin(rotation.y);

    cos.z = Math.cos(rotation.z);
    sin.z = Math.sin(rotation.z);

    let temp1, temp2;

    temp1 = cos.x * vertex.y + sin.x * vertex.z;
    temp2 = -sin.x * vertex.y + cos.x * vertex.z;
    vertex.y = temp1;
    vertex.z = temp2;

    temp1 = cos.y * vertex.x + sin.y * vertex.z;
    temp2 = -sin.y * vertex.x + cos.y * vertex.z;
    vertex.x = temp1;
    vertex.z = temp2;

    temp1 = cos.z * vertex.x + sin.z * vertex.y;
    temp2 = -sin.z * vertex.x + cos.z * vertex.y;
    vertex.x = temp1;
    vertex.y = temp2;
}

const perspective = ({x, y, z}, fov) => ({
    x: x / (z + fov) * (1 / fov),
    y: y / (z + fov) * (1 / fov),
});

const center = ({x, y}, canvas) => ({
    x: x + canvas.width / 2,
    y: y + canvas.height / 2,
});


async function main() {
    const camera = {
        fov: 30,
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
            const transformedPolygon = polygon.map(vertex => {
                rotate(vertex, {x: 1, y: 0, z: 0});
                vertex = perspective(vertex, 0.2);
                return center(vertex, canvas);
            });
            console.log(transformedPolygon);
            drawPolygon(transformedPolygon, context, '#fff');
        }

    }

    draw();
}

main();
