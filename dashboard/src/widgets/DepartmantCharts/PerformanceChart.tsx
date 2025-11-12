import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chart from "react-apexcharts";
import React from "react";
import { useChart } from "@canmingir/link/platform/components";
import useColleagues from "../../hooks/useColleagues";
import { useMediaQuery } from "@mui/material";

function PerformanceChart() {
  const { colleagues } = useColleagues();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

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
    <Card
      key={2}
      style={{
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        maxHeight: isSmallScreen ? "auto" : "600px",
      }}
    >
      <CardHeader title="Team Activity" />
      <CardContent>
        <Chart dir="ltr" type="pie" series={series} options={chartOptions} />
      </CardContent>
    </Card>
  );
}
export default PerformanceChart;
