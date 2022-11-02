import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DynamicScriptLoaderService } from 'src/app/services/dynamic-script-loader.service';
import { SidebarComponent } from 'src/app/layout/sidebar/sidebar.component';
import * as $ from 'jquery';

declare var Circles: any;
declare var Chart: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
	@ViewChild('IncomeChart',  {static: false}) IncomeChart: ElementRef;
	@ViewChild('lineChart',  {static: false}) lineChart: ElementRef;
	@ViewChild('statisticsChart',  {static: false}) statisticsChart: ElementRef;
	@ViewChild('myChartLegend',  {static: false}) myChartLegend: ElementRef;
	@ViewChild('dailySalesChart',  {static: false}) dailySalesChart: ElementRef;
	@ViewChild('topProductsChart',  {static: false}) topProductsChart: ElementRef;


  constructor(private dSL: DynamicScriptLoaderService) { }

  ngOnInit() {
	SidebarComponent.sidebarcomponent.addActiveClassOnSideBarMenu(0);
  }

  ngAfterViewInit() {
	this.loadScripts();
  }

  private loadScripts() {
    // You can load multiple scripts by just providing the key as argument into load method of the service
    this.dSL.load('chartjs', 'chartcircle').then(data => {
      // Script Loaded Successfully
      this.createCircleChart();
    }).catch(error => console.log(error));
  }

  createCircleChart(){
	// $(document).ready(function(){

		Circles.create({
			id:'circles-1',
			radius:45,
			value:60,
			maxValue:100,
			width:7,
			text: 5,
			colors:['#f1f1f1', '#FF9E27'],
			duration:400,
			wrpClass:'circles-wrp',
			textClass:'circles-text',
			styleWrapper:true,
			styleText:true
		})

		Circles.create({
			id:'circles-2',
			radius:45,
			value:70,
			maxValue:100,
			width:7,
			text: 36,
			colors:['#f1f1f1', '#2BB930'],
			duration:400,
			wrpClass:'circles-wrp',
			textClass:'circles-text',
			styleWrapper:true,
			styleText:true
		})

		Circles.create({
			id:'circles-3',
			radius:45,
			value:40,
			maxValue:100,
			width:7,
			text: 12,
			colors:['#f1f1f1', '#F25961'],
			duration:400,
			wrpClass:'circles-wrp',
			textClass:'circles-text',
			styleWrapper:true,
			styleText:true
		})

		Circles.create({
			id:           'task-complete',
			radius:       50,
			value:        80,
			maxValue:     100,
			width:        5,
			text:         function(value){return value + '%';},
			colors:       ['#36a3f7', '#fff'],
			duration:     400,
			wrpClass:     'circles-wrp',
			textClass:    'circles-text',
			styleWrapper: true,
			styleText:    true
		})

		// console.log(this.IncomeChart.nativeElement.getContext('2d'));		

		var totalIncomeChart = this.IncomeChart.nativeElement.getContext('2d');

		var mytotalIncomeChart = new Chart(totalIncomeChart, {
			type: 'bar',
			data: {
				labels: ["S", "M", "T", "W", "T", "F", "S", "S", "M", "T"],
				datasets : [{
					label: "Total Income",
					backgroundColor: '#ff9e27',
					borderColor: 'rgb(23, 125, 255)',
					data: [6, 4, 9, 5, 4, 6, 4, 3, 8, 10],
				}],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					display: false,
				},
				scales: {
					yAxes: [{
						ticks: {
							display: false //this will remove only the label
						},
						gridLines : {
							drawBorder: false,
							display : false
						}
					}],
					xAxes : [ {
						gridLines : {
							drawBorder: false,
							display : false
						}
					}]
				},
			}
		});

		// $('#lineChart').sparkline([105,103,123,100,95,105,115], {
		// 	type: 'line',
		// 	height: '70',
		// 	width: '100%',
		// 	lineWidth: '2',
		// 	lineColor: '#ffa534',
		// 	fillColor: 'rgba(255, 165, 52, .14)'
		// });


		//Chart

		var ctx = this.statisticsChart.nativeElement.getContext('2d');

		var statisticsChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
				datasets: [ {
					label: "Subscribers",
					borderColor: '#f3545d',
					pointBackgroundColor: 'rgba(243, 84, 93, 0.6)',
					pointRadius: 0,
					backgroundColor: 'rgba(243, 84, 93, 0.4)',
					legendColor: '#f3545d',
					fill: true,
					borderWidth: 2,
					data: [154, 184, 175, 203, 210, 231, 240, 278, 252, 312, 320, 374]
				}, {
					label: "New Visitors",
					borderColor: '#fdaf4b',
					pointBackgroundColor: 'rgba(253, 175, 75, 0.6)',
					pointRadius: 0,
					backgroundColor: 'rgba(253, 175, 75, 0.4)',
					legendColor: '#fdaf4b',
					fill: true,
					borderWidth: 2,
					data: [256, 230, 245, 287, 240, 250, 230, 295, 331, 431, 456, 521]
				}, {
					label: "Active Users",
					borderColor: '#177dff',
					pointBackgroundColor: 'rgba(23, 125, 255, 0.6)',
					pointRadius: 0,
					backgroundColor: 'rgba(23, 125, 255, 0.4)',
					legendColor: '#177dff',
					fill: true,
					borderWidth: 2,
					data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 900]
				}]
			},
			options : {
				responsive: true, 
				maintainAspectRatio: false,
				legend: {
					display: false
				},
				tooltips: {
					bodySpacing: 4,
					mode:"nearest",
					intersect: 0,
					position:"nearest",
					xPadding:10,
					yPadding:10,
					caretPadding:10
				},
				layout:{
					padding:{left:5,right:5,top:15,bottom:15}
				},
				scales: {
					yAxes: [{
						ticks: {
							fontStyle: "500",
							beginAtZero: false,
							maxTicksLimit: 5,
							padding: 10
						},
						gridLines: {
							drawTicks: false,
							display: false
						}
					}],
					xAxes: [{
						gridLines: {
							zeroLineColor: "transparent"
						},
						ticks: {
							padding: 10,
							fontStyle: "500"
						}
					}]
				}, 
				legendCallback: function(chart) { 
					var text = []; 
					text.push('<ul class="' + chart.id + '-legend html-legend">'); 
					for (var i = 0; i < chart.data.datasets.length; i++) { 
						text.push('<li><span style="background-color:' + chart.data.datasets[i].legendColor + '"></span>'); 
						if (chart.data.datasets[i].label) { 
							text.push(chart.data.datasets[i].label); 
						} 
						text.push('</li>'); 
					} 
					text.push('</ul>'); 
					return text.join(''); 
				}  
			}
		});

		var myLegendContainer = this.myChartLegend.nativeElement;

		// generate HTML legend
		myLegendContainer.innerHTML = statisticsChart.generateLegend();

		// bind onClick event to all LI-tags of the legend
		var legendItems = myLegendContainer.getElementsByTagName('li');
		for (var i = 0; i < legendItems.length; i += 1) {
			// legendItems[i].addEventListener("click", legendClickCallback, false);
		}

		var dailySalesChart = this.dailySalesChart.nativeElement.getContext('2d');

		var myDailySalesChart = new Chart(dailySalesChart, {
			type: 'line',
			data: {
				labels:["January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September"],
				datasets:[ {
					label: "Sales Analytics", fill: !0, backgroundColor: "rgba(255,255,255,0.2)", borderColor: "#fff", borderCapStyle: "butt", borderDash: [], borderDashOffset: 0, pointBorderColor: "#fff", pointBackgroundColor: "#fff", pointBorderWidth: 1, pointHoverRadius: 5, pointHoverBackgroundColor: "#fff", pointHoverBorderColor: "#fff", pointHoverBorderWidth: 1, pointRadius: 1, pointHitRadius: 5, data: [65, 59, 80, 81, 56, 55, 40, 35, 30]
				}]
			},
			options : {
				maintainAspectRatio:!1, legend: {
					display: !1
				}
				, animation: {
					easing: "easeInOutBack"
				}
				, scales: {
					yAxes:[ {
						display:!1, ticks: {
							fontColor: "rgba(0,0,0,0.5)", fontStyle: "bold", beginAtZero: !0, maxTicksLimit: 10, padding: 0
						}
						, gridLines: {
							drawTicks: !1, display: !1
						}
					}
					], xAxes:[ {
						display:!1, gridLines: {
							zeroLineColor: "transparent"
						}
						, ticks: {
							padding: -20, fontColor: "rgba(255,255,255,0.2)", fontStyle: "bold"
						}
					}
					]
				}
			}
		});

		// $("#activeUsersChart").sparkline([112,109,120,107,110,85,87,90,102,109,120,99,110,85,87,94], {
		// 	type: 'bar',
		// 	height: '100',
		// 	barWidth: 9,
		// 	barSpacing: 10,
		// 	barColor: 'rgba(255,255,255,.3)'
		// });

		var topProductsChart = this.topProductsChart.nativeElement.getContext('2d');

		var myTopProductsChart = new Chart(topProductsChart, {
			type:"line",
			data: {
				labels:["January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"January",
				"February",
				"March",
				"April"],
				datasets:[ {
					label: "Sales Analytics", fill: !0, backgroundColor: "rgba(53, 205, 58, 0.2)", borderColor: "#35cd3a", borderCapStyle: "butt", borderDash: [], borderDashOffset: 0, pointBorderColor: "#35cd3a", pointBackgroundColor: "#35cd3a", pointBorderWidth: 1, pointHoverRadius: 5, pointHoverBackgroundColor: "#35cd3a", pointHoverBorderColor: "#35cd3a", pointHoverBorderWidth: 1, pointRadius: 1, pointHitRadius: 5, data: [20, 10, 18, 14, 32, 18, 15, 22, 8, 6, 17, 12, 17, 18, 14, 25, 18, 12, 19, 21, 16, 14, 24, 21, 13, 15, 27, 29, 21, 11, 14, 19, 21, 17]
				}
				]
			},
			options : {
				maintainAspectRatio:!1, legend: {
					display: !1
				}
				, animation: {
					easing: "easeInOutBack"
				}
				, scales: {
					yAxes:[ {
						display:!1, ticks: {
							fontColor: "rgba(0,0,0,0.5)", fontStyle: "bold", beginAtZero: !0, maxTicksLimit: 10, padding: 0
						}
						, gridLines: {
							drawTicks: !1, display: !1
						}
					}
					], xAxes:[ {
						display:!1, gridLines: {
							zeroLineColor: "transparent"
						}
						, ticks: {
							padding: -20, fontColor: "rgba(255,255,255,0.2)", fontStyle: "bold"
						}
					}
					]
				}
			}
		});
	// })
  }

}
