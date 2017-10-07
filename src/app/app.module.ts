import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppWeather } from './app.landing';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [AppWeather],
  imports:[ BrowserModule,HttpModule],
  bootstrap: [AppWeather]
})
export class AppModule { }
