import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
 
import {Routes, RouterModule} from '@angular/router';
 
import { AppComponent }   from './app.component';
import { AboutComponent }   from './about.component';
import { MapComponent }   from './map.component';
import { DashboardComponent }   from './dashboard.component';
 
// определение маршрутов
const appRoutes: Routes =[
    { path: '', component: MapComponent},
    // { path: 'about', component: AboutComponent},
    // { path: '**', component: DashboardComponent }
];
 
@NgModule({
    imports:      [ BrowserModule, RouterModule.forRoot(appRoutes)],
    declarations: [ AppComponent, MapComponent, AboutComponent, DashboardComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }