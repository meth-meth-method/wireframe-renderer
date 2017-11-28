export class Vector {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    copy(vertex) {
        this.x = vertex.x;
        this.y = vertex.y;
        this.z = vertex.z;
    }
}
