import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatMenuModule, MatButtonModule} from '@angular/material'

import {MapComponent}   from './map.component';
import {AppComponent} from "./app.component";
import {GuiderService} from './data/guider.service';
import {Menu} from './menu.component';

@NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, MatButtonModule, MatMenuModule],
    declarations: [AppComponent, MapComponent, Menu],
    providers: [GuiderService],
    bootstrap: [AppComponent]
})
export class AppModule { }
