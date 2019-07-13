import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatMenuModule, MatButtonModule} from '@angular/material'

import {MapComponent}   from './map.component';
import {AppComponent} from "./app.component";
import {GuiderService} from './data/guider.service';
import {MenuTags} from "./menu.component";
import {Menu2Tags} from './menu2.component';

@NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, MatButtonModule, MatMenuModule],
    declarations: [AppComponent, MapComponent, MenuTags, Menu2Tags],
    providers: [GuiderService],
    bootstrap: [AppComponent]
})
export class AppModule { }
