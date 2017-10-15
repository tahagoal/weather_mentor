import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LandingComponent } from './app.landing';
import { CityComponent } from './app.city';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { D3Service } from 'd3-ng2-service'; // <-- import statement



const appRoutes: Routes = [
  {
    path: 'landing',
    component: LandingComponent,
    data: { title: 'Display' }
  },
  {
    path: 'city/:name',
    component: CityComponent,
    data: { title: 'City Weather' }
  }
];

@NgModule({
	declarations: [
	    AppComponent, LandingComponent, CityComponent
    ],
	imports: [
		RouterModule.forRoot(
			appRoutes,
	),
		BrowserModule,
		HttpModule
	],
	providers: [D3Service],
  bootstrap: [AppComponent]

})
export class AppModule { }