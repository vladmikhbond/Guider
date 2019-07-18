import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import {enableProdMode} from "@angular/core";

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);



