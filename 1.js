var GIFEncoder = require('gifencoder');
var Canvas = require('canvas');
var fs = require('fs');

var encoder = new GIFEncoder(400, 400);

encoder.createReadStream().pipe(fs.createWriteStream('1.gif'));
encoder.start();
encoder.setRepeat(0);
encoder.setDelay(1);
encoder.setQuality(10);
encoder.setFrameRate(30);

var canvas = new Canvas(400, 400);
var ctx = canvas.getContext('2d');

for(var fr=0; fr<100; fr++) {
    console.log('Rendering frame ' + fr);

    ctx.globalAlpha = 1.0;
    ctx.fillStyle = '#B2210E';
    ctx.fillRect(0, 0, 400, 400);

    for(var d=120; d>=0; d-=4) {
        var t = fr * 2.0 * Math.PI / 100.0 - d / 43.0;
        var r = 9 - ((d * 2) / 20);
        var w = 12 + r * Math.sin(t * 8);
        var h = 12 + r * Math.cos(t * 9);
        var r2 = 40 * Math.sin(t * 2 - d / 30.0 - fr * Math.PI * 8.0);
        var x = 200 + (80 + r2) * Math.cos(t * 3);
        var y = 200 + (80 + r2) * Math.sin(t * 2);

        if (d == 0) ctx.fillStyle = '#FAFBF7';
        else if (d % 5 === 0) ctx.fillStyle = '#fBf877';
        else ctx.fillStyle = '#4EDE6F';

        ctx.globalAlpha = 1.0 - (d / 130.0);
        ctx.fillRect(x - w, y - h, w * 2, h * 2);
    }

    encoder.addFrame(ctx);
}

encoder.finish();
