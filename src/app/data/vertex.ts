
export class Vertex
{
    // z is floor index (from 0 to 5)
    constructor(public x: number, public y: number, public z: number, public tags: string = "") {
    }

    adjacent: Vertex[] = [];
}

