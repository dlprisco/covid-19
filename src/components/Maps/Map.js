import React, { useRef, useState, useLayoutEffect } from "react";

import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";

import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import countriesById from '../../utils/countriesById.js';

am4core.useTheme(am4themes_animated);

export default function VEmap() {
	const chart = useRef(null);

	const [countries, setCountriesData] = useState([]);
	const [loadingCountriesData, setLoadingCountriesData] = useState(true);


	useLayoutEffect(() => {
		let x = am4core.create('mapchart', am4maps.MapChart);

		if (loadingCountriesData) {
			fetchCountriesData();
		}

		// Set map definition
		x.geodataSource.url = 'https://www.amcharts.com/lib/4/geodata/json/venezuelaHigh.json';
  		x.geodataSource.events.on("parseended", function(ev) {
   		 var data = [];
   		 for (var i = 0; i < ev.target.data.features.length; i++) {
     		  data.push({
      		    id: ev.target.data.features[i].id,
      		    value: getCountryData(ev.target.data.features[i].id)
     		  })
   		    }
  		    polygonSeries.data = data;
 		})

 		x.projection = new am4maps.projections.Mercator();

 		var polygonSeries = x.series.push(new am4maps.MapPolygonSeries());

 		polygonSeries.heatRules.push({
 			property: 'fill',
 			target: polygonSeries.mapPolygons.template,
 			min: x.colors.getIndex(1).brighten(1),
 			max: x.colors.getIndex(1).brighten(-0.3),
 		})

 		polygonSeries.useGeodata = true;

  // Configure series tooltip
  var polygonTemplate = polygonSeries.mapPolygons.template;
  polygonTemplate.tooltipText = "{name}: {value}";
  polygonTemplate.nonScalingStroke = true;
  polygonTemplate.strokeWidth = 0.5;

  // Create hover state and set alternative fill color
  var hs = polygonTemplate.states.create("hover");
  hs.properties.fill = x.colors.getIndex(1).brighten(-0.3);

  chart.current = x;

  function getCountryData(id) {
  	if (id === 'AW' || id === 'BQ' || id === 'CW') {
  		return (NaN)
  	}

  	return countries[countriesById[id]];
  }

  return () => {
  	 x.dispose();
	};
  }, [loadingCountriesData, countries]);


   function fetchCountriesData() {
    fetch('https://covid19.patria.org.ve/api/v1/summary').then(response => response.json())
      .then(json => {
      	setCountriesData(json.Confirmed.ByState);
        setLoadingCountriesData(false);
      })
      .catch(err => {
        console.error(err);
      });
  }

  return (
      <div id="mapchart" style={{ width: "100%", height: "500px" }}></div>
    );
}
