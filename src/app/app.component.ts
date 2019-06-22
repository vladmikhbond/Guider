import { Component,  ViewChild} from '@angular/core';
import {MapComponent} from './map.component';

const SCALE_FACTOR = 1.2;

@Component({

    selector: 'my-app',
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
                <mat-select (valueChange)="start($event)" sele>
                    <mat-option *ngFor="let tag of tags" [value]="tag"  >
                        {{tag}}
                    </mat-option>
                </mat-select>
            </mat-form-field>
            <mat-form-field>
                <mat-select  (valueChange)="go($event)">
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
        <map></map>`

})
export class AppComponent {

    @ViewChild(MapComponent, {static: false})
    child: MapComponent;

    _scale = 1;
    change(increase: boolean) {
        this._scale *= increase ? SCALE_FACTOR : 1 / SCALE_FACTOR;
        this.child.scale = this._scale;
    }

    start(value: string) {
        alert(value);
    }

    go(value: string) {
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

    tags: string[] = [ '111', '222', '333'];





}