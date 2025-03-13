import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chart from "react-apexcharts";
import React from "react";
import { useChart } from "@nucleoidai/platform/minimal/components";
import useColleagues from "../../hooks/useColleagues";

function PerformanceChart() {
  const { colleagues } = useColleagues();

  const names = [
    ...colleagues.map((colleague) => colleague.name),
    "No Activity",
  ];

  const series = new Array(colleagues.length).fill(1).concat(100);

  const chartOptions = useChart({
    labels: names,
    colors: [...new Array(colleagues.length).fill(undefined), "#344055"],
    legend: {
      position: "right",
      offsetX: -20,
      offsetY: 64,
      itemMargin: {
        vertical: 8,
      },
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
  });

  return (
    <Card key={2}>
      <CardHeader title="Team Activity" />
      <CardContent>
        <Chart dir="ltr" type="pie" series={series} options={chartOptions} />
      </CardContent>
    </Card>
  );
}
export default PerformanceChart;
