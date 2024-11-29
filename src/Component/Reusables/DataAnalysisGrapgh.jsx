import React from "react";
import { Chart } from "react-google-charts";

export function DataAnalysisGrapgh({ graphData }) {

  const data = Object.entries(graphData).map(([key, value]) => [
    key,
    value,
    "#65a3ff",
  ]);
  const options = {
    legend: "none",
    hAxis: { 
      textPosition: 'none',
      minValue:1
    },
    chartArea: {
      top: 7, // Adjust as needed to reduce top space
      bottom: 20, // Adjust as needed to reduce bottom space
      // width: "80%", // Ensure the entire width is used
      // height: "50%", // Adjust as needed to reduce overall height
    },
  }

  data.unshift(["Element", "Consumer Weight", { role: "style" }]);
  return (
    <Chart
      chartType="BarChart"
      width="100%"
      height="250px"
      data={data}
      options={options}
    />
  );
}
