import {drawMesh} from './draw.js';

export function createWireframeRenderer(canvas) {
    const context = canvas.getContext('2d');

    return function render(scene, camera) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        scene.forEach(mesh => {
            drawMesh(mesh, camera, context);
        });
    }
}
