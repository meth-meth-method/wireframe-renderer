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

            const polygons = mesh.transform();
            camera.project(polygons);

            expect(polygons[0][0]).toEqual({x: 0.6352357320099256, y: 1.2704714640198511, z: 3});
        });
    });
});
