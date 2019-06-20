import { Component} from '@angular/core';
  
@Component({
    selector: 'my-app',
    template: `
        <dash (onScaled)="onScaled($event)"></dash>
        <map [scale]="incresed" > </map>
    
    `
     
    //    <router-outlet></router-outlet>
    

})
export class AppComponent {

    incresed: boolean;
    onScaled(flag: boolean){
        this.incresed = flag;


    }

}