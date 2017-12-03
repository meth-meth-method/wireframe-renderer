var GIFEncoder = require('gifencoder');
var Canvas = require('canvas');
var fs = require('fs');

var encoder = new GIFEncoder(400, 400);

encoder.createReadStream().pipe(fs.createWriteStream('3.gif'));
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(1);
encoder.setQuality(10);
encoder.setFrameRate(20);

var canvas = new Canvas(400, 400);
var ctx = canvas.getContext('2d');

function curve(i, j, fr) {
    var t = (fr * Math.PI / 50.0);

    t = 0
        + 1.0 * Math.sin(t * 1.0 + i / 8.0)
        + 1.0 * Math.cos(t * 1.0 + j / 7.6)
        // + 0.3 * Math.sin(t * 7.0 + j / 16.0)
        // + 0.3 * Math.cos(t * 6.0 + i / 16.3)
        // + 0.3 * Math.sin(t * 5.0 + i / 18.0)
        // + 0.3 * Math.cos(t * 4.0 + j / 18.3)
        // + t
        // + j / 1.4
        // + i / 1.3
        ;

    var s = 1.0 * Math.sin(t * 10.0);

    return s;
}

for(var fr=0; fr<100; fr++) {
    console.log('Rendering frame ' + fr);

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#B2210E';
    ctx.fillRect(0, 0, 400, 400);

    for(var j=0; j<11; j++) {
        for(var i=0; i<11; i++) {
            var x = i * 40;
            var y = j * 40;

            ctx.globalAlpha = 1.0
            ctx.fillStyle = ((i + j) % 2) == 0 ? '#ccc' : '#ddd';
            ctx.fillRect(x, y, 40, 40);

            var t = curve(i, j, fr);

            ctx.fillStyle = t > 0 ? '#fff' : '#999';

            ctx.globalAlpha = Math.abs(t); // 1.0
            //  - -(d / 130.0);

            // var w = t; // 2 * Math.sin(t * 1);
            // var h = t; // 2 * Math.cos(t * 2);

            ctx.fillRect(x-7, y-1, 14, 2);// - w, y - h, w * 2, h * 2);
            ctx.fillRect(x-1, y-7, 2, 14);// - w, y - h, w * 2, h * 2);
            // ctx.beginPath();
            // ctx.fillEllipse(x, y, 10, 3, t, 0, Math.PI * 2.0);
            // ctx.fill();
        }
    }

    // for(var d=120; d>=0; d-=4) {
    //     var t = fr * 2.0 * Math.PI / 100.0 - d / 43.0;
    //     var r = 9 - ((d * 2) / 20);
    //     var w = 12 + r * Math.sin(t * 8);
    //     var h = 12 + r * Math.cos(t * 9);
    //     var r2 = 40 * Math.sin(t * 2 - d / 30.0 - fr * Math.PI * 8.0);
    //     var x = 200 + (80 + r2) * Math.cos(t * 3);
    //     var y = 200 + (80 + r2) * Math.sin(t * 2);
    // }

    encoder.addFrame(ctx);
}

encoder.finish();
