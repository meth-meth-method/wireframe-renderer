const square = [
    [-50, -50],
    [ 50, -50],
    [ 50,  50],
    [-50,  50]
];

function toPoint([x, y]) {
    return {x, y};
}

async function main() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    console.log(square);
    const polygon = square.map(toPoint);
    console.log(polygon);
}

main();
