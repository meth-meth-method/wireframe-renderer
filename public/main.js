const square = [
    [-50, -50],
    [ 50, -50],
    [ 50,  50],
    [-50,  50]
];

function toVector(values) {
    return {
        x: values[0],
        y: values[1],
    };
}

async function main() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    console.log(square);
    const polygon = square.map(toVector);
    console.log(polygon);
}

main();
