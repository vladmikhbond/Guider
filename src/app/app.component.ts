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

            <menu-tags [tags]="fromTags" [selTag]="fromTag" (open)="hideMap()" (close)="from($event)" [width]="boxWidth" ></menu-tags>
            <menu-tags [tags]="toTags" [selTag]="'?'" (open)="hideMap()" (close)="to($event)" [width]="boxWidth" ></menu-tags>
            
            <button mat-stroked-button (click)="go()">Go</button>
            <button mat-stroked-button (click)="changeScale(true)">+</button>
            <button mat-stroked-button (click)="changeScale(false)">-</button>
            <button mat-stroked-button (click)="help()">Help</button>
        </div>

        <map [style.display]="mapDisplay"></map>
        <div id="help" [style.display]="helpDisplay">
            <h1>Инструкция</h1>
            <p>Из первого списка выберите "откуда".
            <p>Из второго списка выберите "куда".
            <p>Жмите на кнопку Go и идите.
            <h2>Счастливого пути!</h2>
            <hr/>
            <p>Рекомендуемый мобильный браузер - Chrome.

        </div>
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
    helpDisplay: string = 'none';
    fromTag: string = "ВХОД";

    constructor(private guiderService: GuiderService){
        // from-to definition
        this.fromTags = guiderService.getFromTags();
        this.toTags = guiderService.getToTags();
        // buttons layout
        let width = ((screen.width - 4 * 50) / 2) | 0;
        this.boxWidth = width + 'px';
    }


    changeScale(increase: boolean) {
        let k = increase ? SCALE_FACTOR : 1 / SCALE_FACTOR;
        this.child.changeScale(k);
    }

    from(tag: string) {
        this.mapDisplay = "block";
        this.fromTag = tag;
    }

    to(tag: string) {
        this.mapDisplay = "block";
        let path = this.guiderService.findPath(this.fromTag, tag);
        if (path == null)
            console.error("No path exists.");
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
        this.helpDisplay = this.helpDisplay == 'none' ? 'block' : 'none';
    }


     hideMap() {
        this.mapDisplay = "none";
    }
}
