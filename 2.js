var GIFEncoder = require('gifencoder');
var Canvas = require('canvas');
var fs = require('fs');

var encoder = new GIFEncoder(400, 400);

encoder.createReadStream().pipe(fs.createWriteStream('2.gif'));
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(1);
encoder.setQuality(10);
encoder.setFrameRate(30);

var canvas = new Canvas(400, 400);
var ctx = canvas.getContext('2d');

function curve(i, j, fr) {
    var t = (fr * Math.PI / 50.0);

    t = 1.0 * Math.sin(t * 3.0 + i / 4.0)
        + 1.0 * Math.cos(t * 2.0 + j / 3.6)
        + 0.3 * Math.sin(t * 7.0 + j / 6.0)
        + 0.3 * Math.cos(t * 6.0 + i / 6.3)
        + 0.3 * Math.sin(t * 5.0 + i / 8.0)
        + 0.3 * Math.cos(t * 4.0 + j / 8.3)
        + t
        + j / 14.0
        + i / 15.0
        ;

    var s = 3.0 + 2.0 * Math.sin(t * 3.0);

    return s;
}

for(var fr=0; fr<100; fr++) {
    console.log('Rendering frame ' + fr);

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#B2210E';
    ctx.fillRect(0, 0, 400, 400);

    for(var j=0; j<40; j++) {
        for(var i=0; i<40; i++) {


            var t = curve(i, j, fr);
            var t2 = curve(i - 1, j - 1, fr);
            var t3 = curve(i + 1, j + 1, fr);

            if (t2 < t3)
                ctx.fillStyle = '#fff';
            else
                ctx.fillStyle = '#ddd';

            // ctx.globalAlpha = 1.0 - (d / 130.0);

            var x = i * 10 + 5;
            var y = j * 10 + 5;
            var w = t; // 4 * Math.sin(t * 1);
            var h = t; // 4 * Math.cos(t * 2);

            ctx.fillRect(x - w, y - h, w * 2, h * 2);
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
