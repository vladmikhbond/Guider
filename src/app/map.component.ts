import {Component} from '@angular/core';
import {Vertex} from './data/vertex';

const DASH_HEIGHT = 50;

@Component({
    selector: 'map',
    styles: [`
        canvas {
        }

        #scrollBox {
            width: 100%;
            min-width: 320px;
            overflow: auto;
        }
    `],
    template: `
        <div id="scrollBox" >
            <canvas id="canvas"></canvas>
        </div>
        `
})
export class MapComponent {

    bgImages: HTMLImageElement[];
    scrollBox: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // back fields for props
    private scaleFld = 1;
    private pathFld: Vertex[] = [];

    private floorNo: number = 0;
    private stepIdx: number;

    init() {
        // fill array of images
        this.bgImages = [];
        for (let i = 1; i <= 6; i++ ) {
            let im = <HTMLImageElement>document.getElementById("floor" + i);
            this.bgImages.push(im);
        }

        // scrollBox size
        this.scrollBox = document.getElementById("scrollBox");
        this.scrollBox.style.height = `${screen.height - DASH_HEIGHT}px`;
        this.redraw();
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

        if (this.pathFld.length !== 0) {
            this.ctx.lineWidth = 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(this.pathFld[0].x * k, this.pathFld[0].y * k);
            for (let i = 1; i < this.pathFld.length; i++) {
                this.ctx.lineTo(this.pathFld[i].x * k, this.pathFld[i].y * k);
            }
            this.ctx.stroke();

            // current step
            let i = this.stepIdx;
            this.ctx.lineWidth = 1.5;
            this.ctx.beginPath();

            this.ctx.moveTo(this.pathFld[i].x * k, this.pathFld[i].y * k);
            this.ctx.lineTo(this.pathFld[i + 1].x * k, this.pathFld[i + 1].y * k);
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
