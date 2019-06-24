import { Component, EventEmitter, Output} from '@angular/core';
import {GuiderService} from "./data/guider.service";

const SCALE_FACTOR = 1.2;

@Component({
    selector: 'editor-dash',
    styles: [`
        #dash {
            width: 100%;
            min-width: 320px;
            text-align: center;
            vertical-align: center;
            height: 50px;
            background-color: darkorange;
            margin: 0;
        }
        button {
            min-width: 50px;
            width: 50px;
            height: 50px;
            padding: 0;
            background-color: white;
        }
    `],
    template: `
        <div id="dash">
            <button mat-stroked-button (click)="scaleChange(true)">+</button>
            <button mat-stroked-button (click)="scaleChange(false)">-</button>
        </div>`

})
export class EditorDashComponent {

    scale = 1;

    constructor(private dataService: GuiderService){

    }

    @Output() onScaled = new EventEmitter<number>();

    scaleChange(increased: boolean) {
        this.scale *= increased ? SCALE_FACTOR : 1 / SCALE_FACTOR;
        this.onScaled.emit(this.scale);
    }





}