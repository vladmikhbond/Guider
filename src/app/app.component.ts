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
        select {
            width: 60px;
            height: 50px;
            background-color: aqua;
            border: solid thin lightblue;
        }
        button {
            min-width: 50px;
            width: 50px;
            height: 50px;
            padding: 0;
            background-color: aqua;
        }
        #help {
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
            
            <button mat-stroked-button (click)="step()">Go</button>
            <button mat-stroked-button (click)="change(true)">+</button>
            <button mat-stroked-button (click)="change(false)">-</button>
            <button mat-stroked-button (click)="help()">Help</button>
        </div>

        <map [style.display]="dmode"></map>
        <div id="help">
            <h1>Инструкция</h1>
            <p>Из первого списка выберите "откуда".
            <p>Из второго списка выберите "куда".
            <p>Жмите на кнопку Go и идите.
            <h2>Счастливого пути!</h2>
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

    scale = 1;
    fromTags: string[];
    toTags: string[];
    boxWidth: string;
    dmode: string = 'block';
    fromTag: string = "ВХОД";

    constructor(private guiderService: GuiderService){
        this.fromTags= guiderService.getFromTags();
        this.toTags= guiderService.getToTags();
        this.boxWidth = `${((screen.width - 4 * 50) / 2) | 0}px`;


    }

    change(increase: boolean) {
        this.scale *= increase ? SCALE_FACTOR : 1 / SCALE_FACTOR;
        this.child.scale = this.scale;
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

    step() {
        this.dmode = 'block';
        this.child.step();
    }

    help() {
        //this.child.scale = this.child.scale == this.scale ? 0 : this.scale;
        this.dmode = this.dmode == 'none' ? 'block' : 'none';
    }

}
