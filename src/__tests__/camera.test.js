import {createMesh} from '../mesh.js';
import {Camera} from '../camera.js';

describe('Camera', () => {
    describe('#project', () => {
        it('projects vertices of a mesh', () => {
            const camera = new Camera();
            const mesh = createMesh([
                [
                    [1, 2, 3],
                ]
            ]);

            camera.project(mesh);

            expect(mesh.polygons[0][0]).toEqual({x: 0.6213592233009708, y: 1.2427184466019416, z: 3});
        });
    });
});
