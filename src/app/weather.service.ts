import { Injectable } from '@angular/core';
import { Http , Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class WeatherService {
   private _weatherurl='http://api.worldweatheronline.com/premium/v1/weather.ashx?key=20908469f0244068886124902170510&q=';
   private _weathersearchurl='http://api.worldweatheronline.com/premium/v1/search.ashx?key=20908469f0244068886124902170510&q=';
   constructor(private _http: Http){}
   
   getall(city:string){
      return this._http.get(this._weatherurl + city + "&format=json&num_of_days=8")
      .map((res:Response) => res.json());
   }

   getIPAdress(){
      return this._http.get('https://api.ipify.org/?format=json')
      .map((res:Response) => res.json());
   }
   getCountry(city:string){
      return this._http.get(this._weathersearchurl + city + "&format=json&num_of_results=1")
      .map((res:Response) => res.json());
   }
}