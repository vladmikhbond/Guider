const K = 1000;
export class Point
{
    x: number;
    y: number;
    z: number;   // floor - from 0 to 4
    tags: string[];

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.tags = []
    }

    get id(): number {

        return this.z * K * K + (this.x | 0) * K + (this.y | 0);
    }

}