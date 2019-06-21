import {Component, Input} from '@angular/core';

@Component({
     selector: 'map',
     styles: [`         
         canvas { 
            border: 1px lightgray solid;
         }
         #info {
             height:50px;width:100%;
         }
         #scrollBox {
             width:100%;
             overflow:auto;
         }
     `],
     template: `         
         <div id="scrollBox" (scroll)="onScroll($event)">
             <canvas id="canvas"></canvas>
         </div>

         <img id="img" [src]="imageSource" (load)="init()" hidden/>`
})
export class MapComponent {

    imageSource = "assets/floors/1.svg";

    private _image: HTMLImageElement;
    private _scrollBox: HTMLElement;
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    // back fields for props
    private _scale = 1;
    private _path: number[] = [];


    init(): void {
        this._image = <HTMLImageElement>document.getElementById("img");
        // scrollBox size
        this._scrollBox = document.getElementById("scrollBox");

        this._scrollBox.style.height = `${window.screen.height - 100}px`;
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

    // scrollX = 0;
    // scrollY = 0;

    // onScroll(e: Event) {
    //     this.scrollY = (<any>e.target).scrollTop | 0;
    //     this.scrollX = (<any>e.target).scrollLeft | 0;
    // }

    @Input()
    set scale(v: number) {
       this._scale = v;
       this.init();
    }

    @Input()
    set path(arr: number[]) {
        this._path = arr;
        this.drawPath();
    }


    f(x: string) {
        alert(x);
    }

    drawPath() {
        let k = this._scale;
        this._ctx.beginPath();
        this._ctx.moveTo(this._path[0] * k , this._path[1] * k)
        for (let i = 2; i < this._path.length; i += 2)
            this._ctx.lineTo(this._path[i] * k, this._path[i+1] * k);
        this._ctx.stroke();
    }



}