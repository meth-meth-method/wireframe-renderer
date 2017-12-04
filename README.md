# Micro Project

### A tiny 3D transform and projecting library.

If you have points in 3D space this library can rotate, scale and project them thru a camera.

## Example

[Live Example](https://codesandbox.io/s/l9yn87q54z)

```js
import {createMesh, Camera, drawMesh} from '@pomle/micro-project';

const canvas = document.getElementById('my-canvas');
const context = canvas.getContext('2d');

const pyramid = [
  [
    [50, 0, 50],
    [0, -50, 0],
    [-50, 0, 50],
  ],
  [
    [50, 0, -50],
    [0, -50, 0],
    [50, 0, 50],
  ],
  [
    [50, 0, -50],
    [0, -50, 0],
    [-50, 0, -50],
  ],
  [
    [-50, 0, 50],
    [0, -50, 0],
    [-50, 0, -50],
  ],
];

const mesh = createMesh(pyramid);

const camera = new Camera();
camera.pos.z = 200;
camera.zoom = 18;

mesh.rotation.x = 0.1;

context.fillStyle = '#000';
context.strokeStyle = '#fff';
function update(time) {
  context.fillRect(0, 0, 400, 400);

  mesh.position.y = (Math.sin(time / 3000) * 30) + 15;
  mesh.position.z = Math.sin(time / 1000) * 100;

  mesh.rotation.y = time / 600;
  drawMesh(mesh, camera, context);
  requestAnimationFrame(update);
}

update();
```
