import {Component} from '@angular/core';
import {Vertex} from './data/vertex';

const DASH_HEIGHT = 50;
const SCALE_FACTOR = 1.2;
const AUTOSCROLL_PADDING = 30;

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

        this.ctx.strokeStyle = "yellow";
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
        this.ctx.strokeStyle = "red";
        this.ctx.lineCap = "round";
        const up_down = path[i+1].z - path[i].z;

        if (up_down) {
            ladderAnime(path[i].x * k, path[i].y * k, () => this.redraw());
        } else {



            lineAnime(path[i].x * k, path[i].y * k, path[i + 1].x * k, path[i + 1].y * k);
        }

        // external vars: ctx, k, up_down
        function ladderAnime(x: number, y: number, callback: any) {
            ctx.lineWidth = 4;
            const d = 5 * k;
            const N = 11;
            let i = 0;
            const t = setInterval(function() {
                ctx.beginPath();
                ctx.moveTo(x, y);
                if (i % 2)
                    x += i <= N / 2 ? d : -d;
                else
                    y -= d * Math.sign(up_down);
                ctx.lineTo(x, y);
                ctx.stroke();
                if (i == N) {
                    clearInterval(t);
                    callback();
                }
                i++;
            }, 50);

        }


        // external vars: ctx
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
                    setTimeout(drawGoal, 500);
            }, 50);
        }

        // external vars: i, path, ctx, k, up_down
        function drawGoal() {
            // if last step
            if (i == path.length - 2) {
                let target = path[i + 1];
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(target.x * k, target.y * k, 10, 0,Math.PI*2,true);
                ctx.stroke();
            }
        }

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


    set path(arr: Vertex[]) {
        this.pathFld = arr;
        this.stepIdx = -1;
        this.floorIdx = this.path[1].z;
        this.redraw();
    }
    get path() {
        return this.pathFld;
    }
    get currentFloorImage() {
        return this.bgImages[this.floorIdx];
    }


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
