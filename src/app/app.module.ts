import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatSelectModule} from '@angular/material';
 
//import {AppComponent}   from './app.component';
import {MapComponent}   from './map.component';
import {GuiderComponent} from "./guider.component";

import {GuiderService} from './data/guider.service';


@NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, MatButtonModule, MatSelectModule],
    declarations: [GuiderComponent, MapComponent],
    providers: [GuiderService],
    bootstrap: [GuiderComponent]
})
export class AppModule { }