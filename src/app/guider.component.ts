﻿import { Component,  ViewChild} from '@angular/core';
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
        mat-form-field {
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
    `],
    template: `
        <div id="dash">
            <mat-form-field>
                <mat-select (valueChange)="from($event)" >
                    <mat-option *ngFor="let tag of tags" [value]="tag">
                        {{tag}}
                    </mat-option>
                </mat-select>
            </mat-form-field>
            <mat-form-field>
                <mat-select (valueChange)="to($event)">
                    <mat-option *ngFor="let tag of tags" [value]="tag">
                        {{tag}}
                    </mat-option>
                </mat-select>
            </mat-form-field>

            <button mat-stroked-button (click)="step()">Step</button>
            <button mat-stroked-button (click)="change(true)">+</button>
            <button mat-stroked-button (click)="change(false)">-</button>
            <button mat-stroked-button (click)="help()">Help</button>
        </div>
        <map></map>
        <img id="floor1" [src]="'assets/floors/1.svg'" (load)="child.init()" hidden alt="floor1"/>
        <img id="floor2" [src]="'assets/floors/2.svg'" hidden alt="floor2"/>
        <img id="floor3" [src]="'assets/floors/3.svg'" hidden alt="floor3"/>
        <img id="floor4" [src]="'assets/floors/4.svg'" hidden alt="floor4"/>
        <img id="floor5" [src]="'assets/floors/5.svg'" hidden alt="floor5"/>`
})
export class GuiderComponent
{
    @ViewChild(MapComponent, {static: false})
    child: MapComponent;

    scale = 1;
    tags: string[];
    fromTag: string;

    constructor(private dataService: GuiderService){
        this.tags = dataService.getTags();
    }

    change(increase: boolean) {
        this.scale *= increase ? SCALE_FACTOR : 1 / SCALE_FACTOR;
        this.child.scale = this.scale;
    }

    from(tag: string) {
        this.fromTag = tag;
    }

    to(toTag: string) {
        this.child.path = this.dataService.getPath(this.fromTag, toTag);
    }

    step() {
        this.child.doStep("12345");
    }

    help() {
        this.child.scale = this.child.scale == this.scale ? 0 : this.scale;
    }

}