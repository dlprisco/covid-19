import React, {useRef, useLayoutEffect, useState} from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import VEmap from './components/Maps/Map.js';
// react plugin for creating charts
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import GridItem from "./components/Grid/GridItem.js";
import GridContainer from "./components/Grid/GridContainer.js";
import CustomTabs from "./components/CustomTabs/CustomTabs.js";
import Card from "./components/Card/Card.js";
import CardHeader from "./components/Card/CardHeader.js";
import CardBody from "./components/Card/CardBody.js";
import CardFooter from "./components/Card/CardFooter.js";
import LineChartXY from "./components/Charts/LineChartXY";
import Table from "./components/Table/Table.js";
import AccessTime from "@material-ui/icons/AccessTime"

import {
  successColor,
  whiteColor,
  grayColor,
  hexToRgb,
} from "./assets/jss/material-dashboard-react.js";

const styles = {
  successText: {
    color: successColor[0],
  },
  upArrowCardCategory: {
    width: "16px",
    height: "16px",
  },
  stats: {
    color: grayColor[0],
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px",
    },
    "& .fab,& .fas,& .far,& .fal": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px",
    },
  },
  cardCategory: {
    color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0",
  },
  cardCategoryWhite: {
    color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0",
  },
  cardTitle: {
    color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1",
    },
  },
  cardTitleWhite: {
    color: whiteColor,
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1",
    },
  },
};

const useStyles = makeStyles(styles);
am4core.useTheme(am4themes_animated);

export default function Dashboard() {

  const chart = useRef(null);

  const [mappedResponse, setRespnseJSON] = useState({});
  
  const [loading, setLoading] = useState(true);
  const [loadingTimeline, setLoadingTimeline] = useState(true);

  
  useLayoutEffect(() => {
    if (loading) {
      fetchJsonResponse();
    }
    if (loadingTimeline) {
      fetchTimelineData();
    }

    let x = am4core.create("chartdiv", am4charts.XYChart);

    chart.current = x;

    return () => {
      x.dispose();
    };
  }, [loading, loadingTimeline]);

  async function fetchJsonResponse() {
    await fetch('https://covid19.patria.org.ve/api/v1/summary').then(response => response.json())
      .then(json => {
        console.log(json);
        setRespnseJSON(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
      });
    }

    function fetchTimelineData() {
      fetch('https://covid19.patria.org.ve/api/v1/timeline')
      .then(response => response.json())
      .then(json=>{
        
        let data = [];

        for (let i = 0; i < json.length; i++) {
          var d = parseInt(json[i].Date.slice(0, 4));
          var d1 = parseInt(json[i].Date.slice(5, 7));
          var d2 = parseInt(json[i].Date.slice(8, 10));

           data.push({ 
             date: new Date(d, d1, d2),
             name: 'Confirmed',
             confirmed: json[i].Confirmed.new,  
            });
          }
        
        setLoadingTimeline(false);
      }).catch(err=>{
        console.error(err);
      });
    }

  const classes = useStyles();
  var countries = [];
  var ageCases = [];
  
  if (!loading) {
    // Create items array
    countries = Object.keys(mappedResponse.Confirmed.ByState).map(function(key) {
      return [key, mappedResponse.Confirmed.ByState[key]];
    });
  
    // Sort the array based on the second element
    countries.sort(function(first, second) {
      return second[1] - first[1];
    });

    ageCases = Object.keys(mappedResponse.Confirmed.ByAgeRange).map(function(key) {
      return [key, mappedResponse.Confirmed.ByAgeRange[key]]
    })
  
  } 
  
  return (
    <>
    <div>
    <GridContainer>
      <GridItem >
        <CustomTabs
          title="Confirmed:"
          headerColor="success"
          tabs={[
              {
                tabName: "Deaths",
                tabContent: (
                  <>
                  <Card>
                  <CardHeader style={{backgroundColor:'lightred'}}>
                  <h2 >Count:</h2>
                  <h3 style={{color:'red'}}>{mappedResponse.Deaths.Count}</h3>
                  </CardHeader>
                </Card>
                  </>
                ),
              },
              {
                tabName: "Cases",
                tabContent: (
                  <>
                  <Card>
                  <CardHeader>
                  <h2>Count:</h2>
                  <h3 style={{color:'blue'}}>{mappedResponse.Confirmed.Count}</h3>
                  </CardHeader>
                  </Card>
                   <Table className='responsive'
                     tableHeaderColor="gray"
                     tableHead={["Country","Cases"]}
                     tableData={countries}/>
                  </>
                ),
              },
              {
                tabName: "Total",
                tabContent: (
                  <>
                    <Card>
                      <Card>                             
                        <h4 style={{color:"green"}}>Recovered: </h4>
                        <h4>{mappedResponse.Recovered.Count}</h4>
                      </Card>
                      <Card>                             
                        <h4 style={{color:"red"}}>Active: </h4>
                        <h4>{mappedResponse.json.Active.Count}</h4>
                      </Card>
                    </Card>
                  </>
                ),
              },
            ]}
          />
        </GridItem>
        <GridItem>
          <Card>
            <CardHeader style={{backgroundColor:'lightblue'}}>
              <h1 className={classes.cardCategoryWhite}>Active cases </h1>
              <p className={classes.cardCategoryWhite}>
                Active cases by Age
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={["Age", "Cases"]}
                tableData={ageCases}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
          <Card>
            <CardHeader> 
             <Card>
            <CardHeader style={{backgroundColor:'lightblue'}}>
              <h4 className={classes.cardTitleWhite}>COVID-19 Statistics</h4>
            </CardHeader>
            </Card>
             <LineChartXY />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Timeline</h4>
              <p className={classes.cardCategory}>Timeline data representation</p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Last 24 hrs update...
              </div>
            </CardFooter>
          </Card>
      </GridContainer>
      <GridContainer>
          <Card>
            <CardHeader> 
             <Card>
            <CardHeader style={{backgroundColor:'lightblue'}}>
              <h4 className={classes.cardTitleWhite}>Country map</h4>
            </CardHeader>
            </Card>
             <VEmap />
            </CardHeader>
            <CardBody>
            </CardBody>
          </Card>
      </GridContainer>
    </div>
    <div >
      <p>Made by: <a href={"https://www.twitter.com/blaessster"} style={{color:'white'}}>@blaessster</a></p>
    </div>
    </>
  );
}
