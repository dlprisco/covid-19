import React, { useState, useRef, useLayoutEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4themes_animated);

export default function LineChartXY() {
  const chart = useRef(null);

  const [timelineData, setTimelineData] = useState([])
  const [loadingTimeline, setLoadingTimeline] = useState(true)

  useLayoutEffect(() => {
    let x = am4core.create("chartdiv", am4charts.XYChart);

    if (loadingTimeline) {
      fetchTimelineData()
    }

    x.paddingRight = 5;

    x.data = timelineData;
	let dateAxis = x.xAxes.push(new am4charts.DateAxis());
	let dateAxis2 = x.xAxes.push(new am4charts.DateAxis());
	let dateAxis3 = x.xAxes.push(new am4charts.DateAxis());

dateAxis.renderer.minGridDistance = 35; dateAxis2.renderer.minGridDistance = 35; dateAxis3.renderer.minGridDistance = 35;

	let valueAxis = x.yAxes.push(new am4charts.ValueAxis());
	let valueAxis3 = x.yAxes.push(new am4charts.ValueAxis());
  let valueAxis2 = x.yAxes.push(new am4charts.ValueAxis());

	// Create series
	let series = x.series.push(new am4charts.LineSeries());
	series.name = 'Confirmed';
	series.dataFields.valueY = "confirmed";
	series.dataFields.dateX = "date";
	series.strokeWidth = 2;
  	series.yAxis = valueAxis;
	series.tooltipText = "{name}: {valueY}[/]";  series.tooltip.pointerOrientation = "vertical";
	series.tooltip.label.padding(12,12,12,12)
	series.fill = am4core.color("#0000FF");
  	series.stroke = am4core.color("#0000FF");

	// ...
	let series2 = x.series.push(new am4charts.LineSeries());
	series2.name = 'Recovered';
	series2.dataFields.valueY = "recovered";
	series2.dataFields.dateX = "date2";
	series2.strokeWidth = 2;
	series2.tooltipText = "{name}: {valueY}[/]";
  series.tooltip.pointerOrientation = "vertical";
	series2.tooltip.label.padding(12,12,12,12)
	series2.fill = am4core.color("#0000FF");
  series2.stroke = am4core.color("#10FF00");

	// ...
	let series3 = x.series.push(new am4charts.LineSeries());
	series3.name = 'Deaths';
	series3.dataFields.valueY = "deaths";
	series3.dataFields.dateX = "date3";
	series3.strokeWidth = 2;
	series3.tooltipText = "{name}: {valueY}[/]";
  series.tooltip.pointerOrientation = "vertical";
	series3.tooltip.label.padding(12,12,12,12)
	series3.fill = am4core.color("#0000FF");
  series3.stroke = am4core.color("#FF0000");

	// Add scrollbar

	// Add cursor
	  x.cursor = new am4charts.XYCursor();
    x.cursor.xAxis = dateAxis;

	  x.cursor.snapToSeries = [series, series2, series3];
  	
  	x.legend = new am4charts.Legend();
	  x.legend.parent = x.plotContainer;
  	x.legend.zIndex = 100;
 	
  	valueAxis.renderer.grid.template.strokeOpacity = 0.07;
  	valueAxis2.renderer.grid.template.strokeOpacity = 0.07;
  	dateAxis.renderer.grid.template.strokeOpacity = 0.07;
  	dateAxis2.renderer.grid.template.strokeOpacity = 0.07;
  	dateAxis3.renderer.grid.template.strokeOpacity = 0.07;
  	
  	valueAxis3.renderer.grid.template.strokeOpacity = 0.07;

 	chart.current = x;

    return () => {
      x.dispose();
    };
  }, [loadingTimeline, timelineData]);


    function fetchTimelineData() {
      fetch('https://covid19.patria.org.ve/api/v1/timeline')
      .then(response => response.json())
      .then(json=>{
        
        let data = [];
        let deaths = 0;
        let recovered = 0;
        let confirmed = 0;

        for (let i = 0; i < json.length; i++) {
        	var d = parseInt(json[i].Date.slice(0, 4));
        	var d1 = parseInt(json[i].Date.slice(5, 7));
        	var d2 = parseInt(json[i].Date.slice(8, 10));

        	confirmed = json[i].Confirmed.New;

        	data.push({ 
             date: new Date(d, d1, d2),
             name: 'confirmed',
             confirmed: confirmed,  
            });
          }

        for (let i = 0; i < json.length; i++) {
          var d0 = parseInt(json[i].Date.slice(0, 4));
          var d01 = parseInt(json[i].Date.slice(5, 7));
          var d02 = parseInt(json[i].Date.slice(8, 10));

          recovered = json[i].Recovered.New;

           data.push({ 
             date2: new Date(d0, d01, d02),
             name: 'recovered',
             recovered: recovered,  
            });
          }

        for (let i = 0; i < json.length; i++) {
        	deaths = json[i].Deaths.New;
           data.push({ 
             date3: new Date(json[i].Date.slice(0, 4), json[i].Date.slice(5, 7), json[i].Date.slice(8, 10)),
             name: 'deaths',
             deaths: deaths,  
            });
          }
        setTimelineData(data);
        setLoadingTimeline(false);
      }).catch(err=>{
        console.error(err);
      });
    }


  return (
    <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
  );
}