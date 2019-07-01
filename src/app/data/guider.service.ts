import {Vertex} from "./vertex";
import {obj} from "./data";

export class GuiderService{

    vertices: Vertex[];

    constructor() {
        this.parse(obj);
    }

    parse(obj: any) {
        this.vertices = [];
        for (let i = 0; i < obj.points.length; i++) {
            let p = obj.points[i];
            this.vertices.push(new Vertex(p[0], p[1], p[2], obj.tags[i].trim()));
        }

        for (let a of obj.edges) {
            let v1 = this.vertices.find(p => p.x == a[0] && p.y == a[1] && p.z == a[2]);
            let v2 = this.vertices.find(p => p.x == a[3] && p.y == a[4] && p.z == a[5]);
            v1.adjacent.push(v2);
            v2.adjacent.push(v1);
        }

    }

    getAllTags(): string[] {
        let ts = this.vertices.map(v => v.tags)
            .filter(t => t != "L" && t != "" && t != null )
            .map(t => t.split(',')
                .map(x => x.trim())
                .filter(x => x != ""))
            .reduce((a, s) => a.concat(s), [])
            .sort();
        return ts;
    }

    vertexByTag(tag: string):Vertex  {
        let f = (ts: string, t: string) => (',' + ts + ',').indexOf(',' + t + ',') != -1;
        return this.vertices.find(v => f(v.tags, tag));
    }

    // stab
    getPath(fromTag: string, toTag: string): Vertex[] {
        let v1 = this.vertexByTag(fromTag);
        let v2 = v1.adjacent[0];
        return [v1, v2 ];
    }
    //




}