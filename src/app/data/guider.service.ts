import {Vertex} from "./vertex";
import {obj} from "./data";


const INF = Number.MAX_SAFE_INTEGER;

export class GuiderService{

    vertices: Vertex[];
    vStart: Vertex;
    vFinish: Vertex;




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
        return this.vertices.map(v => v.tags)
            .filter(t => t != "L" && t != "" && t != null)
            .map(t => t.split(',')
                .map(x => x.trim())
                .filter(x => x != ""))
            .reduce((a, s) => a.concat(s), [])
            .sort();
    }

    vertexByTag(tag: string):Vertex  {
        let f = (ts: string, t: string) => (',' + ts + ',').indexOf(',' + t + ',') != -1;
        return this.vertices.find(v => f(v.tags, tag));
    }

    //
    getPath(fromTag: string, toTag: string): Vertex[] {
        this.vStart = this.vertexByTag(fromTag);
        this.vFinish = this.vertexByTag(toTag);
        // init all vertices
        this.vertices.forEach(v => {
           v.isStable = false;
           v.dist = INF;
           v.prev = null;
        });

        // start vertex is the first stable
        let stable = this.vStart;
        stable.dist = 0;
        stable.isStable = true;
        let tempSet = [];

        // main loop
        while(true) {
            // process stable's adjacent and move any of them to tempSet
            for(let v of stable.adjacent.filter(v => !v.isStable)) {
                let distToStable = stable.dist + stable.distTo(v)
                if (v.dist > distToStable) {
                    v.dist = distToStable;
                    v.prev = stable;
                }
                if (tempSet.indexOf(v) == -1) {
                    tempSet.push(v);
                }
            }

            // find next stable vertex in the tempSet
            let minDist = Math.min(...tempSet.map(v => v.dist));
            let idx = tempSet.findIndex(v => v.dist == minDist);

            // assertion
            if (idx == -1) {
                alert("error in the graph");
                return;
            }

            // Viva a new stable!
            stable = tempSet[idx];
            stable.isStable = true;
            tempSet.splice(idx, 1);
            //
            if (stable == this.vFinish)
                break;
        }
        // reconstruct the path
        let path: Vertex[] = [];
        for (let v = this.vFinish; v != this.vStart; v = v.prev) {
            path.push(v);
        }
        path.push(this.vStart);

        return path;
    }





}