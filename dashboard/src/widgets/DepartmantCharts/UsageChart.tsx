import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chart from "react-apexcharts";
import React from "react";
import { useChart } from "@nucleoidai/platform/minimal/components";

function UsageChart() {
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
    <Card>
      <CardHeader title="TAA" />
      <CardContent>
        <Chart
          dir="ltr"
          type="area"
          series={series2}
          options={chartOptions2}
          width="100%"
          height={320}
        />
      </CardContent>
    </Card>
  );
}

export default UsageChart;
