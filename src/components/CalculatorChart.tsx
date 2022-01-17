import { useLayoutEffect } from "react";
import Highcharts, { SeriesXrangeOptions } from "highcharts";
import { intToString, intToStringLongFormat } from "../utils/number";
import { Datapoint } from "./Calculator";

const CalculatorChart = ({
  monthlyInvesting,
  monthlyInterest,
}: {
  monthlyInvesting: Datapoint[];
  monthlyInterest: Datapoint[];
}) => {
  useLayoutEffect(() => {
    Highcharts.chart({
      chart: {
        type: "column",
        renderTo: "calc-chart",
        height: 400,
      },
      credits: {
        enabled: false,
      },
      title: {
        text: "",
      },
      xAxis: {
        type: "datetime",
        tickmarkPlacement: "on",
      },
      yAxis: {
        labels: {
          formatter: function () {
            return intToString(Number(this.value)) + " €";
          },
        },
      },
      tooltip: {
        split: true,
        valueSuffix: " EUR",
        formatter: function () {
          return Array.isArray(this.points)
            ? `Growth: ${intToStringLongFormat(
                Number(this.points[0].y)
              )} €<br/>Investment: ${intToStringLongFormat(
                Number(this.points[1].y)
              )} €`
            : "No data.";
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
        },
      },
      series: [
        {
          name: "Growth",
          stack: 0,
          data: monthlyInterest,
          color: "#e6007e",
        } as any,
        {
          name: "Monthly investments",
          stack: 0,
          data: monthlyInvesting,
          color: "#002b3f",
        } as any,
      ],
    });
  }, [monthlyInvesting, monthlyInterest]);

  return <div id="calc-chart" style={{ marginTop: "2em", minHeight: 400 }} />;
};

export default CalculatorChart;
