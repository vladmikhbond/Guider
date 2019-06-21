import { Component,  ViewChild} from '@angular/core';
import {MapComponent} from './map.component';

@Component({

    selector: 'my-app',
    styles: [`
        div {
            width: 100%;
            height: 50px;
            background-color: rgb(255, 228, 196);
            margin: 0;

        }
    `],
    template: `<div>
        <a routerLink="/about">about</a>
        <button (click)="change(true)">+</button>
        <button (click)="change(false)">-</button>
        <button (click)="go()">Go</button>
        <button (click)="step()">Step</button>

    </div>

    <map></map>
<!--    <router-outlet></router-outlet>-->
    `

})
export class AppComponent {

    @ViewChild(MapComponent, {static: false})
    child: MapComponent;

    _scale = 1;
    private change(flag: boolean) {
        this._scale *= flag ? 1.2 : 1/1.2;
        this.child.scale = this._scale;
    }

    private go() {
        this.child.path = [1, 1, 100, 1, 100, 100];
    }

    private step() {
        this.child.f("12345");
    }

}