import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * @title Basic menu
 */
@Component({
    selector: 'menu2-tags',
    styles: [`
        [mat-button] {
            height: 50px;
            background-color: aqua;
            border: solid 1px black;
            padding: 0;
        }

        [mat-menu-item] {
            width: 150px;
            height: 30px;
            background-color: aqua;
        }

        .flat-menu {
            display: inline;
            width: 50px;
            height: 50px;
            background-color: aqua;
        }

    `],

    template: `
        <button mat-button [matMenuTriggerFor]="menu" (click)="menu_click()"
                [style.width]="width" [style.max-width]="width" [style.min-width]="width">{{selTag}}</button>
        <mat-menu #menu="matMenu">
            <button class="flat-menu" mat-menu-item [matMenuTriggerFor]="menu1">1</button>
            <button class="flat-menu" mat-menu-item [matMenuTriggerFor]="menu2">2</button>
            <button class="flat-menu" mat-menu-item [matMenuTriggerFor]="menu3">3</button>
            <button class="flat-menu" mat-menu-item [matMenuTriggerFor]="menu4">4</button>
            <button class="flat-menu" mat-menu-item [matMenuTriggerFor]="menu5">*</button>
        </mat-menu>
        <mat-menu #menu1="matMenu">
            <button mat-menu-item *ngFor="let tag of tags1" (click)="item_click(tag)">{{tag}}</button>
        </mat-menu>
        <mat-menu #menu2="matMenu">
            <button mat-menu-item *ngFor="let tag of tags2" (click)="item_click(tag)">{{tag}}</button>
        </mat-menu>
        <mat-menu #menu3="matMenu">
            <button mat-menu-item *ngFor="let tag of tags3" (click)="item_click(tag)">{{tag}}</button>
        </mat-menu>
        <mat-menu #menu4="matMenu">
            <button mat-menu-item *ngFor="let tag of tags4" (click)="item_click(tag)">{{tag}}</button>
        </mat-menu>
        <mat-menu #menu5="matMenu">
            <button mat-menu-item *ngFor="let tag of tags5" (click)="item_click(tag)">{{tag}}</button>
        </mat-menu>
    `


})
export class Menu2Tags {
    @Input()
    set tags(v: string[]) {
        this.tags1 = v.filter(t => t.startsWith("1"));
        this.tags2 = v.filter(t => t.startsWith("2"));
        this.tags3 = v.filter(t => t.startsWith("3"));
        this.tags4 = v.filter(t => t.startsWith("4"));
        this.tags5 = v.filter(t => !t.startsWith("1") && !t.startsWith("2") && !t.startsWith("3") && !t.startsWith("4"));
    }



    @Input()
    selTag: string;
    @Input()
    width: string;

    @Output()
    open = new EventEmitter<null>();
    @Output()
    close = new EventEmitter<string>();


    tags1: string[];
    tags2: string[];
    tags3: string[];
    tags4: string[];
    tags5: string[];



    menu_click() {
        this.open.emit();
    }

    item_click(tag: string) {
        this.selTag = tag;
        this.close.emit(tag);
    }


}
