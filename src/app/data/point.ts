const K = 1000;
export class Point
{
    // floor - from 0 to 4
    tags: string[];

    constructor(public x: number, public y: number, public z: number) {
        this.tags = []
    }

    get id(): number {
        return this.z * K * K + (this.x | 0) * K + (this.y | 0);
    }

}