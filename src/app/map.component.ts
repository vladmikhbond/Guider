import {Component} from '@angular/core';
import {Vertex} from './data/vertex';

const DASH_HEIGHT = 50;
const SCALE_FACTOR = 1.2;
const AUTOSCROLL_PADDING = 30;
const PATH_COLOR = 'yellow';
const STEP_COLOR = 'red';


@Component({
    selector: 'map',
    styles: [`
        canvas {
        }

        #scrollBox {
            width: 100%;
            min-width: 320px;
            overflow: auto;
            border: thin solid lightblue;
        }
    `],
    template: `
        <div id="scrollBox" >
            <canvas id="canvas"></canvas>
        </div>
        
        <img id="floor1" [src]="'assets/floors/1.svg'" hidden alt="floor1"  (load)="init()" />
        <img id="floor2" [src]="'assets/floors/2.svg'" hidden alt="floor2"/>
        <img id="floor3" [src]="'assets/floors/3.svg'" hidden alt="floor3"/>
        <img id="floor4" [src]="'assets/floors/4.svg'" hidden alt="floor4"/>
        <img id="floor5" [src]="'assets/floors/5.svg'" hidden alt="floor5"/>
        <img id="floor6" [src]="'assets/floors/6.svg'" hidden alt="floor6"/>

    `
})
export class MapComponent {

    bgImages: HTMLImageElement[];
    scrollBox: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    stepIdx: number;

    // back fields for props
    private scale = 1;
    private pathFld: Vertex[] = [];

    private floorIdx: number = 0;

    // for touch event handlers
    private xt: number;
    private yt: number;


    init() {
        // fill array of images
        this.bgImages = [];
        for (let i = 1; i <= 6; i++ ) {
            let im = <HTMLImageElement>document.getElementById("floor" + i);
            this.bgImages.push(im);
        }

        // scrollBox size
        this.scrollBox = document.getElementById("scrollBox");
        this.scrollBox.style.height = `${innerHeight - DASH_HEIGHT - 2}px`;

        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        // touch event handlers
        this.canvas.addEventListener("touchstart",  e => this.handleStart(e), false);
        this.canvas.addEventListener("touchmove", e => this.handleMove(e), false);

        this.redraw();
    }

    // ============================ Drawing =====================================
    private redraw() {
        let img = this.currentFloorImage;
        // scale canvas
        this.canvas.width = img.width * this.scale;
        this.canvas.height = img.height * this.scale;
        this.ctx = this.canvas.getContext("2d");

        // draw image
        this.ctx.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, this.canvas.width, this.canvas.height);

        // may be draw path
        if (this.path.length)
            this.drawPath();
    }

    private drawPath() {
        const k = this.scale;
        const path = this.path;

        this.ctx.strokeStyle = PATH_COLOR;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(path[0].x * k, path[0].y * k);
        for (let i = 1; i < path.length; i++) {
            this.ctx.lineTo(path[i].x * k, path[i].y * k);
        }
        this.ctx.stroke();

        if (this.stepIdx == -1)
            return;

    }

    private drawStep() {
        const k = this.scale;
        const path = this.path;
        const i = this.stepIdx;
        const ctx = this.ctx;
        ctx.strokeStyle = STEP_COLOR;
        ctx.lineCap = "round";
        const up_down = path[i+1].z - path[i].z;
        const me = this;

        if (up_down) {
            ladderAnime(path[i].x * k, path[i].y * k);
        } else {
            lineAnime(path[i].x * k, path[i].y * k, path[i + 1].x * k, path[i + 1].y * k);
        }

        // externals: ctx, k, up_down, me
        function ladderAnime(x: number, y: number) {
            ctx.fillStyle = PATH_COLOR;
            const N = 3, w = 15, h = 3, d = 5;
            let i = 0;
            const t = setInterval(function() {
                ctx.fillRect(x - w / 2, y - d - i * d * up_down, w, h);
                if (i == N) {
                    clearInterval(t);
                    me.redraw();
                }
                i++;
            }, 300);

        }

        // external: ctx
        function lineAnime(x1: number, y1: number, x2: number, y2: number) {
            ctx.lineWidth = 6;
            const N = 3;
            const dx = (x2 - x1) / N;
            const dy = (y2 - y1) / N;
            let x = x1;
            let y = y1;

            const t = setInterval(function() {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + dx, y + dy);
                ctx.stroke();
                x += dx;
                y += dy;
                if (Math.hypot(x2 - x, y2 - y) < 2)
                    clearInterval(t);
                // if step is last
                if (i == path.length - 2)
                    setTimeout(drawGoal, 300);
            }, 50);
        }

        // externals: i, path, ctx, k, up_down
        function drawGoal() {
            let target = path[i + 1];
            circle(12, PATH_COLOR);
            circle(9, STEP_COLOR);
            circle(6, PATH_COLOR);
            circle(3, STEP_COLOR);

            function circle(r: number, color: string) {
                ctx.beginPath();
                ctx.arc(target.x * k, target.y * k, r, 0, Math.PI * 2, true);
                ctx.fillStyle = color;
                ctx.fill();
            }
        }

    }

    // ============================ Drawing =====================================

    set path(arr: Vertex[]) {
        this.pathFld = arr;
        this.stepIdx = 0;
        this.floorIdx = this.pathFld[0].z;
        this.redraw();
        this.autoscroll(this.pathFld[0])
    }

    get path() {
        return this.pathFld;
    }

    get currentFloorImage() {
        return this.bgImages[this.floorIdx];
    }

    // ============================ Button Click Handlers ==============================

    handleStart(evt: TouchEvent) {
        evt.preventDefault();
        if (evt.touches.length == 1) {
            this.xt = evt.touches[0].clientX;
            this.yt = evt.touches[0].clientY;
        }  else if (evt.touches.length > 1) {
            this.xt = Math.abs(evt.touches[0].clientX - evt.touches[1].clientX);
            this.yt = Math.abs(evt.touches[0].clientY - evt.touches[1].clientY);
        }
    }

    handleMove(evt: TouchEvent) {
        evt.preventDefault();
        let xt: number;
        let yt: number;
        if (evt.touches.length == 1) {
            xt = evt.touches[0].clientX;
            yt = evt.touches[0].clientY;
            this.scrollBox.scrollLeft += this.xt - xt;
            this.scrollBox.scrollTop += this.yt - yt;
        } else if (evt.touches.length > 1) {
            xt = Math.abs(evt.touches[0].clientX - evt.touches[1].clientX);
            yt = Math.abs(evt.touches[0].clientY - evt.touches[1].clientY);
            let k = this.xt < xt || this.yt < yt ? SCALE_FACTOR : 1 / SCALE_FACTOR;
            this.changeScale(k);
        }
        this.xt = xt;
        this.yt = yt;
    }

    step() {
        if (this.stepIdx == this.path.length - 1) {
            this.stepIdx = 0;
            this.floorIdx = this.path[this.stepIdx + 1].z;
            this.redraw();
        } else {
            // show floor image
            this.floorIdx = this.path[this.stepIdx + 1].z;
            this.drawStep();
            this.stepIdx++;
        }

        // autoscroll
        let target = this.path[this.stepIdx];
        this.autoscroll(target);
    }

    changeScale(k: number) {
        // center is a fixed point
        const box = this.scrollBox;
        const w = box.clientWidth / 2;
        const h = (box.clientHeight) / 2;
        box.scrollLeft = (box.scrollLeft + w) * k - w;
        box.scrollTop = (box.scrollTop + h) * k - h;

        this.scale *= k;
        this.redraw();
    }

    autoscroll(target: Vertex) {
        const k = this.scale;
        const box = this.scrollBox;
        // to right
        if ( target.x * k > box.scrollLeft + box.clientWidth) {
            let d = target.x * k - (box.scrollLeft + box.clientWidth);
            box.scrollLeft += d + AUTOSCROLL_PADDING;
        }
        // to left
        if ( target.x * k < box.scrollLeft) {
            let d = box.scrollLeft - target.x * k;
            box.scrollLeft -= d + AUTOSCROLL_PADDING;
        }
        // to down
        if ( target.y * k > box.scrollTop + box.clientHeight) {
            let d = target.y * k - (box.scrollTop + box.clientHeight);
            box.scrollTop += d + AUTOSCROLL_PADDING;
        }

        // to down
        if ( target.y * k > box.scrollTop + box.clientHeight) {
            let d = target.y * k - (box.scrollTop + box.clientHeight);
            box.scrollTop += d + AUTOSCROLL_PADDING;
        }
        // to up
        if ( target.y * k < box.scrollTop) {
            let d = box.scrollTop - target.y * k;
            box.scrollTop -= d + AUTOSCROLL_PADDING;
        }

    }

}
