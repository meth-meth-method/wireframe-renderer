export function drawPolygon(polygon, context) {
    polygon.forEach(point => {
        offsetToCenter(point, context.canvas);
    });

    context.beginPath();

    const first = polygon[0];
    context.moveTo(first.x, first.y);
    for (const point of polygon) {
        context.lineTo(point.x, point.y);
    }
    context.lineTo(first.x, first.y);

    context.stroke();
}

export function drawMesh(mesh, camera, context) {
    mesh.map(polygon => {
        polygon.forEach(point => {
            mesh.transform(polygon);
            camera.project(polygon);
        });
        console.log(polygon[0]);
        drawPolygon(polygon, context);
    });
}

function offsetToCenter(point, canvas) {
    point.x += canvas.width / 2;
    point.y += canvas.height / 2;
}
