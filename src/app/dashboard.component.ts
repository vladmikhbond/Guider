import { Component} from '@angular/core';
  
@Component({
    selector: 'dash',
    styles: [`
        div {
        width: 100%; height: 50px; 
        background-color: bisque;
        margin: 0;
        
    }
    `],
    template: `<div>
        <h1>Dashboard</h1>
    </div>
    `
})
export class DashboardComponent { }