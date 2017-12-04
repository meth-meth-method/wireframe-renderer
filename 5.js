var GIFEncoder = require('gifencoder');
var Canvas = require('canvas');
var {Camera, createMesh, drawMesh} = require('@pomle/micro-project');
var fs = require('fs');

var cube = [
    [
        [-50, -50, -50],
        [ 50, -50, -50],
        [ 50,  50, -50],
        [-50,  50, -50]
    ],
    [
        [-50, -50, 50],
        [ 50, -50, 50],
        [ 50,  50, 50],
        [-50,  50, 50]
    ],
    [
        [-50, -50, 50],
        [-50, -50, -50]
    ],
    [
        [50, -50, 50],
        [50, -50, -50]
    ],
    [
        [50, 50, 50],
        [50, 50, -50]
    ],
    [
        [-50, 50, 50],
        [-50, 50, -50]
    ]
];

var scene = [];
for (var i = 0; i < 10; i++) {
    scene.push(createMesh(cube));
}

var camera = new Camera();
camera.zoom = 20;

var encoder = new GIFEncoder(400, 400);

encoder.createReadStream().pipe(fs.createWriteStream('5.gif'));
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(1);
encoder.setQuality(10);
encoder.setFrameRate(30);

var canvas = new Canvas(400, 400);
var ctx = canvas.getContext('2d');

var colors = [
    '#fff',
    '#f00',
];

for(var fr=0; fr<60; fr++) {
    console.log('Rendering frame ' + fr);

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 400, 400);

    const distance = 120;

    scene.forEach((mesh, index) => {
        mesh.position.x = (index * distance + fr * 10) - 600;
        mesh.position.y = Math.sin(index + fr * .1) * 100;
        //mesh.rotation.y = (fr + index) * 0.2;
        ctx.strokeStyle = colors[index % colors.length];
        mesh.rotation.x = 0;
        mesh.rotation.y = index + fr * 0.1;
        for (var i = 0; i < 10; ++i) {
            const e = i / 10 * 255;
            ctx.strokeStyle = `rgb(255, ${e}, ${e})`;
            mesh.rotation.x += 0.05;
            mesh.rotation.y += 0.02;
            drawMesh(mesh.transform(), camera, ctx);
        }
    });

    encoder.addFrame(ctx);
}

encoder.finish();
