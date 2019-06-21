import { Component,  ViewChild} from '@angular/core';
import {MapComponent} from './map.component';

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
    change(flag: boolean) {
        this._scale *= flag ? 1.2 : 1/1.2;
        this.child.scale = this._scale;
    }

    go() {
        this.child.path = [1, 1, 100, 1, 100, 100];
    }

    step() {
        this.child.step("12345");
    }

    help() {
       alert("help");
    }

}