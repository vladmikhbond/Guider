import {Component} from '@angular/core';
//import {Point} from './data/point';
import {EditorService} from "./data/editor.service";

const DASH_HEIGHT = 50;

@Component({
    selector: 'editor',
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
        <editor-dash (onScaled)="dash_Scaled($event)" (onFloorChanged)="dash_FloorChanged($event)"></editor-dash>

        <div id="scrollBox" (scroll)="onScroll($event)">
            <canvas id="canvas"></canvas>
        </div>

        <img id="floor1" [src]="'assets/floors/1.svg'" (load)="init()" hidden alt="floor1"/>
        <img id="floor2" [src]="'assets/floors/2.svg'" hidden alt="floor2"/>
        <img id="floor3" [src]="'assets/floors/3.svg'" hidden alt="floor3"/>
        <img id="floor4" [src]="'assets/floors/4.svg'" hidden alt="floor4"/>
        <img id="floor5" [src]="'assets/floors/5.svg'" hidden alt="floor5"/>
        <img id="floor6" [src]="'assets/floors/6.svg'" hidden alt="floor6"/>
    `
})
export class EditorComponent {

    // privates
    bgImages: HTMLImageElement[];
    scrollBox: HTMLElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    // back fields for props
    scaleField = 1;
    currentFloorIndex = 0;

    // constructor(editorService: EditorService){
    //
    // }


    init() {
        // fill array of images
        this.bgImages = [];
        for (let i = 1; i <= 6; i++ ) {
            let im = <HTMLImageElement>document.getElementById("floor" + i);
            this.bgImages.push(im);
        }
        // set scrollBox size
        this.scrollBox = document.getElementById("scrollBox");
        this.scrollBox.style.height = `${screen.height - DASH_HEIGHT}px`;
        this.redraw();
    }


    redraw(): void {
        let img = this.currentFloor;
        // canvas size
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.canvas.width = img.width * this.scaleField;
        this.canvas.height = img.height * this.scaleField;

        // draw image
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, this.canvas.width, this.canvas.height);
    }


    onScroll(e: Event) {
        let scrollY = (<HTMLElement>e.target).scrollTop;
        let scrollX = (<HTMLElement>e.target).scrollLeft;
        console.log(scrollX, scrollY);
    }

    // props ////////////////////////////////////

    set scale(newScale: number) {
        const k = newScale / this.scaleField;
        const w = screen.width / 2;
        const h = (screen.height - DASH_HEIGHT) / 2;
        this.scrollBox.scrollLeft = (this.scrollBox.scrollLeft + w) * k - w;
        this.scrollBox.scrollTop = (this.scrollBox.scrollTop + h) * k - h;

        this.scaleField = newScale;
        this.redraw();
    }

    get scale() {
        return this.scaleField;
    }

    get currentFloor() {
        return this.bgImages[this.currentFloorIndex];
    }


    // child event handlers ///////////////////////

    dash_Scaled(newScale: number) {
        this.scale = newScale;
    }

    dash_FloorChanged(newIndex: number) {
        this.currentFloorIndex = newIndex;
        this.redraw();
    }
}
