import { Component} from '@angular/core';
  
@Component({
    selector: 'my-app',
    template: `
        <dash></dash>
     
        <router-outlet></router-outlet>
    
    `
})
export class AppComponent {}