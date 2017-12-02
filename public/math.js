export class Vec {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    clone() {
        return new Vec(this.x, this.y, this.z);
    }
}

export function toPoint([x, y, z]) {
    return new Vec(x, y, z);
}
