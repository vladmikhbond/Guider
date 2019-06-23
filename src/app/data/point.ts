export class Point
{
    x: number;
    y: number;
    z: number;
    tags: string[];

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z | 0;
    }

    get id(): number {
       return this.z * 1000000 + (this.x | 0) * 1000 + (this.y | 0);
    }

}