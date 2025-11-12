import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chart from "react-apexcharts";
import React from "react";
import { useChart } from "@canmingir/link/platform/components";
import { useMediaQuery } from "@mui/material";

function UsageChart() {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const series2 = [
    { name: "series1", data: [] },
    { name: "series2", data: [] },
  ];
  const chartOptions2 = useChart({
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  });

  return (
    <Card
      style={{
        width: "100%",
        maxWidth: "100%",
        height: "100%",
        maxHeight: isSmallScreen ? "auto" : "600px",
        marginTop: isSmallScreen ? "6px" : "0",
      }}
    >
      <CardHeader title="TAA" />
      <CardContent>
        <Chart dir="ltr" type="area" series={series2} options={chartOptions2} />
      </CardContent>
    </Card>
  );
}

export default UsageChart;
