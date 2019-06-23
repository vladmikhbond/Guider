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

        <img id="img" [src]="imageSource" (load)="redraw()" hidden alt="floor"/>`
})
export class MapComponent {

    imageSource = "assets/floors/1.svg";

    _bgImage: HTMLImageElement;
    _scrollBox: HTMLElement;
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;

    // back fields for props
    _scale = 1;
    _path: Point[] = [];

    redraw(): void {
        this._bgImage = <HTMLImageElement>document.getElementById("img");
        // scrollBox size
        this._scrollBox = document.getElementById("scrollBox");
        this._scrollBox.style.height = `${screen.height - DASH_HEIGHT}px`;

        // canvas size
        this._canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this._canvas.width = this._bgImage.width * this._scale;
        this._canvas.height = this._bgImage.height * this._scale;

        // draw image
        this._ctx = this._canvas.getContext("2d");
        this._ctx.drawImage(this._bgImage,
            0, 0, this._bgImage.width, this._bgImage.height,
            0, 0, this._canvas.width, this._canvas.height);
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
        this._scrollBox.scrollLeft = (this._scrollBox.scrollLeft + w) * k - w;
        this._scrollBox.scrollTop = (this._scrollBox.scrollTop + h) * k - h;

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
        const k = this._scale;
        this._ctx.beginPath();
        this._ctx.moveTo(this._path[0].x * k, this._path[0].y * k);
        for (let i = 1; i < this._path.length; i ++) {
            this._ctx.lineTo(this._path[i].x * k, this._path[i].y * k);
        }
        this._ctx.stroke();
    }


}
