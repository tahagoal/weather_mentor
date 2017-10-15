import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { WeatherService } from './weather.service';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import * as d3 from 'd3-selection';
import * as d3Scale from "d3-scale";
import * as d3Shape from "d3-shape";
import * as d3Array from "d3-array";
import * as d3Axis from "d3-axis";

// import { Temperatures } from './shared/';

@Component({
  selector: 'app-root',
  templateUrl: './app.city.html',
  providers: [WeatherService],
  styleUrls: ['./app.component.css']
})


export class CityComponent {
	ClimateAverages;
	current_condition;
	weather_data;
	city_name:string;
	country_city:string;

	title: string = 'D3.js with Angular 2!';
	subtitle: string = 'Multi-Series Line Chart';
	data: any;
	svg: any;
	margin = {top: 20, right: 80, bottom: 30, left: 50};
	g: any;
	width: number;
	height: number;
	x;
	y;
	z;
	line;

	Temperatures = [
{
    "id": "Min. Temp.",
    "values": [
      {"date": new Date("2017-01-01"), "temperature": 63.4},
      {"date": new Date("2017-02-01"), "temperature": 50},
      {"date": new Date("2017-03-01"), "temperature": 30},
      {"date": new Date("2017-04-01"), "temperature": 20},
      {"date": new Date("2017-05-01"), "temperature": 44},
      {"date": new Date("2017-06-01"), "temperature": 50},
      {"date": new Date("2017-07-01"), "temperature": 80},
      {"date": new Date("2017-08-01"), "temperature": 55},
      {"date": new Date("2017-09-01"), "temperature": 12},
      {"date": new Date("2017-10-01"), "temperature": 55},
      {"date": new Date("2017-11-01"), "temperature": 54},
      {"date": new Date("2017-12-01"), "temperature": 64},
    ]
},
{
    "id": "Max. Temp.",
    "values": [
      {"date": new Date("2017-01-01"), "temperature": 6},
      {"date": new Date("2017-02-01"), "temperature": 12},
      {"date": new Date("2017-03-01"), "temperature": 15},
      {"date": new Date("2017-04-01"), "temperature": 10},
      {"date": new Date("2017-05-01"), "temperature": 8},
      {"date": new Date("2017-06-01"), "temperature": 5},
      {"date": new Date("2017-07-01"), "temperature": 7},
      {"date": new Date("2017-08-01"), "temperature": 23},
      {"date": new Date("2017-09-01"), "temperature": 12},
      {"date": new Date("2017-10-01"), "temperature": 25},
      {"date": new Date("2017-11-01"), "temperature": 3},
      {"date": new Date("2017-12-01"), "temperature": 4},
    ]
  }
];

STATISTICS = [
  {letter: "A", temp: .08167},
  {letter: "B", temp: .01492},
  {letter: "C", temp: .02782},
  {letter: "D", temp: .04253},
  {letter: "E", temp: .12702},
  {letter: "F", temp: .02288},
  {letter: "G", temp: .02015}
];

	private route$ : Subscription;
	constructor(
		private _weather: WeatherService,
		private route : ActivatedRoute) {}

	ngOnInit() {
        this.route.params.subscribe((params: Params) => {
	        let city_name = params['name'];
	        this.getweatherData(city_name);
	      });

    }

    getweatherData(city: string){
		this._weather.getall(city)
		.subscribe(
			api_weather_data => this.send_data(api_weather_data)
			);
	}


	// Sending data to function to parse 
	send_data(api_weather_data){
		this.ClimateAverages = api_weather_data.data.ClimateAverages
		this.current_condition = api_weather_data.data.current_condition
		this.weather_data = api_weather_data.data.weather
		this.country_city = api_weather_data.data.request[0].query

		for(let i = 0; i < 12; ++i) {
 			this.Temperatures[0].values[i].temperature = this.ClimateAverages[0].month[i].avgMinTemp;
 			this.Temperatures[1].values[i].temperature = this.ClimateAverages[0].month[i].absMaxTemp;
		}

		for(let i = 0; i < 7; ++i) {
 			this.STATISTICS[i].letter = this.weather_data[i].date;
 			this.STATISTICS[i].temp = this.weather_data[i].maxtempC;
		}


		this.data = this.Temperatures.map((v) => v.values.map((v) => v.date ))[0];
        this.initChart();
        this.drawAxis();
        this.drawPath();

        this.initSvg()
	    this.initAxis();
	    this.drawAxis_bar();
	    this.drawBars();
	}


	private initChart(): void {
    this.svg = d3.select("#temp-chart").append("svg").attr("width", 1200).attr("height", 500);

    this.width = this.svg.attr("width") - this.margin.left - this.margin.right;
    this.height = this.svg.attr("height") - this.margin.top - this.margin.bottom;

    this.g = this.svg.append("g").attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.x = d3Scale.scaleTime().range([0, this.width]);
    this.y = d3Scale.scaleLinear().range([this.height, 0]);
    this.z = d3Scale.scaleOrdinal(d3Scale.schemeCategory10);

    this.line = d3Shape.line()
                       .curve(d3Shape.curveBasis)
                       .x( (d: any) => this.x(d.date) )
                       .y( (d: any) => this.y(d.temperature) );

    this.x.domain(d3Array.extent(this.data, (d: Date) => d ));

    this.y.domain([
      d3Array.min(this.Temperatures, function(c) { return d3Array.min(c.values, function(d) { return d.temperature; }); }),
      d3Array.max(this.Temperatures, function(c) { return d3Array.max(c.values, function(d) { return d.temperature; }); })
    ]);

    this.z.domain(this.Temperatures.map(function(c) { return c.id; }));
  }

  private drawAxis(): void {
    this.g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3Axis.axisBottom(this.x));

    this.g.append("g")
      .attr("class", "axis axis--y")
      .call(d3Axis.axisLeft(this.y))
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("fill", "#000")
      .text("Temperature, ºC");
  }

  private drawPath(): void {
    let city = this.g.selectAll(".city")
      .data(this.Temperatures)
      .enter().append("g")
      .attr("class", "city");

    city.append("path")
      .attr("class", "line")
      .attr("d", (d) => this.line(d.values) )
      .style("stroke", (d) => this.z(d.id) );

    city.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", (d) => "translate(" + this.x(d.value.date) + "," + this.y(d.value.temperature) + ")" )
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
  }

  private initSvg() {
    this.svg = d3.select("#week-chart").append("svg").attr("width", 900).attr("height", 500);
    this.width = +this.svg.attr("width") - this.margin.left - this.margin.right ;
    this.height = +this.svg.attr("height") - this.margin.top - this.margin.bottom;
    this.g = this.svg.append("g")
                     .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");;
  }

  private initAxis() {
    this.x = d3Scale.scaleBand().rangeRound([0, this.width]).padding(0.1);
    this.y = d3Scale.scaleLinear().rangeRound([this.height, 0]);
    this.x.domain(this.STATISTICS.map((d) => d.letter));
    this.y.domain([0, d3Array.max(this.STATISTICS, (d) => d.temp)]);
  }

  private drawAxis_bar() {
    this.g.append("g")
          .attr("class", "axis axis--x")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3Axis.axisBottom(this.x));
    this.g.append("g")
          .attr("class", "axis axis--y")
          .call(d3Axis.axisLeft(this.y))
          .append("text")
          .attr("class", "axis-title")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .attr("fill", "#000")
          .text("Max. Temp., ºC");
  }

  private drawBars() {
    this.g.selectAll(".bar")
          .data(this.STATISTICS)
          .enter().append("rect")
          .attr("class", "bar")
          .attr("x", (d) => this.x(d.letter) )
          .attr("y", (d) => this.y(d.temp) )
          .attr("width", this.x.bandwidth())
          .attr('fill', '#0C1828')
          .attr("height", (d) => this.height - this.y(d.temp) );
  }

}
