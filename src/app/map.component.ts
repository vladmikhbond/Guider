import {Component, HostListener, Input} from '@angular/core';

@Component({
     selector: 'map',
     styles: [`         
         canvas { 
            border: 1px lightgray solid
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
         <div id="info">
             <button (click)="scale(1.2)">+</button>
             <button (click)="scale(1/1.2)">-</button>
             <span>x0={{scrollX}} </span>
             <span> y0={{scrollY}}</span>
         </div>
         <div id="scrollBox" (scroll)="onScroll($event)">
             <canvas id="canvas"></canvas>
         </div>

         <img id="img" [src]="imageSource" (load)="init()" hidden/>`
})
export class MapComponent {

    imageSource = "assets/floors/1.svg";
    image: HTMLImageElement;
    scrollBox: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scrollX = 0;
    scrollY = 0;
    _scale = 1;
    _path: number[] = [];


    init(): void {
        this.image = <HTMLImageElement>document.getElementById("img");
        // scrollBox size
        this.scrollBox = document.getElementById("scrollBox");
        let h = window.screen.height - 100;
        this.scrollBox.style.height = `${h}px`;
        // canvas size
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.canvas.width = this.image.width;
        this.canvas.height = this.image.height;
        // draw image
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(this.image,
            0, 0, this.image.width, this.image.height,
            0, 0, this.canvas.width, this.canvas.height);
    }

    onScroll(e: Event) {
        this.scrollY = (<any>e.target).scrollTop | 0;
        this.scrollX = (<any>e.target).scrollLeft | 0;
    }

    @Input()
    set scale(flag: boolean) {
        let k: number = flag ? 1.2 : 1/1.2;
        this._scale *= k;
        this.canvas.width *= k;
        this.canvas.height *= k;
        this.ctx.drawImage(this.image,
            0, 0, this.image.width, this.image.height,
            0, 0, this.canvas.width, this.canvas.height);
    }

    // binding to setter
    @Input()
    set path(arr: number[]) {
        if(arr.length == 0)
            alert("error");
        else {
            this._path = arr;
            alert(arr);
        }
    }





}