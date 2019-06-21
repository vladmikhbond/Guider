import { Component,  ViewChild} from '@angular/core';
import {MapComponent} from './map.component';

const SCALE_FACTOR = 1.2;

@Component({

    selector: 'my-app',
    styles: [`
        #dash {
            width: 100%;
            height: 50px;
            background-color: rgb(255, 228, 196);
            margin: 0;
        }
        button {
            width: 50px;
            height: 50px;
        }
    `],
    template: `
        <div id="dash">
            <button (click)="go()">Start</button>
            <button (click)="go()">Go</button>
            <button (click)="step()">Step</button>
            <button (click)="change(true)">+</button>
            <button (click)="change(false)">-</button>
            <button (click)="help()">Help</button>
        </div>
        <map></map>  
        `
})
export class AppComponent {

    @ViewChild(MapComponent, {static: false})
    child: MapComponent;

    _scale = 1;
    change(increase: boolean) {
        this._scale *= increase ? SCALE_FACTOR : 1 / SCALE_FACTOR;
        this.child.scale = this._scale;
    }

    go() {
        this.child.path = [1, 1, 100, 1, 100, 100];
    }

    step() {
        this.child.doStep("12345");
    }

    help() {
        if (this.child.scale != this._scale)
           this.child.scale = this._scale;
        else
            this.child.scale = 0;
    }

}