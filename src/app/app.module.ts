import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Routes, RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatSelectModule} from '@angular/material';
 
import { AppComponent }   from './app.component';
import { StubComponent }   from './stub.component';
import { MapComponent }   from './map.component';
import {DashComponent} from "./dash.component";

import {DataService} from './data/data.service';

// определение маршрутов
const appRoutes: Routes =[
    { path: '', component: DashComponent},
    { path: 'stub', component: StubComponent},
    // { path: '**', component: DashboardComponent }
];
 
@NgModule({
    imports: [BrowserModule, RouterModule.forRoot(appRoutes), BrowserAnimationsModule, MatButtonModule, MatSelectModule],
    declarations: [AppComponent, DashComponent, MapComponent, StubComponent],
    providers: [DataService],
    bootstrap:    [AppComponent]
})
export class AppModule { }