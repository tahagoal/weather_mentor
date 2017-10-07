import { Component } from '@angular/core';
import { WeatherService } from './weather.service';
import { Http , Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-landing',
  templateUrl: './app.landing.html',
  styleUrls: ['./app.landing.css'],
  providers: [WeatherService],
})

export   class   AppWeather  {
	ClimateAverages;
	current_condition;
	weather_data;
	constructor(private _weather: WeatherService) {}

	ngOnInit(){
		this._weather.getIPAdress()
		.subscribe(
			result => this.getweatherData(result.ip)
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
}
