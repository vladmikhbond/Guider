import {Point, Edge} from "./data.types";
import {obj} from "./data";

export class GuiderService {

//////////////////////////////////////////////////////////////////////// the same as in data.service
    points: Point[];
    edges: Edge[];

    selPoint: Point = null;
    selEdge: Edge = null;


    constructor() {
        this.parse(obj);
    }

    parse(obj: any) {
        this.selPoint = this.selEdge = null;
        // create points
        this.points = [];
        for (let i = 0; i < obj.points.length; i++) {
            let p = obj.points[i];
            let tag = obj.tags[i] == null ? "" : obj.tags[i];
            this.points.push(new Point(p[0], p[1], p[2], tag));
        }

        // create edges
        this.edges = [];
        for (let a of obj.edges) {
            let p1 = this.points.find(p => p.x == a[0] && p.y == a[1] && p.z == a[2]);
            let p2 = this.points.find(p => p.x == a[3] && p.y == a[4] && p.z == a[5]);
            if (p1 && p2) {
                this.edges.push(new Edge(p1, p2));
            } else {
                console.error(`cannot create Edge`, a);
            }
        }
    }
////////////////////////////////////////////////////////////////////////////

    getAllTags(): string[] {
        let splitFunc = (tags:string) =>
            tags.split(',').map(t => t.trim()).filter(t => t != "" );

        let tagArrays = this.points
            .filter(p => p.tags && p.tags != "L")
            .map(p => splitFunc(p.tags));
        let ts = tagArrays
            .reduce((a, x) => a.concat(x), [])
            .sort();
        return ts;
    }




    //
    getPath(fromTag: string, toTag: string): Point[] {
        let e = this.edges.find(e => e.a.tags.indexOf(fromTag) > -1 || e.b.tags.indexOf(fromTag) > -1 )

        return [
            e.a, e.b,
        ];
    }




}