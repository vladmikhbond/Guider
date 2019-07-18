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
            
            margin: 0;
        }
        button {
            width: 50px;
            min-width: 50px;
            height: 50px;
            background-color: aqua;
            padding: 0;
        }
        .more {
          
            width: 35px;
            min-width: 35px;
        }

        #help {
            font-size: 16px;
            text-align: center;
            padding: 10px;
        }
        #legend {
            font-size: 12px;
            text-align: left;
        }
    `],
    template: `
        <div id="dash">

            <menu2-tags [tags]="fromTags" [selTag]="fromTag" (open)="hideMap()" (close)="from($event)" [width]="boxWidth" ></menu2-tags>
            <menu2-tags [tags]="toTags" [selTag]="'?'" (open)="hideMap()" (close)="to($event)" [width]="boxWidth" ></menu2-tags>
            
            <button mat-stroked-button (click)="go()">Go</button>
            <button mat-stroked-button (click)="changeScale(true)" class="more">+</button>
            <button mat-stroked-button (click)="changeScale(false)" class="more">-</button>
            <button mat-stroked-button (click)="help()">Help</button>
        </div>

        <map [style.display]="mapDisplay"></map>
        
        <div id="help" [style.display]="helpDisplay">
            <h1>Инструкция</h1>
            <p>Первой кнопкой выберите "откуда".
            <p>Второй кнопкой выберите "куда".
            <p>Жмите на кнопку Go и идите.
            <h2>Счастливого пути!</h2>

            <p>Рекомендуемый мобильный браузер - Chrome.

            <div id="legend">
                Желтый - непройденный путь<br/>
                Красный - пройденный путь<br/>
                Сплошной - путь на видимом этаже<br/>
                Пунктир - путь на невидимых этажах<br/>
            </div>
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
    toTag: string  =  "?";
    constructor(private guiderService: GuiderService){
        // from-to definition
        this.fromTags = guiderService.getFromTags();
        this.toTags = guiderService.getToTags();
        // buttons layout
        let width = ((screen.availWidth - 2 * 50 - 2 * 35 - 4) / 2) | 0;
        this.boxWidth = width + 'px';
    }


    changeScale(increase: boolean) {
        let k = increase ? SCALE_FACTOR : 1 / SCALE_FACTOR;
        this.child.changeScale(k);
    }

    from(tag: string) {
        this.mapDisplay = "block";
        this.fromTag = tag;
        this.child.path = this.guiderService.findPath(this.fromTag, this.toTag);
    }

    to(tag: string) {
        this.mapDisplay = "block";
        this.toTag = tag;
        this.child.path = this.guiderService.findPath(this.fromTag, this.toTag);
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
