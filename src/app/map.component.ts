import {Component} from '@angular/core';

const DASH_HEIGHT = 50;

@Component({
    selector: 'map',
    styles: [`
        canvas {
            border: 1px lightgray solid;
        }

        #scrollBox {
            width: 100%;
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

    _image: HTMLImageElement;
    _scrollBox: HTMLElement;
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;

    // back fields for props
    _scale = 1;
    _path: number[] = [];



    redraw(): void {
        this._image = <HTMLImageElement>document.getElementById("img");
        // scrollBox size
        this._scrollBox = document.getElementById("scrollBox");
        this._scrollBox.style.height = `${screen.height - DASH_HEIGHT}px`;

        // canvas size
        this._canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this._canvas.width = this._image.width * this._scale;
        this._canvas.height = this._image.height * this._scale;

        // draw image
        this._ctx = this._canvas.getContext("2d");
        this._ctx.drawImage(this._image,
            0, 0, this._image.width, this._image.height,
            0, 0, this._canvas.width, this._canvas.height);
        this.drawPath();
    }


    // onScroll(e: Event) {
    //     this.scrollY = (<any>e.target).scrollTop | 0;
    //     this.scrollX = (<any>e.target).scrollLeft | 0;
    // }


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

    set path(arr: number[]) {
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
        this._ctx.moveTo(this._path[0] * k, this._path[1] * k);
        for (let i = 2; i < this._path.length; i += 2) {
            this._ctx.lineTo(this._path[i] * k, this._path[i + 1] * k);
        }
        this._ctx.stroke();
    }


}
