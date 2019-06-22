import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {Routes, RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatSelectModule} from '@angular/material';
 
import { AppComponent }   from './app.component';
import { AboutComponent }   from './about.component';
import { MapComponent }   from './map.component';

// определение маршрутов
const appRoutes: Routes =[
    { path: '', component: MapComponent},
    { path: 'map', component: MapComponent},
    { path: 'about', component: AboutComponent},
    // { path: '**', component: DashboardComponent }
];
 
@NgModule({
    imports: [BrowserModule, RouterModule.forRoot(appRoutes), BrowserAnimationsModule, MatButtonModule, MatSelectModule],
    declarations: [ AppComponent, MapComponent, AboutComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }