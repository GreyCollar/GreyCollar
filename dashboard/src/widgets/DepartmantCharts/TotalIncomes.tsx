import Chart from "react-apexcharts";
import React from "react";
import TotalIncomes from "../../components/TotalIncomes/TotalIncomes";
import { useChart } from "@canmingir/link/minimal/components";
import { useTheme } from "@mui/material/styles";
export default function TotalIncome({ size }: { size?: string }) {
  const theme = useTheme();
  const colors = [theme.palette["primary"].main, theme.palette["primary"].dark];

  const chartOptions = useChart({
    colors: [colors[1]],
    fill: {
      type: "gradient",
      gradient: {
        colorStops: [
          { offset: 0, color: colors[0], opacity: 1 },
          { offset: 100, color: colors[1], opacity: 1 },
        ],
      },
    },
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    xaxis: {
      labels: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    stroke: {
      width: 4,
    },
    legend: {
      show: false,
    },
    grid: {
      show: false,
    },
    tooltip: {
      marker: {
        show: false,
      },
      y: {
        formatter: (value) => value,
        title: {
          formatter: () => "",
        },
      },
    },
  });

  const series = [
    { x: 2016, y: 111 },
    { x: 2017, y: 136 },
    { x: 2018, y: 76 },
    { x: 2019, y: 108 },
    { x: 2020, y: 74 },
    { x: 2021, y: 54 },
    { x: 2022, y: 57 },
    { x: 2023, y: 84 },
  ];

  const Charst = () => {
    return (
      <Chart
        dir="ltr"
        type="line"
        series={[{ data: series }]}
        options={chartOptions}
        width="100%"
        height={118}
      />
    );
  };

  return (
    <TotalIncomes
      title="Total Messages"
      total={size}
      percent={0}
      chart={<Charst />}
      sx={""}
    />
  );
}
