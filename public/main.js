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

const center = ({x, y}, canvas) => ({
    x: x + canvas.width / 2,
    y: y + canvas.height /2,
});


async function main() {
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
            const transformedPolygon = polygon.map(vertex => center(vertex, canvas));
            console.log(transformedPolygon);
            drawPolygon(transformedPolygon, context, '#fff');
        }

    }

    draw();
}

main();
