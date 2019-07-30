import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MapComponent}   from './map.component';
import {AppComponent} from "./app.component";
import {GuiderService} from './data/guider.service';
import {TmenuComponent} from './tmenu.component';

@NgModule({
    imports: [BrowserModule],
    declarations: [AppComponent, MapComponent, TmenuComponent],
    providers: [GuiderService],
    bootstrap: [AppComponent]
})
export class AppModule { }
