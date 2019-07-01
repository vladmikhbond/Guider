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
        <div id="scrollBox" (scroll)="onScroll($event)">
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
    scaleFld = 1;
    pathFld: Vertex[] = [];
    floorNo: number = 1;

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

    redraw() {
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


    onScroll(e: Event) {
        let scrollY = (<HTMLElement>e.target).scrollTop | 0;
        let scrollX = (<HTMLElement>e.target).scrollLeft | 0;
        console.log(scrollX, scrollY);
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
        this.drawPath();
    }

    get currentFloor() {
        return this.bgImages[this.floorNo - 1];
    }

    doStep(x: string) {
        this.drawPath();
        alert(x);
    }

    private drawPath() {
        const k = this.scaleFld;

        if (this.pathFld.length !== 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.pathFld[0].x * k, this.pathFld[0].y * k);
            for (let i = 1; i < this.pathFld.length; i++) {
                this.ctx.lineTo(this.pathFld[i].x * k, this.pathFld[i].y * k);
            }
            this.ctx.stroke();
        }
    }


}
