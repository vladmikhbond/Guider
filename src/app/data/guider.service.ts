import {Vertex} from "./vertex";
import {data} from "./data";

const INF = Number.MAX_SAFE_INTEGER;

export class GuiderService{

    vertices: Vertex[];

    constructor() {
        this.parse(data);
    }

    parse(data: any) {
        this.vertices = [];
        // points -> this.vertices
        for (let i = 0; i < data.points.length; i++) {
            let p = data.points[i];
            this.vertices.push(new Vertex(p[0], p[1], p[2], data.tags[i].trim()));
        }
        // edges -> vertex.adjacent
        for (let arr of data.edges) {
            let v1 = this.vertices.find(p => p.x == arr[0] && p.y == arr[1] && p.z == arr[2]);
            let v2 = this.vertices.find(p => p.x == arr[3] && p.y == arr[4] && p.z == arr[5]);
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

    private vertexByTag(tag: string):Vertex  {
        let test = (ts: string, t: string) => (',' + ts + ',').indexOf(',' + t + ',') != -1;
        return this.vertices.find(v => test(v.tags, tag));
    }

    //
    getPath(fromTag: string, toTag: string): Vertex[] {
        let start = this.vertexByTag(fromTag);
        let finish = this.vertexByTag(toTag);
        // init all vertices
        this.vertices.forEach(v => {
           v.isStable = false;
           v.dist = INF;
           v.prev = null;
        });

        this.findPath(start, finish);
        if (finish.prev != null)
            return this.restorePath(start, finish);

        // no path found
        return null;
    }

    private restorePath(start: Vertex, finish: Vertex): Vertex[] {
        let path: Vertex[] = [finish];
        let v1 = finish;
        for (let v2 = finish.prev; v2 != start; v1 = v2, v2 = v2.prev) {
            if (!this.collinear3(v1))
            path.push(v2);
        }
        path.push(start);
        path.reverse();
        return path;
    }


    // true - if given vertex and its 2 previous ones lie on a straight line
    //
    private collinear3(a: Vertex): boolean {
        if (a.prev.prev == null)
            return false;
        let b = a.prev;
        let c = b.prev;
        let ex = a.x == b.x && b.x == c.x;
        let ey = a.y == b.y && b.y == c.y;
        let ez = a.z == b.z && b.z == c.z;
        return ex && ey || ex && ez || ey && ez;
    }


    // Path is not found if finish.prev == null
    //
    findPath(start: Vertex, finish: Vertex): void {
        // do start vertex the first stable
        let stable = start;
        stable.dist = 0;
        stable.isStable = true;

        // dijkstra iteration
        let tempSet = [];
        while(stable != finish) {
            // process stable's adjacent and move any of them to tempSet
            for(let v of stable.adjacent.filter(v => !v.isStable)) {
                let distToStable = stable.dist + stable.distTo(v);
                if (v.dist > distToStable) {
                    v.dist = distToStable;
                    v.prev = stable;
                }
                if (tempSet.indexOf(v) == -1) {
                    tempSet.push(v);
                }
            }

            // no path exists
            if (tempSet.length == 0)
                return;

            // find next stable vertex in the tempSet
            let minDist = Math.min(...tempSet.map(v => v.dist));
            let idx = tempSet.findIndex(v => v.dist == minDist);

            // A new stable founded
            stable = tempSet[idx];
            stable.isStable = true;
            tempSet.splice(idx, 1);
        }
    }



}