import {Point} from "./point";

export class GuiderService{


    //
    getPath(fromTag: string, toTag: string): Point[] {
        return [new Point(1, 1, 1), new Point(100, 1, 1),
            new Point(100, 100, 1), new Point(200, 100, 1), ];
    }
    //
    getTags(): string[] {
        let res: string[] = [];
        for (let i = 100; i < 555; i++)
            res.push(i.toString());
        return res;
    }




}