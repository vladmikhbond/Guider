import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Routes, RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatSelectModule} from '@angular/material';
 
import {AppComponent}   from './app.component';
import {MapComponent}   from './map.component';
import {GuiderComponent} from "./guider.component";
import {EditorComponent} from "./editor.component";
import {EditorDashComponent} from "./editorDash.component";

import {GuiderService} from './data/guider.service';
import {EditorService} from './data/editor.service';

// определение маршрутов
const appRoutes: Routes =[
    { path: '', component: EditorComponent},
    { path: 'g', component: GuiderComponent},
    // { path: '**', component: DashboardComponent }
];
 
@NgModule({
    imports: [BrowserModule, RouterModule.forRoot(appRoutes), BrowserAnimationsModule, MatButtonModule, MatSelectModule],
    declarations: [AppComponent, GuiderComponent, MapComponent, EditorComponent, EditorDashComponent],
    providers: [GuiderService, EditorService],
    bootstrap: [AppComponent]
})
export class AppModule { }