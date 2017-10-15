import { Component } from '@angular/core';
import { WeatherService } from './weather.service';
import { Http , Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.landing.html',
  styleUrls: ['./app.component.css'],
  providers: [WeatherService],
})
export class LandingComponent {
ClimateAverages;
	current_condition;
	weather_data;
	city_name:string;
	country:string;
	constructor(private _weather: WeatherService,
		private route: ActivatedRoute,
		private router: Router) {}

	ngOnInit(){
		this._weather.getIPAdress()
		.subscribe(
			result => this.getWeatherCountry(result.ip),
			);
	}

	getWeatherCountry(ipadress: string){
		this._weather.getCountry(ipadress)
		.subscribe(
			country_search => (this.country = country_search.search_api.result[0].country[0].value,
				this.getweatherData(country_search.search_api.result[0].country[0].value)) 
			);
	}

	getweatherData(ipadress: string){
		this._weather.getall(ipadress)
		.subscribe(
				api_weather_data => (this.ClimateAverages = api_weather_data.data.ClimateAverages,
					this.current_condition = api_weather_data.data.current_condition,
					this.weather_data = api_weather_data.data.weather)
				// api_weather_data => console.log(api_weather_data)
			);
	}


	onClickMe(city: string){
		this.router.navigate(['city', city]);
	}
}
