export function drawPolygon(polygon, context, color = '#fff') {
    context.strokeStyle = color;

    context.beginPath();

    const first = polygon[0];
    context.moveTo(first.x, first.y);
    for (const point of polygon) {
        context.lineTo(point.x, point.y);
    }
    context.lineTo(first.x, first.y);

    context.stroke();
}
