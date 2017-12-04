import {createMesh, Mesh} from '../mesh.js';

describe('Mesh', () => {
    describe('#createMesh', () => {
        it('creates a mesh object from array', () => {
            const mesh = createMesh([
                [
                    [1, 2, 3],
                    [3, 4, 5],
                ],
                [
                    [9, 8, 7],
                ],
            ]);

            expect(mesh.polygons[0][0]).toEqual({x: 1, y: 2, z: 3});
            expect(mesh.polygons[0][1]).toEqual({x: 3, y: 4, z: 5});
            expect(mesh.polygons[1][0]).toEqual({x: 9, y: 8, z: 7});
        });
    });

    describe('#transform', () => {
        it('creates a clone of mesh with transformed points', () => {
            const mesh = new createMesh([
                [
                    [5, 7, 13],
                ]
            ]);

            mesh.position.x = 20;
            mesh.position.y = 10;
            expect(mesh.transform().polygons[0][0])
                .toEqual({x: 25, y: 17, z: 13});

            mesh.position.x = -30;
            mesh.position.y = 20;
            expect(mesh.transform().polygons[0][0])
                .toEqual({x: -25, y: 27, z: 13});

            mesh.rotation.y = 5;
            expect(mesh.transform().polygons[0][0])
                .toEqual({x: -41.04770464330467, y: 27, z: 8.482229784337633});
        });
    });
});
