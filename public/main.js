const square = [
    [-50, -50],
    [ 50, -50],
    [ 50,  50],
    [-50,  50]
];

function toPoint([x, y]) {
    return {x, y};
}

function toCenter(point, canvas) {
    point.x += canvas.width / 2;
    point.y += canvas.height / 2;
}

function drawPolygon(polygon, context, color = '#fff') {
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

async function main() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    console.log(square);
    const polygon = square.map(toPoint);
    console.log(polygon);

    for (const point of polygon) {
        toCenter(point, canvas);
    }

    drawPolygon(polygon, context);
}

main();
