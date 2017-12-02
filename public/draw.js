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

    context.strokeStyle = '#fff';
    context.stroke();
}

function offsetToCenter(point, canvas) {
    point.x += canvas.width / 2;
    point.y += canvas.height / 2;
}
