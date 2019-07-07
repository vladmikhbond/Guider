import {Component,  ViewChild} from '@angular/core';
import {MapComponent} from './map.component';
import {GuiderService} from './data/guider.service';

const SCALE_FACTOR = 1.2;

@Component({
    selector: 'guider',
    styles: [`
        #dash {
            width: 100%;
            min-width: 320px;
            text-align: center;
            vertical-align: center;
            height: 50px;
            background-color: lightblue;
            margin: 0;
        }
        select, button {
            width: 50px;
            height: 50px;
            background-color: aqua;
        }
        select {
            border: solid 1px black;
        }
        button {
            min-width: 50px;
             padding: 0;
         }
        #help {
            font-size: large;
            text-align: center;
            background-color: lemonchiffon;
            padding: 20px;
        }
    `],
    template: `
        <div id="dash">
            <select #selFrom [style.width]="boxWidth" (change)="from(selFrom.value)" value="{{fromTag}}">
                <option *ngFor="let tag of fromTags" [value]="tag">
                    {{tag}}
                </option>
            </select>
            <select #selTo [style.width]="boxWidth" (change)="to(selTo.value)" value="{{''}}">
                <option *ngFor="let tag of toTags" [value]="tag">
                    {{tag}}
                </option>
            </select>

            <button mat-stroked-button (click)="go()">Go</button>
            <button mat-stroked-button (click)="changeScale(true)">+</button>
            <button mat-stroked-button (click)="changeScale(false)">-</button>
            <button mat-stroked-button (click)="help()">Help</button>
        </div>

        <map [style.display]="mapDisplay"></map>
        <div id="help" [style.display]="halpDisplay">
            <h1>Инструкция</h1>
            <p>Из первого списка выберите "откуда".
            <p>Из второго списка выберите "куда".
            <p>Жмите на кнопку Go и идите.
            <h2>Счастливого пути!</h2>
            <hr/>
            <p>Рекомендуемый мобильный браузер - Chrome.

        </div>


        <img id="floor1" [src]="'assets/floors/1.svg'" (load)="child.init()" hidden alt="floor1"/>
        <img id="floor2" [src]="'assets/floors/2.svg'" hidden alt="floor2"/>
        <img id="floor3" [src]="'assets/floors/3.svg'" hidden alt="floor3"/>
        <img id="floor4" [src]="'assets/floors/4.svg'" hidden alt="floor4"/>
        <img id="floor5" [src]="'assets/floors/5.svg'" hidden alt="floor5"/>
        <img id="floor6" [src]="'assets/floors/6.svg'" hidden alt="floor6"/>
    `
})
export class AppComponent
{
    @ViewChild(MapComponent, {static: false})
    child: MapComponent;

    fromTags: string[];
    toTags: string[];
    boxWidth: string;
    mapDisplay: string = 'block';
    halpDisplay: string = 'none';
    fromTag: string = "ВХОД";

    constructor(private guiderService: GuiderService){
        // from-to definition
        this.fromTags = guiderService.getFromTags();
        this.toTags = guiderService.getToTags();
        // buttons layout
        let width = ((screen.width - 4 * 50) / 2) | 0;
        if (width > 100) width = 100;
        this.boxWidth = width + 'px';
    }


    changeScale(increase: boolean) {
        this.child.scale *= increase ? SCALE_FACTOR : 1 / SCALE_FACTOR;
    }

    from(tag: string) {
        this.fromTag = tag;
    }

    to(tag: string) {
        let path = this.guiderService.findPath(this.fromTag, tag);
        if (path == null)
            alert("No path exists.")
        else {
            this.child.path = path;
        }
    }

    go() {
        this.mapDisplay = 'block';
        this.child.step();
    }

    help() {
        this.mapDisplay = this.mapDisplay == 'none' ? 'block' : 'none';
        this.halpDisplay = this.halpDisplay == 'none' ? 'block' : 'none';
    }

}
