import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatSelectModule} from '@angular/material';

import {MapComponent}   from './map.component';
import {AppComponent} from "./app.component";
import {GuiderService} from './data/guider.service';

@NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, MatButtonModule, MatSelectModule],
    declarations: [AppComponent, MapComponent],
    providers: [GuiderService],
    bootstrap: [AppComponent]
})
export class AppModule { }
