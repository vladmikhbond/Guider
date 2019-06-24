import {Point} from "./point";

export class GuiderService{


    //
    getPath(fromTag: string, toTag: string): Point[] {
        return [new Point(1, 1, 0), new Point(100, 1, 0),
            new Point(100, 100, 0), new Point(200, 100, 0), ];
    }
    //
    getTags(): string[] {
        let res: string[] = [];
        for (let i = 100; i < 555; i++)
            res.push(i.toString());
        return res;
    }




}