//import {contains} from 'underscore';
import {Point} from "./point";

export class EditorService {

    points: Point[] = [];

    private indexOfPoint(point: Point) {
        let ps = this.points;
        return ps.findIndex(p => p.x === point.x && p.y === point.y && p.z === point.z);
    }

    // all places of points must be unique
    addPoint(newPoint: Point) {
        let idx = this.indexOfPoint(newPoint);
        if (idx === -1)
          this.points.push(newPoint);
    }

}
