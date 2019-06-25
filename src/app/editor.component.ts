import {Component} from '@angular/core';
import {Point} from './data/point';
import {EditorService} from "./data/editor.service";

const DASH_HEIGHT = 50;
const INFO_HEIGHT = 30;

@Component({
    selector: 'editor',
    styles: [`
        canvas {
        }
        #info {
            height: 30px;
        }
        #scrollBox {
            width: 100%;
            min-width: 320px;
            overflow: auto;
        }
    `],
    template: `
        <editor-dash (onScaled)="dash_Scaled($event)" (onFloorChanged)="dash_FloorChanged($event)"></editor-dash>
        <div id="info">{{info}}</div>
        <div id="scrollBox" (scroll)="onScroll($event)">
            <canvas id="canvas" (mousemove)="mousemove($event)" (mousedown)="mousedown($event)"></canvas>
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

    info: string = "123";
    // back fields for props
    scaleField = 1;
    currentFloorIndex = 0;
    editorService: EditorService

    constructor(editorService: EditorService){
        this.editorService = editorService;
    }


    init() {
        // fill array of images
        this.bgImages = [];
        for (let i = 1; i <= 6; i++ ) {
            let im = <HTMLImageElement>document.getElementById("floor" + i);
            this.bgImages.push(im);
        }
        // set scrollBox size
        this.scrollBox = document.getElementById("scrollBox");
        this.scrollBox.style.height = `${screen.height - DASH_HEIGHT - INFO_HEIGHT}px`;
        this.redraw();
    }


    redraw(): void {
        let img = this.currentFloor;
        let k = this.scaleField;
        // canvas size
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.canvas.width = img.width * k;
        this.canvas.height = img.height * k;

        // draw back image
        this.ctx = this.canvas.getContext("2d");
        this.ctx.drawImage(img,
            0, 0, img.width, img.height,
            0, 0, this.canvas.width, this.canvas.height);
        // draw points
        this.ctx.lineWidth = 0.5;
        for (let p of this.editorService.points) {
            this.ctx.fillRect(p.x * k - 0.5, p.y * k - 0.5, 1, 1 );
            this.ctx.strokeRect((p.x - 1) * k, (p.y - 1) * k, 2 * k, 2 * k );
        }
        this.ctx.strokeStyle = 'red';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect((this.editorService.selPoint.x - 1) * k, (this.editorService.selPoint.y - 1) * k, 2 * k, 2 * k );


    }


    onScroll(e: Event) {
        let scrollY = (<HTMLElement>e.target).scrollTop;
        let scrollX = (<HTMLElement>e.target).scrollLeft;
        //console.log(scrollX, scrollY);
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

    // this event handlers ///////////////////////
    mousemove(e: MouseEvent) {
        let x = Math.round(e.offsetX / this.scaleField);
        let y = Math.round(e.offsetY / this.scaleField);
        this.info = `${x}  ${y}`;
    }

    mousedown(e: MouseEvent) {
        let x = Math.round(e.offsetX / this.scaleField);
        let y = Math.round(e.offsetY / this.scaleField);
        let p = new Point(x, y, 0);
        this.editorService.addPoint(p);
        this.redraw();
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
