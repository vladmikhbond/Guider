import {Component, EventEmitter, Input, Output} from '@angular/core';


@Component({
    selector: 'menu3-tags',
    styles: [`
        [mat-button] {
            height: 50px;
            background-color: aqua;
            border: solid 1px black;
        }

    `],

    template: `        
        <button mat-button (click)="menu_click()"
                [style.width]="width" [style.max-width]="width" >{{selTag}}</button>
    `
})
export class Menu3Tags {
    @Input()
    tags: string[];
    @Input()
    selTag: string;
    @Input()
    width: string;

    canvas: HTMLCanvasElement;



    @Output()
    open = new EventEmitter<null>();

    menu_click() {
        const w = 60, h = 40, k = 25, n = this.tags.length;
        this.canvas = <HTMLCanvasElement>document.getElementById("canvas");
        this.canvas.width = k * w;
        this.canvas.height = ((n / k) | 0 + 2) * h;

        let ctx = this.canvas.getContext("2d");
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.font = "20px Arial";
        for (let i = 0, j = -1; i < n; i++, j = (j+1) % k) {
            const x = j * w;
            const y = ((i / k) | 0) * h;
            ctx.fillStyle = i % 2 ? "white" : "lightgray";
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = "black";
            ctx.fillText(this.tags[i], x+2, y + h/2, w);
        }

        //
        this.open.emit();
    }



}
