import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * @title Basic menu
 */
@Component({
    selector: 'menu-tags',
    styles: [`
        [mat-button] {
            height: 50px;
            background-color: aqua;
            border: solid 1px black;
        }
        [mat-menu-item] {
            width: 150px;
            height: 30px;
            background-color: aqua;
        }

    `],

    template: `        
        <button mat-button [matMenuTriggerFor]="menu" (click)="menu_click()"
                [style.width]="width" [style.max-width]="width" >{{selTag}}</button>
        <mat-menu #menu="matMenu">
            <button mat-menu-item *ngFor="let tag of tags" (click)="item_click(tag)">{{tag}}</button>
        </mat-menu>
    `


})
export class MenuTags {
    @Input()
    tags: string[];
    @Input()
    selTag: string;
    @Input()
    width: string;

    @Output()
    open = new EventEmitter<null>();
    @Output()
    close = new EventEmitter<string>();




    menu_click() {
        this.open.emit();
    }

    item_click(tag: string) {
        this.selTag = tag;
        this.close.emit(tag);
    }


}
