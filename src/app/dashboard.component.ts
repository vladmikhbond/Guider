import { Component, EventEmitter, Input, Output} from '@angular/core';
  
@Component({
    selector: 'dash',
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
    </div>
    `
})
export class DashboardComponent {

    @Output()
    onScaled = new EventEmitter<boolean>();
    private change(flag: boolean) {
        this.onScaled.emit(flag);

    }


}