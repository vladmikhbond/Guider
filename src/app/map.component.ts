import {Component, OnInit} from '@angular/core';
import {Vertex} from './data/vertex';

const DASH_HEIGHT = 50;
const SCALE_FACTOR = 1.2;

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
        `
})
export class MapComponent implements OnInit {

    bgImages: HTMLImageElement[];
    scrollBox: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // back fields for props
    private scaleFld = 1;
    private pathFld: Vertex[] = [];

    private floorNo: number = 0;
    private stepIdx: number;

    ngOnInit(): void {
        this.init();
    }

    init() {
        // fill array of images
        this.bgImages = [];
        for (let i = 1; i <= 6; i++ ) {
            let im = <HTMLImageElement>document.getElementById("floor" + i);
            this.bgImages.push(im);
        }

        // scrollBox size
        this.scrollBox = document.getElementById("scrollBox");
        this.scrollBox.style.height = `${screen.height - DASH_HEIGHT - 2}px`;
        this.redraw();

        let canvas = <HTMLCanvasElement>document.getElementById("canvas");
        canvas.addEventListener("touchstart",  e => this.handleStart(e), false);
        canvas.addEventListener("touchmove", e => this.handleMove(e), false);
    }

    xt: number;
    yt: number;

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
            this.scale *= k;
        }
        this.xt = xt;
        this.yt = yt;
    }


    private redraw() {
        let img = this.currentFloor;
        // canvas size
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.canvas.width = img.width * this.scaleFld;
        this.canvas.height = img.height * this.scaleFld;

        // draw image
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, this.canvas.width, this.canvas.height);
        this.drawPath();
    }

    private drawPath() {
        const k = this.scaleFld;
        const path = this.path;

        if (path.length !== 0) {
            this.ctx.strokeStyle = "yellow";
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            this.ctx.moveTo(path[0].x * k, path[0].y * k);
            for (let i = 1; i < path.length; i++) {
                this.ctx.lineTo(path[i].x * k, path[i].y * k);
            }
            this.ctx.stroke();

            // current step
            let i = this.stepIdx;
            this.ctx.strokeStyle = "orange";
            this.ctx.lineWidth = 5;
            this.ctx.beginPath();
            if (path[i].z != path[i+1].z ) {
                // ladder
                this.ctx.ellipse(path[i].x * k, path[i].y * k, 8, 8, 0, 0, 360);
            } else {
                //
                this.ctx.moveTo(path[i].x * k, path[i].y * k);
                this.ctx.lineTo(path[i + 1].x * k, path[i + 1].y * k);
            }
            this.ctx.stroke();

        }
    }

    set scale(newScale: number) {
        const k = newScale / this.scaleFld;
        const w = screen.width / 2;
        const h = (screen.height - DASH_HEIGHT) / 2;
        this.scrollBox.scrollLeft = (this.scrollBox.scrollLeft + w) * k - w;
        this.scrollBox.scrollTop = (this.scrollBox.scrollTop + h) * k - h;

        this.scaleFld = newScale;
        this.redraw();
    }

    get scale() {
        return this.scaleFld;
    }

    set path(arr: Vertex[]) {
        this.pathFld = arr;
        this.stepIdx = 0;
        this.floorNo = this.path[1].z;
        this.redraw();
    }
    get path() {
        return this.pathFld;
    }

    get currentFloor() {
        return this.bgImages[this.floorNo];
    }


    step() {
        this.stepIdx = (this.stepIdx + 1) % (this.path.length - 1);
        this.floorNo = this.path[this.stepIdx+1].z;
        this.redraw();

    }


}
