import {cube} from './models.js';
import {control} from './ui.js';
import {drawPolygon} from './draw.js';
import {Vec, toPoint} from './math.js';

class Mesh {
    constructor(polygons) {
        this.polygons = polygons;

        this.scale = new Vec(1, 1, 1);
        this.rotation = new Vec(0, 0, 0);
    }

    *[Symbol.iterator]() {
        for (const polygon of this.polygons) {
            yield polygon;
        }
    }

    transform(point) {
        rotate(point, this.rotation);
        rescale(point, this.scale);
    }
}

function rotate(point, rotation) {
    const sin = new Vec();
    const cos = new Vec();

    cos.x = Math.cos(rotation.x);
    sin.x = Math.sin(rotation.x);

    cos.y = Math.cos(rotation.y);
    sin.y = Math.sin(rotation.y);

    cos.z = Math.cos(rotation.z);
    sin.z = Math.sin(rotation.z);

    let temp1, temp2;

    temp1 = cos.x * point.y + sin.x * point.z;
    temp2 = -sin.x * point.y + cos.x * point.z;
    point.y = temp1;
    point.z = temp2;

    temp1 = cos.y * point.x + sin.y * point.z;
    temp2 = -sin.y * point.x + cos.y * point.z;
    point.x = temp1;
    point.z = temp2;

    temp1 = cos.z * point.x + sin.z * point.y;
    temp2 = -sin.z * point.x + cos.z * point.y;
    point.x = temp1;
    point.y = temp2;
}

function rescale(point, scale) {
    point.x *= scale.x;
    point.y *= scale.y;
    point.z *= scale.z;
}


function toCenter(point, canvas) {
    point.x += canvas.width / 2;
    point.y += canvas.height / 2;
}

function perspective(point, camera) {
    const fov = point.z + (point.z - camera.pos.z);
    point.x /= fov;
    point.y /= fov;

    const zoom = Math.pow(camera.zoom, 2);
    point.x *= zoom;
    point.y *= zoom;
}

function offset(vertex, pos) {
    vertex.x -= pos.x;
    vertex.y -= pos.y;
    vertex.z -= pos.z;
}

async function main() {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    const mesh = new Mesh(cube.map(square => {
        const polygon = square.map(toPoint);
        return polygon;
    }));


    const camera = {
        pos: new Vec(0, 0, -500),
        zoom: 25,
    };


    function draw() {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const polygon of mesh) {
            const projectedPolygon = polygon
                .map(point => point.clone())
                .map(point => {
                    mesh.transform(point);

                    offset(point, camera.pos);
                    perspective(point, camera);
                    toCenter(point, canvas);
                    return point;
                });

            drawPolygon(projectedPolygon, context);
        }
    }

    function animate(time) {
        camera.pos.x = Math.sin(time / 300) * 100;
        draw();
        requestAnimationFrame(animate);
    }

    animate();

    control({camera, mesh});
}

main();
