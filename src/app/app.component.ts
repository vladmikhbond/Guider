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
            position: fixed;
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
            position: absolute;
            top: 50px;
            width: 100%;
        }
    `],
    template: `
        <div id="dash">
            <app-tmenu [selTag]="fromTag" [upperItems]="upItems" [itemLists]="fromItemLists" (open)="openMenu()"
                       (itemSelected)="from($event)"></app-tmenu>
            <app-tmenu [selTag]="toTag" [upperItems]="upItems" [itemLists]="toItemLists" (open)="openMenu()"
                       (itemSelected)="to($event)"></app-tmenu>

            <!--            <menu2-tags [tags]="fromTags" [selTag]="fromTag" (close)="from($event)" [width]="boxWidth" ></menu2-tags>-->
            <!--            <menu2-tags [tags]="toTags" [selTag]="'куда?'" (close)="to($event)" [width]="boxWidth"></menu2-tags>-->

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
            <div id="legend">
                <h3>Легенда</h3>
                Желтый - непройденный путь<br/>
                Красный - пройденный путь<br/>
                Сплошной - путь на видимом этаже<br/>
                Пунктир - путь на невидимых этажах<br/>
            </div>
            <hr/>
            <p>Рекомендуемый мобильный браузер - Chrome.

        </div>
    `
})
export class AppComponent
{
    @ViewChild(MapComponent, {static: false})
    child: MapComponent;

    mapDisplay: string = 'block';
    helpDisplay: string = 'none';
    fromTag: string = "ВХОД";
    toTag: string  =  "?";


    upItems = ["1", "2", "3", "4", "и др."];
    fromItemLists: string[][];
    toItemLists: string[][];

    constructor(private guiderService: GuiderService){
        //
        this.fromItemLists = this.getItemLists(guiderService.getFromTags());
        this.toItemLists = this.getItemLists(guiderService.getToTags());

        // buttons layout
        // let width = ((screen.availWidth - 2 * 50 - 2 * 35 - 4) / 2) | 0;
        // this.boxWidth = width + 'px';
    }

    private getItemLists(tags: string[] ): string[][] {
        const res = [];
        for (let i = 0; i < 4; i++)
        {
            res.push(tags.filter(t => t.startsWith(this.upItems[i])))
        }
        res.push(tags.filter(t => !t.startsWith("1") && !t.startsWith("2") && !t.startsWith("3") && !t.startsWith("4")));
        return res;
    }

    changeScale(increase: boolean) {
        let k = increase ? SCALE_FACTOR : 1 / SCALE_FACTOR;
        this.child.changeScale(k);
    }

    openMenu() {
        this.mapDisplay = 'none';
    }

    from(tag: string) {
        this.fromTag = tag;
        this.createRoute();
        this.mapDisplay = 'block';
    }

    to(tag: string) {
        this.toTag = tag;
        this.createRoute();
        this.mapDisplay = 'block';
    }

    private createRoute() {
        let path = this.guiderService.findPath(this.fromTag, this.toTag);
        if (path) {
            this.child.path = path;
            setTimeout(() => {
                this.child.autoscroll(this.child.path[0])
            }, 0)
        }
    }

    private delayedAutoscroll() {
        setTimeout(() => {
            this.child.autoscroll(this.child.path[0])
        }, 0);
    }

    go() {
        if (this.child.path.length > 0)
            this.child.step();
    }

    help() {
        this.mapDisplay = this.mapDisplay == 'none' ? 'block' : 'none';
        this.helpDisplay = this.helpDisplay == 'none' ? 'block' : 'none';
    }


}
