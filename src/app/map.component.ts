import {Component} from '@angular/core';
import {Point} from './data/point';

const DASH_HEIGHT = 50;

@Component({
    selector: 'map',
    styles: [`
        canvas {
            border: 1px lightgray solid;
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
    _scale = 1;
    _path: Point[] = [];
    floor: number = 1;

    redraw(): void {
        //
        this.bgImages = [null];
        for (let i = 1; i < 6; i++ ) {
            let img = <HTMLImageElement>document.getElementById("floor" + i);
            this.bgImages.push(img);
        }

        // scrollBox size
        this.scrollBox = document.getElementById("scrollBox");
        this.scrollBox.style.height = `${screen.height - DASH_HEIGHT}px`;

        let img = this.bgImages[this.floor];
        // canvas size
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.canvas.width = img.width * this._scale;
        this.canvas.height = img.height * this._scale;

        // draw image
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, this.canvas.width, this.canvas.height);
        this.drawPath();
    }


    onScroll(e: Event) {
        let scrollY = (<any>e.target).scrollTop | 0;
        let scrollX = (<any>e.target).scrollLeft | 0;
    }


    set scale(newScale: number) {

        const k = newScale / this._scale;
        const w = screen.width / 2;
        const h = (screen.height - DASH_HEIGHT) / 2;
        this.scrollBox.scrollLeft = (this.scrollBox.scrollLeft + w) * k - w;
        this.scrollBox.scrollTop = (this.scrollBox.scrollTop + h) * k - h;

        this._scale = newScale;
        this.redraw();
    }

    get scale() {
        return this._scale;
    }

    set path(arr: Point[]) {
        this._path = arr;
        this.drawPath();
    }

    doStep(x: string) {
        this.drawPath();
        alert(x);
    }

    private drawPath() {
        if (this._path.length === 0)
            return;
        const k = this._scale;
        this.ctx.beginPath();
        this.ctx.moveTo(this._path[0].x * k, this._path[0].y * k);
        for (let i = 1; i < this._path.length; i ++) {
            this.ctx.lineTo(this._path[i].x * k, this._path[i].y * k);
        }
        this.ctx.stroke();
    }


}
